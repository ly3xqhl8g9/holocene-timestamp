import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { zipSync, unzipSync } from 'fflate';

const root = fileURLToPath(new URL('../', import.meta.url));
const distribution = path.join(root, 'packages/extension-chrome-legacy/distribution');
const packageData = JSON.parse(await readFile(path.join(root, 'packages/extension-chrome-legacy/package.json'), 'utf8'));
const manifest = JSON.parse(await readFile(path.join(distribution, 'manifest.json'), 'utf8'));
if (manifest.version !== packageData.version || manifest.manifest_version !== 3) throw new Error('Invalid release manifest or mismatched version.');
if (JSON.stringify(manifest.permissions) !== '["storage"]' || JSON.stringify(manifest.host_permissions) !== '["<all_urls>"]') throw new Error('Unexpected permissions change.');

const files = {};
async function collect(relative = '') {
  for (const entry of (await readdir(path.join(distribution, relative), { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name, 'en'))) {
    const name = path.posix.join(relative, entry.name);
    if (entry.isDirectory()) await collect(name);
    else {
      if (!entry.isFile() || /(^|\/)(\.|node_modules)|\.map$|jquery/i.test(name)) throw new Error(`Unexpected release asset: ${name}`);
      files[name] = new Uint8Array(await readFile(path.join(distribution, name)));
    }
  }
}
await collect();
const requireAsset = name => { if (!files[name.replace(/^\//, '')]) throw new Error(`Missing manifest asset: ${name}`); };
for (const name of [manifest.action.default_popup, manifest.action.default_icon, manifest.options_ui.page, manifest.background.service_worker, ...Object.values(manifest.icons), ...manifest.content_scripts.flatMap(script => script.js)]) requireAsset(name);
for (const name of ['popup', 'options']) {
  const html = Buffer.from(files[`${name}.html`]).toString('utf8');
  const scripts = [...html.matchAll(/<script\b[^>]*\bsrc=(?:"([^"]+)"|'([^']+)'|([^\s>]+))/g)].map(match => match[1] ?? match[2] ?? match[3]);
  if (scripts.length !== 1 || scripts[0] !== `${name}.js`) throw new Error(`Invalid scripts in ${name}.html`);
  for (const script of scripts) requireAsset(script);
  for (const match of html.matchAll(/<link\b[^>]*\bhref=(?:"([^"]+)"|'([^']+)'|([^\s>]+))/g)) {
    const href = match[1] ?? match[2] ?? match[3];
    if (href.startsWith('css/')) requireAsset(href);
  }
}
// A fixed timestamp makes repeated packaging of identical builds reproducible.
const entries = Object.fromEntries(Object.entries(files).map(([name, bytes]) => [name, [bytes, { mtime: new Date(2020, 0, 1) }]]));
const archive = zipSync(entries, { level: 9 });
const unpacked = unzipSync(archive);
if (Object.keys(unpacked).length !== Object.keys(files).length) throw new Error('ZIP validation failed.');
for (const [name, content] of Object.entries(files)) if (!Buffer.from(content).equals(Buffer.from(unpacked[name]))) throw new Error(`ZIP content mismatch: ${name}`);

const release = path.join(root, 'release');
await mkdir(release, { recursive: true });
const filename = `holocene-epoch-timestamp-${manifest.version}.zip`;
const digest = createHash('sha256').update(archive).digest('hex');
await writeFile(path.join(release, filename), archive);
await writeFile(path.join(release, `${filename}.sha256`), `${digest}  ${filename}\n`);
console.log(`${filename}: ${archive.length} bytes, ${Object.keys(files).length} validated assets\nSHA-256: ${digest}`);
