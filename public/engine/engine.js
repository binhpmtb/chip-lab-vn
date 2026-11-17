// Chip Lab engine adapter, GPL-2.0-or-later. Uses the VeriSim Icarus port.
// Attribution and complete corresponding source are linked in /source/ and /licenses/.
const MAX_SOURCE = 200000;
const MAX_LOG = 100000;

function validateSource(source) {
  if (typeof source !== 'string' || source.length > MAX_SOURCE) {
    throw new Error('Source must be text under 200,000 characters.');
  }
}

function collector() {
  let log = '';
  return { append: value => { if (log.length < MAX_LOG) log += String(value) + '\n'; }, read: () => log };
}

function runMain(module, args, log) {
  const status = module.callMain(args);
  if (status !== 0 && status !== undefined) throw new Error(log() || `Tool exited with status ${status}`);
}

export async function simulate(design, testbench, progress = () => {}) {
  validateSource(design);
  validateSource(testbench);
  progress('Loading Icarus Verilog WASM…');
  const [{default: initIvlpp}, {default: initIvl}, {default: initVvp}] = await Promise.all([
    import('./ivlpp.js'), import('./ivl.js'), import('./vvp.js')
  ]);
  const diagnostics = collector();
  const source = [];
  const preprocessor = await initIvlpp({print: text => source.push(text), printErr: diagnostics.append});
  preprocessor.FS.writeFile('/design.sv', design + '\n');
  preprocessor.FS.writeFile('/testbench.sv', testbench + '\n');
  progress('Preprocessing design and testbench…');
  runMain(preprocessor, ['-L', '/design.sv', '/testbench.sv'], diagnostics.read);
  const compiler = await initIvl({print: diagnostics.append, printErr: diagnostics.append});
  compiler.FS.writeFile('/ivl.conf', 'basedir:/\ngeneration:2012\ngeneration:no-specify\nout:/out.vvp\niwidth:32\nwidthcap:65536\nfunctor:cprop\nfunctor:nodangle\nflag:DLL=vvp.tgt\nflag:VPI_MODULE_LIST=system.vpi\n');
  compiler.FS.writeFile('/source.sv', source.join('\n') + '\n');
  progress('Compiling SystemVerilog…');
  runMain(compiler, ['-C/ivl.conf', '--', '/source.sv'], diagnostics.read);
  const bytecode = compiler.FS.readFile('/out.vvp');
  const runtime = await initVvp({print: diagnostics.append, printErr: diagnostics.append});
  runtime.FS.writeFile('/sim.vvp', bytecode);
  progress('Simulating…');
  runMain(runtime, ['/sim.vvp'], diagnostics.read);
  let vcd = '';
  try { vcd = runtime.FS.readFile('/dump.vcd', {encoding: 'utf8'}); }
  catch { diagnostics.append('No dump.vcd. Add $dumpfile("dump.vcd") and $dumpvars(0, tb) to your testbench.'); }
  if (vcd.length > 5000000) throw new Error('Waveform exceeds 5 MB. Reduce simulation duration or dumped signals.');
  return {log: diagnostics.read(), vcd};
}

export async function synthesize(design, progress = () => {}) {
  validateSource(design);
  progress('Loading Yosys WASM (first load may take a moment)…');
  const {runYosys} = await import('./yosys.js');
  const diagnostics = collector();
  const decode = value => value == null ? '' : typeof value === 'string' ? value : new TextDecoder().decode(value);
  try {
    const files = await runYosys(['-p', 'read_verilog -sv design.sv; synth -auto-top -flatten; write_json netlist.json; stat'],
      {'design.sv': new TextEncoder().encode(design)},
      {stdout: value => diagnostics.append(decode(value)), stderr: value => diagnostics.append(decode(value)),
        fetchProgress: ({totalLength, doneLength}) => progress(totalLength ? `Loading Yosys ${Math.round(doneLength / totalLength * 100)}%` : 'Loading Yosys…')});
    if (!files['netlist.json']) throw new Error('Yosys did not produce a netlist.');
    return {log: diagnostics.read(), netlist: JSON.parse(decode(files['netlist.json']))};
  } catch (error) {
    throw new Error(diagnostics.read() + '\n' + (error?.message || String(error)));
  }
}
