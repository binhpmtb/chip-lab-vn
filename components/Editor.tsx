"use client";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { Decoration } from "@codemirror/view";
import {
  StreamLanguage,
  syntaxHighlighting,
  HighlightStyle,
} from "@codemirror/language";
import { tags } from "@lezer/highlight";
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
      theme={EditorView.theme(
        {
          "&": {
            backgroundColor: "#123A55",
            color: "#FFFFFF",
            fontFamily: '"Courier New", Cousine, monospace',
            fontSize: "14px",
          },
          ".cm-content": { caretColor: "#B1D458" },
          ".cm-scroller": {
            fontFamily: '"Courier New", Cousine, monospace',
            lineHeight: "1.65",
            overflow: "auto",
          },
          ".cm-gutters": {
            backgroundColor: "#123A55",
            color: "#F4F7F9",
            borderRight: "1px solid #1B5073",
          },
          ".cm-cursor": { borderLeftColor: "#B1D458" },
          "&.cm-focused": { outline: "2px solid #B1D458" },
          ".cm-selectionBackground, &.cm-focused .cm-selectionBackground": {
            backgroundColor: "#1B5073",
          },
        },
        { dark: true },
      )}
      extensions={[
        ...extensions,
        syntaxHighlighting(
          HighlightStyle.define([
            { tag: [tags.keyword, tags.number, tags.bool], color: "#B1D458" },
            { tag: [tags.comment, tags.string], color: "#F4F7F9" },
            {
              tag: [tags.variableName, tags.operator, tags.punctuation],
              color: "#FFFFFF",
            },
          ]),
        ),
        EditorView.decorations.compute(["doc"], (state) =>
          errorLine && errorLine <= state.doc.lines
            ? Decoration.set([
                Decoration.line({ class: "compile-error-line" }).range(
                  state.doc.line(errorLine).from,
                ),
              ])
            : Decoration.none,
        ),
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
