"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
function activate(context) {
    let disposable = vscode.commands.registerCommand('extension.createList', (folder) => {
        const outputFilePath = path.join(folder.fsPath, 'output.txt');
        const fileList = getAllFilesInFolder(folder.fsPath);
        const fileContents = getFileContents(fileList);
        fs.writeFileSync(outputFilePath, fileContents);
        vscode.workspace.openTextDocument(outputFilePath).then(doc => {
            vscode.window.showTextDocument(doc);
        });
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function getAllFilesInFolder(folderPath) {
    const files = [];
    const entries = fs.readdirSync(folderPath, { withFileTypes: true });
    entries.forEach(entry => {
        const fullPath = path.join(folderPath, entry.name);
        if (entry.isDirectory()) {
            const subFiles = getAllFilesInFolder(fullPath);
            files.push(...subFiles);
        }
        else {
            files.push(fullPath);
        }
    });
    return files;
}
function getFileContents(fileList) {
    let contents = '';
    fileList.forEach(filePath => {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        contents += `\n\n\n${filePath}:\n\n\n`;
        contents += fileContent;
        contents += '\n\n\n';
        contents += '-'.repeat(100);
    });
    return contents;
}
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map