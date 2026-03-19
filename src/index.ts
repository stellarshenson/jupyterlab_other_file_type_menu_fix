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
 * 2. LSP crash: the LSP adapter's initOnceReady calls get language which
 *    does mimeType.split('/') - if the model has no MIME type (unregistered
 *    file), this throws TypeError. The virtual document is then disposed,
 *    and all LSP context menu items crash during isVisible/isEnabled checks.
 *
 * Fix: in createNew, set a default MIME type on models that lack one (before
 * the LSP adapter's async init runs), and attach a capture-phase contextmenu
 * listener that calls shell.activateById() before Lumino processes the event.
 */
class ContextMenuFixExtension implements DocumentRegistry.WidgetExtension {
  constructor(private shell: JupyterFrontEnd.IShell) {}

  createNew(widget: Widget, context: DocumentRegistry.Context): IDisposable {
    const shell = this.shell;

    // Ensure the model has a MIME type so the LSP adapter's language getter
    // doesn't crash on undefined.split('/'). This runs synchronously before
    // the LSP adapter's async initOnceReady fires.
    const model = context.model as any;
    if (model && !model.mimeType) {
      try {
        model.mimeType = 'text/plain';
      } catch {
        // mimeType may be read-only on some model types
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
      new ContextMenuFixExtension(app.shell)
    );
  }
};

export default plugin;
