import process from 'node:process';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { MissingTypescriptDependencyError } from '../errors.js';

export class TypescriptTranspiler {
  static async generateTemporalJavascriptFromTypescript(filePath) {
    const tsCode = fs.readFileSync(filePath, 'utf8');
    const jsCode = await this.transpileTypeScript(tsCode);

    const tempDir = path.join(process.cwd(), '.testy-cache');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const tempFilePath = path.join(tempDir, `${path.basename(filePath)}.js`);
    fs.writeFileSync(tempFilePath, jsCode);

    return { importPath: tempFilePath, isTempFileCreated: true };
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
