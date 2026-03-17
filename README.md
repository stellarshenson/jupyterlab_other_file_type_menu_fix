# jupyterlab_other_file_type_menu_fix

[![GitHub Actions](https://github.com/stellarshenson/jupyterlab_other_file_type_menu_fix/actions/workflows/build.yml/badge.svg)](https://github.com/stellarshenson/jupyterlab_other_file_type_menu_fix/actions/workflows/build.yml)
[![npm version](https://img.shields.io/npm/v/jupyterlab_other_file_type_menu_fix.svg)](https://www.npmjs.com/package/jupyterlab_other_file_type_menu_fix)
[![PyPI version](https://img.shields.io/pypi/v/jupyterlab-other-file-type-menu-fix.svg)](https://pypi.org/project/jupyterlab-other-file-type-menu-fix/)
[![Total PyPI downloads](https://static.pepy.tech/badge/jupyterlab-other-file-type-menu-fix)](https://pepy.tech/project/jupyterlab-other-file-type-menu-fix)
[![JupyterLab 4](https://img.shields.io/badge/JupyterLab-4-orange.svg)](https://jupyterlab.readthedocs.io/en/stable/)
[![Brought To You By KOLOMOLO](https://img.shields.io/badge/Brought%20To%20You%20By-KOLOMOLO-00ffff?style=flat)](https://kolomolo.com)
[![Donate PayPal](https://img.shields.io/badge/Donate-PayPal-blue?style=flat)](https://www.paypal.com/donate/?hosted_button_id=B4KPBJDLLXTSA)

> [!TIP]
> This extension is part of the [stellars_jupyterlab_extensions](https://github.com/stellarshenson/stellars_jupyterlab_extensions) metapackage. Install all Stellars extensions at once: `pip install stellars_jupyterlab_extensions`

Fixes the broken menu behavior for non-standard file types in JupyterLab. Files like LICENSE, .gitignore, Makefile, and other unregistered types get a proper context menu with correct item display and hover highlighting.

## Features

- **Proper context menu for non-standard files** - Files without a registered file type (LICENSE, .gitignore, Makefile, etc.) now display a fully functional context menu
- **Refresh view command** - Adds the missing "Refresh" option to the context menu for these file types
- **Correct menu item display** - Fixes rendering issues where menu items were not properly shown
- **Hover highlighting** - Restores proper hover state highlighting on menu items

## Installation

Requires JupyterLab 4.0.0 or higher.

```bash
pip install jupyterlab_other_file_type_menu_fix
```

## Uninstall

```bash
pip uninstall jupyterlab_other_file_type_menu_fix
```
