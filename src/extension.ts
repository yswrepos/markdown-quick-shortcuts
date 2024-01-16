import * as vscode from 'vscode';

// Generic function for text replacement and cursor position adjustment
function formatText(editor: vscode.TextEditor, before: string, after: string = before) {
	const selection = editor.selection;
	const text = editor.document.getText(selection);
	editor.edit(editBuilder => {
		if (selection.isEmpty) {
			editBuilder.insert(selection.start, before + after);
		} else {
			editBuilder.replace(selection, before + text + after);
		}
	}).then(() => {
		if (selection.isEmpty) {
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
				for (let i = selection.start.line; i <= selection.end.line; i++) {
					const line = document.lineAt(i)
					editorBuilder.insert(line.range.start, '- ');
				}
			})
		}
	})

	// Add sortedList command
	let sortedListListDisposable = vscode.commands.registerCommand('markdown-shortcut.sortedList', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const document = editor.document;
			const selection = editor.selection;
			editor.edit(editBuilder => {
				let lineNumber = 1;
				for (let i = selection.start.line; i <= selection.end.line; i++) {
					const line = document.lineAt(i);
					editBuilder.insert(line.range.start, `${ lineNumber }. ` );
					lineNumber++;
				}
			});
		}
	})

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
