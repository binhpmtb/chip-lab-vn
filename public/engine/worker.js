import {simulate, synthesize} from './engine.js';

self.onmessage = async ({data}) => {
  try {
    const progress = message => self.postMessage({type: 'progress', message});
    let result;
    if (data.action === 'simulate') result = await simulate(data.design, data.testbench, progress);
    else if (data.action === 'synthesize') result = await synthesize(data.design, progress);
    else throw new Error('Unknown engine action.');
    self.postMessage({type: 'result', ...result});
  } catch (error) {
    self.postMessage({type: 'error', message: error?.message || String(error)});
  }
};
