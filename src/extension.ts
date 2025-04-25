import * as vscode from 'vscode';

// Generic function for text replacement and cursor position adjustment
function formatText(editor: vscode.TextEditor, before: string, after: string = before) {
	const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special characters
	const selection = editor.selection;
	let deletedTextWithoutSelection = false;
	editor.edit(editBuilder => {
        if (selection.isEmpty) {
            // Get the position before and after the cursor
            const cursorPosition = selection.start;
            const beforeRange = new vscode.Range(cursorPosition.translate(0, -before.length), cursorPosition);
            const afterRange = new vscode.Range(cursorPosition, cursorPosition.translate(0, after.length));

            // Get the text before and after the cursor
            const textBefore = editor.document.getText(beforeRange);
            const textAfter = editor.document.getText(afterRange);

            // Check if the before and after strings are already present
            if (textBefore === before && textAfter === after) {
                // Remove the before and after strings
                editBuilder.delete(beforeRange);
                editBuilder.delete(afterRange);
				deletedTextWithoutSelection = true;		
            } else {
                // Add the before and after strings
                editBuilder.insert(cursorPosition, before + after);
            }
        } else {
			const selectedText = editor.document.getText(selection);
			const beforePattern = new RegExp(`^${escapeRegExp(before)}`);
			const afterPattern = new RegExp(`${escapeRegExp(after)}$`);
		
			if (beforePattern.test(selectedText) && afterPattern.test(selectedText)) {
				// Remove before and after
				const newText = selectedText.replace(beforePattern, '').replace(afterPattern, '');
				editBuilder.replace(selection, newText);
			} else {
				// Add before and after
				editBuilder.replace(selection, before + selectedText + after);
			}
		}
	}).then(() => {
		if (selection.isEmpty && !deletedTextWithoutSelection) {
			const newPosition = selection.start.translate(0, before.length);
			editor.selection = new vscode.Selection(newPosition, newPosition);
		}
	});
}

export function activate(context: vscode.ExtensionContext) {
	console.log("markdown-shortcut activated.");
	// Register bold command
	let boldDisposable = vscode.commands.registerCommand('markdown-shortcut.bold', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			console.log("markdown-shortcut.bold");
			formatText(editor, "**");
		}
	});

	// Register italic command
	let italicsDisposable = vscode.commands.registerCommand('markdown-shortcut.italics', () => {
		const editor = vscode.window.activeTextEditor;
		console.log("markdown-shortcut.italics");
		if (editor) {
			formatText(editor, "*");
		}
	});

	// Register underline command
	let underlineDisposable = vscode.commands.registerCommand('markdown-shortcut.underline', () => {
		const editor = vscode.window.activeTextEditor;
		console.log("markdown-shortcut.underline");
		if (editor) {
			formatText(editor, "<u>", "</u>");
		}
	});

	// Register inline code command
	let codeDisposable = vscode.commands.registerCommand('markdown-shortcut.code', () => {
		console.log("markdown-shortcut.code");
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			formatText(editor, "`");
		}
	});

	// Register comment command
	let commentDisposable = vscode.commands.registerCommand('markdown-shortcut.comment', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			formatText(editor, "<!--", "-->");
		}
	});

	// Register hyperlink command
	let hyperlinkDisposable = vscode.commands.registerCommand('markdown-shortcut.hyperlink', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			formatText(editor, "[", "](url)");
		}
	});

	// Add image command
	let imageDisposable = vscode.commands.registerCommand('markdown-shortcut.image', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			formatText(editor, "![", "](url)");
		}
	});

	// Add inline formula command
	let inlineMathDisposable = vscode.commands.registerCommand('markdown-shortcut.inlineMath', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			formatText(editor, "$", "$");
		}
	});

	// Add strikethrough command
	let strikethroughDisposable = vscode.commands.registerCommand('markdown-shortcut.strikethrough', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			formatText(editor, "~~");
		}
	});

	// Add unorderedList command
	let unorderedListDisposable = vscode.commands.registerCommand('markdown-shortcut.unorderedList', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const document = editor.document;
			const selection = editor.selection;
			editor.edit(editorBuilder => {
				let allStartWithDash = true;

				for (let i = selection.start.line; i <= selection.end.line; i++) {
					const line = document.lineAt(i);
					const lineText = line.text;

					if (!lineText.trimStart().startsWith('-')) {
						allStartWithDash = false;
						// Add the '-' if it doesn't exist
						editorBuilder.insert(line.range.start, '- ');
					} else if (!lineText.trimStart().startsWith('- ')) {
						allStartWithDash = false;
						// Add just a space
						editorBuilder.insert(line.range.start.translate(0, 1), ' ');
					}
				}

				if (allStartWithDash) {
					for (let i = selection.start.line; i <= selection.end.line; i++) {
						const line = document.lineAt(i);
						const range = new vscode.Range(line.range.start, line.range.start.translate(0, 2)); // Remove the first 2 characters ("- ")
						editorBuilder.delete(range);
					}
				}
			});
		}
	});

	// Add sortedList command
	let sortedListListDisposable = vscode.commands.registerCommand('markdown-shortcut.sortedList', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const document = editor.document;
			const selection = editor.selection;
			editor.edit(editBuilder => {
				let lineNumber = 1;
				let allStartWithNumber = true;

				for (let i = selection.start.line; i <= selection.end.line; i++) {
					const line = document.lineAt(i);
					const lineText = line.text;
					if (!lineText.trimStart().startsWith(`${ lineNumber }.`)) {
						allStartWithNumber = false;
						// Add the number if it doesn't exist
						editBuilder.insert(line.range.start, `${ lineNumber }. `);
					}
					else if (!lineText.trimStart().startsWith(`${ lineNumber }. `)) {
						allStartWithNumber = false;
						// Add just a space
						let numberLength = lineNumber.toString().length;
						editBuilder.insert(line.range.start.translate(0, numberLength + 1), ' ');
					}
					lineNumber++;
				}

				if (allStartWithNumber) {
					for (let i = selection.start.line; i <= selection.end.line; i++) {
						const line = document.lineAt(i);
						let numberLength = lineNumber.toString().length;
						const range = new vscode.Range(line.range.start, line.range.start.translate(0, numberLength + 2)); // Remove the number, period, and space ("1. ")
						editBuilder.delete(range);
					}
				}
			});
		}
	});

	context.subscriptions.push(
		boldDisposable,
		italicsDisposable,
		underlineDisposable,
		codeDisposable,
		commentDisposable,
		hyperlinkDisposable,
		imageDisposable,
		inlineMathDisposable,
		strikethroughDisposable,
		unorderedListDisposable,
		sortedListListDisposable
	);
}

export function deactivate() { }
