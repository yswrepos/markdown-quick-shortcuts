import * as vscode from 'vscode';
import * as assert from 'assert';
// import { activate, deactivate } from '../extension';


// TODO test
async function testMarkdownCommand(commandId: string, initialText: string, expectedText: string, assertMessage: string) {
    const testDocument = await vscode.workspace.openTextDocument({ content: initialText });
    const editor = await vscode.window.showTextDocument(testDocument);
    editor.selection = new vscode.Selection(new vscode.Position(0, 0), new vscode.Position(0, initialText.length));

    await vscode.commands.executeCommand(commandId);

    const text = testDocument.getText();
    assert.strictEqual(text, expectedText, assertMessage);
}

suite('Extension Test Suite', () => {

	// suiteSetup(async () => {
        // Simulate plugin activation
        // const context = { subscriptions: [] } as vscode.ExtensionContext;
        // await activate(context);
    // });

    // suiteTeardown(async () => {
    //     console.log("tear down")
    //     await vscode.commands.executeCommand('workbench.action.closeAllEditors');

    //     // Clean up resources
    //     deactivate();
    // });

    // afterEach(async () => {
    //     // Close all open editors
    //     await vscode.commands.executeCommand('workbench.action.closeAllEditors');
    // });

	vscode.window.showInformationMessage('Start all tests.');

	test('Bold Command Test', async () => {
        await testMarkdownCommand('markdown-shortcut.bold', 'Hello', '**Hello**', 'Text should be bold');
    });

    test('Italics Command Test', async () => {
        await testMarkdownCommand('markdown-shortcut.italics', 'Hello', '*Hello*', 'Text should be italic');
    });

    test('Underline Command Test', async () => {
        await testMarkdownCommand('markdown-shortcut.underline', 'Hello', '<u>Hello</u>', 'Text should be underlined');
    });

    test('Inline Code Command Test', async () => {
        await testMarkdownCommand('markdown-shortcut.code', 'Hello', '`Hello`', 'Text should be formatted as inline code');
    });

    test('Strikethrough Command Test', async () => {
        await testMarkdownCommand('markdown-shortcut.strikethrough', 'Hello', '~~Hello~~', 'Text should be strikethrough');
    });

    test('Hyperlink Command Test', async () => {
        await testMarkdownCommand('markdown-shortcut.hyperlink', 'Hello', '[Hello](url)', 'Text should be formatted as a hyperlink');
    });

    test('Image Command Test', async () => {
        await testMarkdownCommand('markdown-shortcut.image', 'Hello', '![Hello](url)', 'Text should be formatted as an image link');
    });

    test('Remove Bold Command Test', async () => {
        await testMarkdownCommand('markdown-shortcut.bold', '**Hello**', 'Hello', 'Text should not be bold');
    });

    test('Remove Italics Command Test', async () => {
        await testMarkdownCommand('markdown-shortcut.italics', '*Hello*', 'Hello', 'Text should not be italic');
    });

    test('Remove Underline Command Test', async () => {
        await testMarkdownCommand('markdown-shortcut.underline', '<u>Hello</u>', 'Hello', 'Text should not be underlined');
    });

    test('Remove Inline Code Command Test', async () => {
        await testMarkdownCommand('markdown-shortcut.code', '`Hello`', 'Hello', 'Text should not be formatted as inline code');
    });

    test('Remove Strikethrough Command Test', async () => {
        await testMarkdownCommand('markdown-shortcut.strikethrough', '~~Hello~~', 'Hello', 'Text should not be strikethrough');
    });

    test('Remove Hyperlink Command Test', async () => {
        await testMarkdownCommand('markdown-shortcut.hyperlink', '[Hello](url)', 'Hello', 'Text should not be formatted as a hyperlink');
    });

    test('Remove Image Command Test', async () => {
        await testMarkdownCommand('markdown-shortcut.image', '![Hello](url)', 'Hello', 'Text should not be formatted as an image link');
    });

});
