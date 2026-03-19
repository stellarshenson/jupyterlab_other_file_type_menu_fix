import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { DocumentRegistry } from '@jupyterlab/docregistry';
import { IDisposable } from '@lumino/disposable';
import { Widget } from '@lumino/widgets';

/**
 * Widget extension that fixes the context menu and LSP adapter for
 * non-standard file types (LICENSE, .gitignore, Dockerfile, etc.).
 *
 * Two problems are addressed:
 *
 * 1. Context menu: when a file has no registered file type, its FileEditor
 *    widget may not be the shell's currentWidget when the context menu fires.
 *    Lumino resolves commands against the wrong (previously active) widget,
 *    producing a stale and non-functional menu.
 *
 * 2. LSP crash: icon-providing extensions (e.g. vscode-icons) register file
 *    types with pattern matches but without mimeTypes. The LSP adapter's
 *    get mimeType getter calls getFileTypeForModel() which returns these
 *    incomplete types, then accesses mimeTypes[0] on undefined, causing a
 *    TypeError that disposes the virtual document and breaks all LSP context
 *    menu items.
 *
 * Fix: in createNew, patch incomplete file types in the document registry to
 * include a default mimeTypes array, and attach a capture-phase contextmenu
 * listener that calls shell.activateById() before Lumino processes the event.
 */
class ContextMenuFixExtension implements DocumentRegistry.WidgetExtension {
  private _patched = false;

  constructor(
    private shell: JupyterFrontEnd.IShell,
    private docRegistry: DocumentRegistry
  ) {}

  createNew(widget: Widget, context: DocumentRegistry.Context): IDisposable {
    const shell = this.shell;

    // Patch file types that lack mimeTypes once on first widget creation.
    // Icon extensions (e.g. vscode-icons) register types with patterns but
    // no mimeTypes, causing LSP to crash when it accesses mimeTypes[0].
    if (!this._patched) {
      this._patched = true;
      for (const ft of this.docRegistry.fileTypes()) {
        if (!ft.mimeTypes || ft.mimeTypes.length === 0) {
          (ft as any).mimeTypes = ['text/plain'];
        }
      }
    }

    const handler = () => {
      shell.activateById(widget.id);
    };

    widget.node.addEventListener('contextmenu', handler, true);

    let disposed = false;
    return {
      get isDisposed() {
        return disposed;
      },
      dispose() {
        if (!disposed) {
          widget.node.removeEventListener('contextmenu', handler, true);
          disposed = true;
        }
      }
    };
  }
}

const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_other_file_type_menu_fix:plugin',
  description:
    'Fix context menu for non-standard file types (LICENSE, .gitignore, etc.) ' +
    'that show stale/inert menus with broken hover highlighting',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log(
      'JupyterLab extension jupyterlab_other_file_type_menu_fix is activated!'
    );

    app.docRegistry.addWidgetExtension(
      'Editor',
      new ContextMenuFixExtension(app.shell, app.docRegistry)
    );
  }
};

export default plugin;
