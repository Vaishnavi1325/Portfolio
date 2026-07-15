import { useEffect, useState } from "react";

type Row = { text: string; kind: "cmd" | "out" };

const LINES = [
  { cmd: "$ git clone git@github.com:vaishnavi/portfolio.git", out: "Cloning into 'portfolio'..." },
  { cmd: "$ npm install", out: "added 1284 packages in 12.4s" },
  { cmd: "$ docker compose up -d", out: "✔ Container api  Started  0.6s" },
  { cmd: "$ node server.js", out: "→ listening on http://localhost:3000" },
  { cmd: "$ python app.py", out: "* Running on http://127.0.0.1:5000" },
  { cmd: "$ git push origin main", out: "To github.com:vaishnavi/portfolio.git" },
];

export function LoopingTerminal() {
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    let i = 0;
    let mounted = true;
    async function run() {
      while (mounted) {
        const line = LINES[i % LINES.length];
        // typing effect for cmd
        for (let k = 1; k <= line.cmd.length; k++) {
          if (!mounted) return;
          setRows((r) => {
            const copy = [...r];
            const last = copy[copy.length - 1];
            if (last && last.kind === "cmd" && last.text.length < line.cmd.length) {
              copy[copy.length - 1] = { kind: "cmd", text: line.cmd.slice(0, k) };
            } else {
              copy.push({ kind: "cmd", text: line.cmd.slice(0, k) });
            }
            return copy.slice(-9);
          });
          await sleep(28);
        }
        await sleep(220);
        setRows((r) => [...r, { kind: "out" as const, text: line.out }].slice(-9));
        await sleep(650);
        i++;
        if (i % LINES.length === 0) {
          await sleep(400);
          setRows([]);
        }
      }
    }
    run();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-1 leading-relaxed">
      {rows.map((r, i) => (
        <div
          key={i}
          className={r.kind === "cmd" ? "text-foreground" : "text-foreground/50"}
        >
          {r.text}
          {i === rows.length - 1 && r.kind === "cmd" && (
            <span className="ml-1 inline-block h-3 w-1.5 bg-foreground/80 animate-pulse align-middle" />
          )}
        </div>
      ))}
    </div>
  );
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
