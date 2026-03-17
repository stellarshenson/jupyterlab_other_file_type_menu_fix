import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { DocumentRegistry } from '@jupyterlab/docregistry';
import { IDisposable } from '@lumino/disposable';
import { Widget } from '@lumino/widgets';

/**
 * Widget extension that ensures every FileEditor widget activates itself
 * when it receives a right-click, fixing the context menu for non-standard
 * file types (LICENSE, .gitignore, Dockerfile, etc.).
 *
 * Root cause: when a file has no registered file type, its FileEditor widget
 * may not be the shell's currentWidget when the context menu fires. Lumino
 * then resolves commands against the wrong (previously active) widget,
 * producing a stale and non-functional menu.
 *
 * Fix: attach a capture-phase contextmenu listener on each Editor widget's
 * own DOM node that calls shell.activateById(). By the time Lumino's
 * document-level handler processes the event, the widget is already active.
 */
class ContextMenuFixExtension implements DocumentRegistry.WidgetExtension {
  constructor(private shell: JupyterFrontEnd.IShell) {}

  createNew(widget: Widget, context: DocumentRegistry.Context): IDisposable {
    const shell = this.shell;

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
