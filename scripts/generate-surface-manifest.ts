/**
 * Surface manifest generator — frame-node (producer for the conformance audit).
 *
 * Emits the SDK's public resource/method surface as JSON per the schema pinned
 * in frame-docs `CROSS_SDK_NAMING.md` ("Surface-manifest schema (for the
 * audit)"):
 *
 *   { sdk, version, resources: { <canonicalResource>: { class, methods: [{ name, deprecated }] } } }
 *
 * FRA-4516 (producer half). Consumed by the conformance audit in the frame
 * monolith (FRA-4457), which asserts every canonical non-deprecated public op
 * resolves to a non-deprecated entry here or is on the exclusion list.
 *
 * Method surface = runtime reflection over an instantiated `FrameSDK` (the
 * authoritative shape that actually ships). Deprecation = the JSDoc
 * `@deprecated` tag read statically from src/api/*.ts, since JSDoc is erased at
 * runtime. The two are cross-referenced by method name.
 *
 * Run: npm run surface:manifest   (see package.json; uses ts-node transpile-only)
 * or:  npx ts-node --project scripts/tsconfig.json scripts/generate-surface-manifest.ts [--out <path>] [--stdout]
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { FrameSDK } from '../src/index';

const SDK_NAME = 'frame-node';

// Methods present on every API class that are not part of the public surface.
const NON_SURFACE_METHODS = new Set(['constructor']);

// Pagination convenience helpers (e.g. `iterateAllTransfers`) are not canonical
// operations and must not count toward parity.
const isPaginationHelper = (name: string): boolean => /^iterateAll[A-Z]/.test(name);

/**
 * node-native client property → canonical resource key (per CROSS_SDK_NAMING.md
 * resource catalog). Only the entries that DIFFER from the client property need
 * listing; everything else is already canonical and passes through unchanged.
 * `customers` and `chargeIntents` are the deprecated (alias-only) resources —
 * kept under their own key so the audit can see them and exclude them from the
 * parity denominator via the deprecated set, not silently dropped.
 */
const NATIVE_TO_CANONICAL: Record<string, string> = {
  threeDS: 'threeDsIntents',
  // deprecated resources retain their legacy keys (excluded from parity denom):
  customers: 'customers',
  chargeIntents: 'chargeIntents',
};

interface MethodEntry {
  name: string;
  deprecated: boolean;
}
interface ResourceEntry {
  class: string;
  methods: MethodEntry[];
}
interface Manifest {
  sdk: string;
  version: string;
  resources: Record<string, ResourceEntry>;
}

const repoRoot = join(__dirname, '..');

function readPackageVersion(): string {
  const pkg = JSON.parse(readFileSync(join(repoRoot, 'package.json'), 'utf8'));
  if (!pkg.version) throw new Error('package.json is missing a version');
  return pkg.version as string;
}

/**
 * Scan src/api/*.ts for methods carrying a JSDoc `@deprecated` tag. Returns a
 * map of API class name → set of deprecated method names. Parsed statically
 * because the tag does not survive to runtime.
 */
function collectDeprecatedMethods(): Map<string, Set<string>> {
  const apiDir = join(repoRoot, 'src', 'api');
  const result = new Map<string, Set<string>>();
  for (const file of readdirSync(apiDir)) {
    if (!file.endsWith('-api.ts')) continue;
    const source = readFileSync(join(apiDir, file), 'utf8');
    const classMatch = source.match(/export class (\w+API)\b/);
    if (!classMatch) continue;
    const className = classMatch[1];
    const deprecated = new Set<string>();

    // Walk each `@deprecated` occurrence and bind it to the next method decl.
    const methodDecl = /(?:async\s+)?([a-zA-Z_$][\w$]*)\s*(?:<[^>]*>)?\s*\(/g;
    let searchFrom = 0;
    let idx = source.indexOf('@deprecated', searchFrom);
    while (idx !== -1) {
      methodDecl.lastIndex = idx;
      const m = methodDecl.exec(source);
      if (m && !NON_SURFACE_METHODS.has(m[1])) deprecated.add(m[1]);
      searchFrom = idx + '@deprecated'.length;
      idx = source.indexOf('@deprecated', searchFrom);
    }
    if (deprecated.size) result.set(className, deprecated);
  }
  return result;
}

function buildManifest(): Manifest {
  const deprecatedByClass = collectDeprecatedMethods();

  // A publishable key is enough to instantiate (constructor requires one of
  // apiKey/publishableKey); no network calls are made by reflection.
  const sdk = new FrameSDK({ publishableKey: 'pk_surface_manifest_reflection' });

  const resources: Record<string, ResourceEntry> = {};

  for (const prop of Object.keys(sdk)) {
    const value = (sdk as unknown as Record<string, unknown>)[prop];
    if (!value || typeof value !== 'object') continue;
    const proto = Object.getPrototypeOf(value);
    if (!proto || proto === Object.prototype) continue;
    const className = value.constructor?.name;
    if (!className || !/API$/.test(className)) continue;

    const methods: MethodEntry[] = [];
    for (const name of Object.getOwnPropertyNames(proto)) {
      if (NON_SURFACE_METHODS.has(name)) continue;
      if (isPaginationHelper(name)) continue;
      const desc = Object.getOwnPropertyDescriptor(proto, name);
      if (!desc || typeof desc.value !== 'function') continue; // skip getters/setters
      methods.push({
        name,
        deprecated: deprecatedByClass.get(className)?.has(name) ?? false,
      });
    }
    methods.sort((a, b) => a.name.localeCompare(b.name));

    const canonical = NATIVE_TO_CANONICAL[prop] ?? prop;
    resources[canonical] = { class: className, methods };
  }

  return {
    sdk: SDK_NAME,
    version: readPackageVersion(),
    resources: Object.fromEntries(
      Object.entries(resources).sort(([a], [b]) => a.localeCompare(b)),
    ),
  };
}

function main(): void {
  const args = process.argv.slice(2);
  const toStdout = args.includes('--stdout');
  const outIdx = args.indexOf('--out');
  const outPath =
    outIdx !== -1 ? args[outIdx + 1] : join(repoRoot, 'surface-manifest.json');

  const manifest = buildManifest();
  const json = JSON.stringify(manifest, null, 2) + '\n';

  if (toStdout) {
    process.stdout.write(json);
    return;
  }
  writeFileSync(outPath, json);
  const count = Object.values(manifest.resources).reduce(
    (n, r) => n + r.methods.length,
    0,
  );
  process.stderr.write(
    `Wrote ${outPath}: ${Object.keys(manifest.resources).length} resources, ${count} methods (v${manifest.version})\n`,
  );
}

main();
