export type VcdChange = { time: number; value: string };
export type VcdSignal = {
  name: string;
  id: string;
  width: number;
  changes: VcdChange[];
};
export type VcdData = {
  timescale: string;
  endTime: number;
  signals: VcdSignal[];
};

/** Parse IEEE VCD digital signals, preserving aliases, hierarchy and x/z values. */
export function parseVcd(text: string): VcdData {
  const result: VcdData = { timescale: "1 ns", endTime: 0, signals: [] };
  const byId = new Map<string, VcdChange[]>();
  const scopes: string[] = [];
  const tokens = text.match(/\S+/g) || [];
  let index = 0;
  let time = 0;
  while (index < tokens.length) {
    const token = tokens[index++];
    if (
      token.startsWith("$") &&
      !["$dumpvars", "$dumpall", "$dumpon", "$dumpoff", "$end"].includes(token)
    ) {
      const args: string[] = [];
      while (index < tokens.length && tokens[index] !== "$end")
        args.push(tokens[index++]);
      index++;
      if (token === "$timescale") result.timescale = args.join(" ");
      if (token === "$scope") scopes.push(args[1] || "");
      if (token === "$upscope") scopes.pop();
      if (token === "$var" && args.length >= 4 && args[0] !== "real") {
        const id = args[2];
        const changes = byId.get(id) || [];
        byId.set(id, changes);
        result.signals.push({
          name: [...scopes, args.slice(3).join(" ")].join("."),
          id,
          width: Number(args[1]),
          changes,
        });
      }
      continue;
    }
    if (/^#\d+$/.test(token)) {
      time = Number(token.slice(1));
      result.endTime = Math.max(result.endTime, time);
      continue;
    }
    let id: string | undefined;
    let value: string | undefined;
    if (/^[bB][01xXzZ]+$/.test(token)) {
      value = token.slice(1).toLowerCase();
      id = tokens[index++];
    } else if (/^[01xXzZ].+/.test(token)) {
      value = token[0].toLowerCase();
      id = token.slice(1);
    }
    if (id && value !== undefined) byId.get(id)?.push({ time, value });
  }
  return result;
}
