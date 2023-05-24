import * as vscode from 'vscode';
import * as child_process from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.createList', (folder: vscode.Uri) => {
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

function getAllFilesInFolder(folderPath: string): string[] {
    const files: string[] = [];
    const entries = fs.readdirSync(folderPath, { withFileTypes: true });

    entries.forEach(entry => {
        const fullPath = path.join(folderPath, entry.name);
        if (entry.isDirectory()) {
            const subFiles = getAllFilesInFolder(fullPath);
            files.push(...subFiles);
        } else {
            files.push(fullPath);
        }
    });

    return files;
}

function getFileContents(fileList: string[]): string {
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

export function deactivate() {}