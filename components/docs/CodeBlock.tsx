import type { CodeLanguage } from "@/lib/content/docs";
import { CopyButton } from "./CopyButton";

type Token = { text: string; className?: string };

const KEYWORD = "text-accent-hover";
const PARAM = "text-muted";
const STRING = "text-[#9ec1ff]";
const COMMENT = "text-subtle italic";

const PY_KEYWORDS = new Set([
  "import", "from", "as", "for", "in", "with", "def", "return", "if", "else", "elif", "while", "class", "not", "and", "or", "None", "True", "False", "print",
]);

function kufcadLine(line: string): Token[] {
  const tokens: Token[] = [];
  let commandDone = false;
  for (const part of line.split(/(\s+|"[^"]*")/).filter(Boolean)) {
    if (/^\s+$/.test(part)) tokens.push({ text: part });
    else if (part.startsWith('"')) tokens.push({ text: part, className: STRING });
    else if (!commandDone || /^[A-Z][A-Z0-9_]*$/.test(part)) {
      tokens.push({ text: part, className: KEYWORD });
      commandDone = true;
    } else {
      const eq = part.indexOf("=");
      if (eq > 0) {
        tokens.push({ text: part.slice(0, eq + 1), className: PARAM });
        tokens.push({ text: part.slice(eq + 1) });
      } else tokens.push({ text: part });
    }
  }
  return tokens;
}

function shellLine(line: string): Token[] {
  if (/^\s*#/.test(line)) return [{ text: line, className: COMMENT }];
  const tokens: Token[] = [];
  let commandDone = false;
  for (const part of line.split(/(\s+)/).filter(Boolean)) {
    if (/^\s+$/.test(part)) tokens.push({ text: part });
    else if (!commandDone) {
      tokens.push({ text: part, className: KEYWORD });
      commandDone = part !== "sudo";
    } else if (/^(--?[a-z]|\/[A-Z])/.test(part)) tokens.push({ text: part, className: PARAM });
    else tokens.push({ text: part });
  }
  return tokens;
}

function pythonLine(line: string): Token[] {
  const tokens: Token[] = [];
  const pattern = /(#.*$|f?"[^"]*"|\b[A-Za-z_][A-Za-z0-9_]*\b)/g;
  let last = 0;
  for (const match of line.matchAll(pattern)) {
    const start = match.index ?? 0;
    if (start > last) tokens.push({ text: line.slice(last, start) });
    const value = match[0];
    if (value.startsWith("#")) tokens.push({ text: value, className: COMMENT });
    else if (value.endsWith('"')) tokens.push({ text: value, className: STRING });
    else if (PY_KEYWORDS.has(value)) tokens.push({ text: value, className: KEYWORD });
    else tokens.push({ text: value });
    last = start + value.length;
  }
  if (last < line.length) tokens.push({ text: line.slice(last) });
  return tokens;
}

function tokenize(code: string, language: CodeLanguage): Token[][] {
  return code.split("\n").map((line) => {
    if (language === "kufcad") return kufcadLine(line);
    if (language === "python") return pythonLine(line);
    if (language === "bash" || language === "powershell") return shellLine(line);
    return [{ text: line }];
  });
}

const languageLabel: Record<CodeLanguage, string> = {
  kufcad: "KufCad",
  python: "Python",
  bash: "Bash",
  powershell: "PowerShell",
  text: "Text",
};

/** Code listing with lightweight highlighting. Scrolls horizontally inside itself. */
export function CodeBlock({ code, language, title }: { code: string; language: CodeLanguage; title?: string }) {
  const lines = tokenize(code, language);
  return (
    <div className="overflow-hidden rounded-[10px] border border-line bg-surface-1">
      <div className="flex h-10 items-center justify-between gap-3 border-b border-line bg-surface-2/60 pl-4 pr-1.5">
        <span className="min-w-0 truncate font-mono text-[11px] tracking-[0.04em] text-muted">
          {title ?? languageLabel[language]}
          {title ? <span className="text-subtle"> · {languageLabel[language]}</span> : null}
        </span>
        <CopyButton value={code} label={`Copy ${title ?? languageLabel[language]} code`} />
      </div>
      <pre
        tabIndex={0}
        aria-label={title ? `${title} code` : `${languageLabel[language]} code`}
        className="overflow-x-auto px-4 py-3.5 font-mono text-[13px] leading-[1.75] text-fg/90 focus-visible:outline-offset-[-2px]"
      >
        <code>
          {lines.map((tokens, i) => (
            <span key={i} className="block min-h-[1.75em] whitespace-pre">
              {tokens.map((t, j) =>
                t.className ? (
                  <span key={j} className={t.className}>
                    {t.text}
                  </span>
                ) : (
                  t.text
                ),
              )}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
