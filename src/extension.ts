import * as vscode from 'vscode';
import * as child_process from 'child_process';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.createList', async (folder: vscode.Uri) => {
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
        } catch (error) {
            console.error(`Error: ${error}`);
        }
    });

    context.subscriptions.push(disposable);
}

async function runCommand(cmd: string): Promise<{ stdout: string; stderr: string }> {
    return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
        child_process.exec(cmd, { maxBuffer: 1024 * 1024 * 2048 }, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve({ stdout, stderr });
            }
        });
    });
}

function processOutput(output: string, basePath: string): string {
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

export function deactivate() {}