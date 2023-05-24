"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const child_process = require("child_process");
const path = require("path");
function activate(context) {
    let disposable = vscode.commands.registerCommand('extension.createList', async (folder) => {
        try {
            // Construct the command string
            const cmd = `find "${folder.fsPath}" -type f -not -path '*/\\.*' -execdir sh -c 'echo "\\n\\n-----$(dirname "{}")/$(basename "{}")------------------------------------------\\n\\n"; cat "{}"; echo' \\;`;
            // Run the command and capture the output
            const { stdout } = await runCommand(cmd);
            // Process the output to include the full path
            const processedOutput = processOutput(stdout, folder.fsPath);
            // Save the processed output to a file
            const outputPath = path.join(folder.fsPath, 'output.txt');
            await vscode.workspace.fs.writeFile(vscode.Uri.file(outputPath), Buffer.from(processedOutput));
            // Open the file in a new editor tab
            const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(outputPath));
            await vscode.window.showTextDocument(doc);
        }
        catch (error) {
            console.error(`Error: ${error}`);
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
async function runCommand(cmd) {
    return new Promise((resolve, reject) => {
        child_process.exec(cmd, { maxBuffer: 1024 * 1024 * 2048 }, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            }
            else {
                resolve({ stdout, stderr });
            }
        });
    });
}
function processOutput(output, basePath) {
    const lines = output.split('\n');
    const processedLines = lines.map(line => {
        const filePath = line.match(/-----([\s\S]+)-----/);
        if (filePath && filePath.length > 1) {
            const fileName = path.basename(filePath[1]);
            const fullPath = path.join(basePath, fileName);
            return line.replace(filePath[1], fullPath);
        }
        return line;
    });
    return processedLines.join('\n');
}
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map