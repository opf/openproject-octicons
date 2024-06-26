![octicons cover light](https://user-images.githubusercontent.com/54012/138925195-5779c51d-ff8c-4264-a914-e64f4843893d.png#gh-light-mode-only)
![octicons cover dark](https://user-images.githubusercontent.com/54012/138925203-80e1afa1-ba54-4731-9525-3c41186663f9.png#gh-dark-mode-only)
<br>
<br>
<h1 align="center">OpenProject's Primer Octicons</h1>

<p align="center">Octicons are a set of SVG icons built by GitHub forked by OpenProject for OpenProject</p>

<p align="center">
  <a aria-label="build status" href="https://github.com/opf/openproject-octicons/actions/workflows/ci.yml">
    <img alt="" src="https://github.com/opf/openproject-octicons/actions/workflows/ci.yml/badge.svg?branch=main&event=push">
  </a>
  <a aria-label="publish status" href="https://github.com/opf/openproject-octicons/actions/workflows/publish.yml">
    <img alt="" src="https://github.com/opf/openproject-octicons/actions/workflows/publish.yml/badge.svg">
  </a>
</p>

## Libraries

This repository contains several libraries. Each of them is in the `lib/` folder and gives access to Octicons on a different platform/language.

### JavaScript

The octicons node.js library is the main JavaScript library. With [a JavaScript API](/lib/octicons_node/README.md) that can be used in a variety of applications.

| Package                                                                                       | Version                                                                                                                         |
|-----------------------------------------------------------------------------------------------| ------------------------------------------------------------------------------------------------------------------------------- |
| **[@openproject/octicons-angular](/lib/octicons_node)** <br />Node.js package with JavaScript API | [![npm version](https://img.shields.io/npm/v/@openproject/octicons-angular.svg)](https://www.npmjs.com/package/@openproject/octicons-angular)             |

Read more about the usage with Javascript [here](./lib/octicons_angular/README.md).

### Ruby

| Package                                                                       | Version                                                                                                                               |
| ----------------------------------------------------------------------------- |---------------------------------------------------------------------------------------------------------------------------------------|
| **[openproject-octicons](/lib/octicons_gem)** <br />Ruby gem with Ruby API                | [![Gem version](https://img.shields.io/gem/v/openproject-octicons.svg)](https://rubygems.org/gems/openproject-octicons)               |
| [openproject-octicons_helper](/lib/octicons_helper)<br />Rails helper for using octicons  | [![Gem version](https://img.shields.io/gem/v/openproject-octicons_helper.svg)](https://rubygems.org/gems/openproject-octicons_helper) |

Read more about the usage with Ruby [here](./lib/octicons_gem/README.md).

## Contributing

### Feedback, ideas, and bug reports

If you found a bug, have feedback about our Octicon Library, or an idea on how to improve it, please open a new issue in this repo using the appropriate [issue template](https://github.com/opf/openproject-octicons/issues/new/choose).

### Adding or updating an icon

Read through our [contributing guide](./CONTRIBUTING.md#adding-or-updating-icons) if you want to add or update icons.

## Release

Read through our [release guide](./RELEASE.md) if you want to release a new version.

## License

(c) GitHub, Inc.

When using the GitHub logos, be sure to follow the [GitHub logo guidelines](https://github.com/logos).

_Code License:_ [MIT](./LICENSE)
Applies to all other files
