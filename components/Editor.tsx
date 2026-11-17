"use client";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { StreamLanguage } from "@codemirror/language";
import { verilog } from "@codemirror/legacy-modes/mode/verilog";
const extensions = [StreamLanguage.define(verilog)];
export default function Editor({
  value,
  onChange,
  label,
  dark,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  dark: boolean;
}) {
  return (
    <CodeMirror
      aria-label={label}
      value={value}
      height="340px"
      theme={dark ? "dark" : "light"}
      extensions={[...extensions, EditorView.contentAttributes.of({ 'aria-label': label })]}
      onChange={onChange}
      basicSetup={{
        lineNumbers: true,
        foldGutter: true,
        highlightActiveLine: false,
      }}
    />
  );
}
