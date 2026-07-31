import { pathToFileURL } from 'node:url';

/**
 * I load and evaluate a JavaScript module given its file path. I isolate the Node-specific
 * module-loading mechanism (dynamic import + file URL) — the least portable host capability
 * of decision 0018. A port must provide its own equivalent. I am distinct from the domain
 * orchestrator TestFileLoader, which discovers, transpiles, reports and cleans up.
 */
export class NodeModuleLoader {
  async load(filePath) {
    await import(pathToFileURL(filePath));
  }
}
