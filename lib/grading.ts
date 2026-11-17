export function grade(log: string, id: string): boolean {
  return (
    !/FATAL:|ERROR:|CHIPLAB_FAIL/i.test(log) &&
    log.split(/\r?\n/).some((line) => line.trim() === `CHIPLAB_PASS_${id}`)
  );
}
export function readProgress(raw: string | null): string[] {
  try {
    const value: unknown = JSON.parse(raw || "[]");
    return Array.isArray(value)
      ? value.filter((v): v is string => typeof v === "string")
      : [];
  } catch {
    return [];
  }
}
export function basicLint(source: string): string[] {
  const clean = source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
  const starts = (clean.match(/\bmodule\b/g) || []).length;
  const ends = (clean.match(/\bendmodule\b/g) || []).length;
  if (!starts) return ["Thiếu khai báo module / Missing module declaration."];
  if (starts !== ends)
    return [
      "Số module và endmodule chưa khớp / Unmatched module and endmodule.",
    ];
  return [];
}
