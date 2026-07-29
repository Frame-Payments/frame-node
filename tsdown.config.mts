import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ["./src/index.ts"],
  dts: true,
  format: ['esm', 'cjs'],
  platform: "node",
  // Build runs on Node 22+ (tsdown requirement) but the bundled output
  // targets Node 20 so the published package still supports it at runtime.
  target: "node20",
  sourcemap: true,
  exports: {
    // Metro resolves export conditions in the order the package declares them,
    // so `react-native` must come before `import`. Without it RN bundlers pick
    // dist/index.mjs, whose top-level `createRequire` shim imports "node:module"
    // and fails to resolve. The CJS build has no such shim: its lone
    // `require('form-data')` is unreachable on RN because makeFormData() checks
    // navigator.product first and uses globalThis.FormData.
    customExports(exports) {
      const root = exports['.']
      if (root && typeof root === 'object') {
        exports['.'] = { 'react-native': './dist/index.cjs', ...root }
      }
      return exports
    },
  },
  clean: true,
  deps: {
    skipNodeModulesBundle: true
  }
})
