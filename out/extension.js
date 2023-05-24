"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const child_process = require("child_process");
function activate(context) {
    let disposable = vscode.commands.registerCommand('extension.createList', (folder) => {
        // The code you place here will be executed every time your command is executed
        // Construct the command string
        //const cmd = `find "${folder.fsPath}" -type f -not -path '*/\\.*' -execdir sh -c 'echo "\\n\\n-----{}------------------------------------------\\n\\n"; cat "{}"; echo' \\; | tee output.txt`;
        const cmd = `find "${folder.fsPath}" -type f -not -path '*/\\.*' -execdir sh -c 'echo "\\n\\n-----{}------------------------------------------\\n\\n"; cat "{}"; echo' \\; | tee "${folder.fsPath}/output.txt"`;
        // Run the command
        //child_process.exec(cmd, (error, stdout, stderr) => {
        child_process.exec(cmd, { maxBuffer: 1024 * 1024 * 128 }, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            // Open the file in a new editor tab
            vscode.workspace.openTextDocument(vscode.Uri.file(`${folder.fsPath}/output.txt`)).then(doc => {
                vscode.window.showTextDocument(doc);
            });
        });
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map