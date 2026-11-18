"use client";
import { useState, type ComponentPropsWithoutRef } from "react";
export default function CodeBlock({
  children,
  ...props
}: ComponentPropsWithoutRef<"pre">) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="code-example">
      <div className="code-caption">
        <span>example.v</span>
        <button
          type="button"
          onClick={async (e) => {
            const text =
              e.currentTarget.closest(".code-example")?.querySelector("pre")
                ?.textContent || "";
            try {
              await navigator.clipboard.writeText(text);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            } catch {
              setCopied(false);
            }
          }}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre {...props}>{children}</pre>
    </div>
  );
}
