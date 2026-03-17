import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

/**
 * Initialization data for the jupyterlab_other_file_type_menu_fix extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_other_file_type_menu_fix:plugin',
  description: 'Jupyterlab fix delivered as extension that fixes annoying issue where a non-standard type file (e.g. LICENSE or .gitignore or any other) doesn\'t have a standard menu, and the context menu that displays doesn\'t have refresh view command and doesn\'t properly show the menu items and doesn\'t highlight current hover over pointed item',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension jupyterlab_other_file_type_menu_fix is activated!');
  }
};

export default plugin;
