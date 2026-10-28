import process from 'node:process';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { MissingTypescriptDependencyError } from '../errors.js';

export class TypescriptTranspiler {
  static async generateTemporalJavascriptFromTypescript(filePath) {
    const tsCode = fs.readFileSync(filePath, 'utf8');
    const jsCode = await this.transpileTypeScript(tsCode);

    // Written next to the original so relative imports keep resolving against the same directory.
    const tempFilePath = path.join(path.dirname(filePath), `${path.basename(filePath)}.testy-tmp.js`);
    fs.writeFileSync(tempFilePath, jsCode);

    return { importPath: tempFilePath };
  }

  static async transpileTypeScript(typescriptCode) {
    const ts = (() => {
      try {
        const userProjectRequire = createRequire(path.join(process.cwd(), 'package.json'));
        return userProjectRequire('typescript');
      } catch {
        throw new MissingTypescriptDependencyError();
      }
    })();

    const transpileOutput = ts.transpileModule(typescriptCode, {
      compilerOptions: {
        module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020,
      },
    });
    return transpileOutput.outputText;
  }
}
