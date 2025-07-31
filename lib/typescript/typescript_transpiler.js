import ts from 'typescript';
import fs from 'fs';
import path from 'path';

const TYPESCRIPT_COMPILER_OPTIONS = {
    compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2020,
        jsx: ts.JsxEmit.Preserve,
    },
};

export class TypescriptTranspiler {
    static async generateTemporalJavascriptFromTypescript(filePath) {
        const tsCode = fs.readFileSync(filePath, 'utf8');
        const jsCode = this.transpileTypeScript(tsCode);

        const tempDir = path.join(process.cwd(), '.testy-cache');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        const tempFilePath = path.join(tempDir, `${path.basename(filePath)}.js`);
        fs.writeFileSync(tempFilePath, jsCode);

        return {importPath: tempFilePath, isTempFileCreated: true}
    }

    static transpileTypeScript(typescriptCode) {
        const transpileOutput = ts.transpileModule(typescriptCode, TYPESCRIPT_COMPILER_OPTIONS);
        return transpileOutput.outputText;
    }
}