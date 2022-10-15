# kle-js

A JavaScript library for interacting with KLE JSON and KLE data structures.

Originally ported from [keyboard-layout-editor](https://github.com/ijprest/keyboard-layout-editor/)
with improvements to make the source code increasingly portable across
different language platforms.

## Table of Contents

- [Documentation](#documentation)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Contributing](#contributing)

## Documentation

To view documentation, examples, visit the [documentation site](https://damsenviet.github.io/kle-js/).

## Installation

To install and use the library, choose an installation method listed below.

1. **NPM**

```sh
npm install @damsenviet/kle
```

2. **YARN**

```sh
yarn add @damsenviet/kle
```

3. **CDN**

```html
<!-- available under the global namespace 'kle' -->
<script src="https://unpkg.com/@damsenviet/kle"></script>
```

## Quick Start

This quick start demo demonstrates parsing a KLE JSON.

```js
const fs = require('fs');
const path = require('path');
const { Keyboard, KeyboardJSON } = require('@damsenviet/kle');

// relative to this file
const jsonRelativePath = './keyboard.json';
const jsonAbsolutePath = path.join(__dirname, jsonRelativePath);

const keyboardJson = JSON.parse(fs.readFileSync(jsonAbsolutePath, 'utf-8')) as KeyboardJSON;
const keyboard = Keyboard.fromJSON(keyboardJson);

for (const key of Keyboard.keys) {
  for (const label of key.labels) {
    // pass
  }
}
```

The schemas for KLE JSON can be found at [kle-json](https://github.com/DamSenViet/kle-json).

## Contributing

There are many ways to contribute to this project.

- [Creating Issues](./CONTRIBUTING.md#creating-issues)
- [Contributing Code](./CONTRIBUTING.md#contributing-code)
- [Sponsoring Developers](./CONTRIBUTING.md#sponsoring-developers)

For more information please see the [contributing guidelines](./CONTRIBUTING.md).
