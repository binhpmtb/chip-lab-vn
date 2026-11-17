"use client";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { Decoration } from "@codemirror/view";
import { StreamLanguage } from "@codemirror/language";
import { verilog } from "@codemirror/legacy-modes/mode/verilog";
const extensions = [StreamLanguage.define(verilog)];
export default function Editor({
  value,
  onChange,
  label,
  dark,
  errorLine,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  dark: boolean;
  errorLine?: number;
}) {
  return (
    <CodeMirror
      aria-label={label}
      value={value}
      height="340px"
      theme={dark ? "dark" : "light"}
      extensions={[
        ...extensions,
        EditorView.decorations.compute(["doc"], state => errorLine && errorLine <= state.doc.lines ? Decoration.set([Decoration.line({class: "compile-error-line"}).range(state.doc.line(errorLine).from)]) : Decoration.none),
        EditorView.contentAttributes.of({ "aria-label": label }),
      ]}
      onChange={onChange}
      basicSetup={{
        lineNumbers: true,
        foldGutter: true,
        highlightActiveLine: false,
      }}
    />
  );
}
