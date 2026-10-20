// Regenerates the terminal SVGs in profile/assets from real @speclynx/cli output.
//
// usage: node profile/assets/src/generate.mjs   (SANDBOX=docker to force Docker)
//
// Requires bubblewrap (bwrap, Linux) or Docker: the sample specs are mounted at /specs so
// absolute paths in CLI output (e.g. overlay `extends`) match the speclynx.com demos.
// Colors mirror the terminal component on speclynx.com (assets/css/main.css).
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const CLI_VERSION = '1.5.1';
const HERE = dirname(fileURLToPath(import.meta.url));
const SPECS = join(HERE, 'specs');
const OUT = join(HERE, '..');

const SESSIONS = {
  validate: {
    title: 'speclynx validate',
    runs: ['openapi.yaml', 'asyncapi.yaml', 'arazzo.yaml', 'overlay.yaml'].map((f) => ({
      cmd: 'validate',
      args: [f],
    })),
  },
  overlay: {
    title: 'speclynx overlay',
    runs: [
      { cmd: 'overlay apply', args: ['add-contact.yaml', 'museum.yaml'] },
      { cmd: 'overlay diff', args: ['openapi-v1.yaml', 'openapi-v2.yaml'] },
    ],
  },
};

const C = {
  bg: '#1F2937', bar: '#111827', border: '#374151', title: '#9CA3AF',
  prompt: '#34D399', dollar: '#AEB6C2', arg: '#C9D1D9', file: '#AEB6C2', loc: '#AEB6C2',
  msg: '#E5E7EB', code: '#3DD6EE', error: '#F87171', warn: '#FBBF24', hint: '#3DD6EE',
};
const MONO = "'Fira Code',Monaco,Consolas,ui-monospace,SFMono-Regular,Menlo,'Liberation Mono',monospace";
const FONT = 14, CW = 8.43, LH = 22, PAD = 22, BAR = 36;

// install the pinned CLI outside the repo
const prefix = mkdtempSync(join(tmpdir(), 'speclynx-cli-'));
execFileSync('npm', ['install', '--silent', '--prefix', prefix, `@speclynx/cli@${CLI_VERSION}`], { stdio: 'inherit' });
const bin = join(prefix, 'node_modules', '.bin', 'speclynx');

const has = (tool) => {
  try {
    execFileSync(tool, ['--version'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
};

// run the CLI with SPECS mounted at /specs: in a bwrap sandbox with a read-only view of
// the host system, or in a Node container where bwrap is unavailable (or SANDBOX=docker)
function sandbox(cliArgs) {
  if (process.env.SANDBOX !== 'docker' && has('bwrap')) {
    const binds = ['/usr', '/bin', '/lib', '/lib64', '/sbin', '/etc', '/home', '/tmp', '/opt', prefix]
      .filter(existsSync)
      .flatMap((d) => ['--ro-bind', d, d]);
    return ['bwrap', ['--tmpfs', '/', ...binds, '--proc', '/proc', '--dev', '/dev',
      '--bind', SPECS, '/specs', '--chdir', '/specs', bin, ...cliArgs]];
  }
  if (has('docker')) {
    return ['docker', ['run', '--rm', '-e', 'FORCE_COLOR=1', '-v', `${prefix}:/cli:ro`, '-v', `${SPECS}:/specs:ro`,
      '-w', '/specs', 'node:24-slim', '/cli/node_modules/.bin/speclynx', ...cliArgs]];
  }
  throw new Error('generate.mjs needs bubblewrap (bwrap) or Docker');
}

function run(cmd, args) {
  const [tool, argv] = sandbox([...cmd.split(' '), ...args]);
  try {
    return execFileSync(tool, argv, { encoding: 'utf8', env: { ...process.env, FORCE_COLOR: '1' } });
  } catch (e) {
    return e.stdout; // validation problems exit non-zero
  }
}

const strip = (s) => s.replace(/\x1b\[[\d;]*m/g, '');

// map CLI output to the speclynx.com terminal token classes
function classify(raw) {
  const line = strip(raw);
  if (/^[✖⚠]/.test(line)) return [{ text: line, color: line.startsWith('✖') ? C.error : C.warn, bold: true }];
  if (!/\x1b\[/.test(raw)) return [{ text: line, color: C.msg }];
  const d = line.match(/^(\s+)(\S+\s*)(\s+)(error|warning|hint)(\s+)(\S+)(\s+)(.*)$/);
  if (d) {
    const [, i, loc, s1, sev, s2, code, s3, msg] = d;
    return [
      { text: i + loc + s1, color: C.loc }, { text: sev, color: C[sev === 'warning' ? 'warn' : sev] },
      { text: s2, color: C.msg }, { text: code, color: C.code }, { text: s3 + msg, color: C.msg },
    ];
  }
  return [{ text: line, color: C.file }];
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const width = (segs) => segs.reduce((n, s) => n + [...s.text].length, 0);

const rendered = Object.entries(SESSIONS).map(([name, session]) => {
  const lines = [];
  session.runs.forEach(({ cmd, args }, i) => {
    if (i) lines.push([]);
    lines.push([
      { text: '$ ', color: C.dollar },
      { text: `npx @speclynx/cli ${cmd} `, color: C.prompt, bold: true },
      { text: args.join(' '), color: C.arg },
    ]);
    for (const l of run(cmd, args).replace(/\n+$/, '').split('\n')) lines.push(l ? classify(l) : []);
  });
  return { name, session, lines };
});

// one shared width so the images line up on the page
const W = Math.ceil(Math.max(...rendered.flatMap((r) => r.lines.map(width))) * CW + PAD * 2);

for (const { name, session, lines } of rendered) {
  const H = BAR + PAD + lines.length * LH + PAD - 8;
  const body = lines.map((segs, i) => {
    const y = BAR + PAD + i * LH + FONT - 2;
    let col = 0;
    return segs.map((s) => {
      // renderers collapse leading whitespace, so position past it explicitly
      const lead = s.text.length - s.text.trimStart().length;
      const x = (PAD + (col + lead) * CW).toFixed(1);
      col += [...s.text].length;
      if (!s.text.trim()) return '';
      return `<text x="${x}" y="${y}" fill="${s.color}"${s.bold ? ' font-weight="700"' : ''}>${esc(s.text.trimStart())}</text>`;
    }).join('');
  }).join('\n    ');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(session.title)}">
  <clipPath id="w"><rect width="${W}" height="${H}" rx="8"/></clipPath>
  <g clip-path="url(#w)">
    <rect width="${W}" height="${H}" fill="${C.bg}"/>
    <rect width="${W}" height="${BAR}" fill="${C.bar}"/>
    <rect y="${BAR - 1}" width="${W}" height="1" fill="${C.border}"/>
  </g>
  <circle cx="20" cy="18" r="5.5" fill="#FF5F56"/><circle cx="38" cy="18" r="5.5" fill="#FFBD2E"/><circle cx="56" cy="18" r="5.5" fill="#27C93F"/>
  <text x="74" y="22" fill="${C.title}" font-family="${MONO}" font-size="12">${esc(session.title)}</text>
  <g font-family="${MONO}" font-size="${FONT}" xml:space="preserve">
    ${body}
  </g>
</svg>
`;
  writeFileSync(join(OUT, `${name}.svg`), svg);
  console.log(`${name}.svg ${W}x${H}`);
}
