# monaco-auto-import


[![npm version](https://img.shields.io/npm/v/@kareemkermad/monaco-auto-import.svg?style=flat-square)](https://www.npmjs.com/package/@kareemkermad/monaco-auto-import)
[![npm downloads](https://img.shields.io/npm/dm/@kareemkermad/monaco-auto-import.svg?style=flat-square)](https://www.npmjs.com/package/@kareemkermad/monaco-auto-import)
[![Demo](https://img.shields.io/badge/Online-Demo-yellow.svg?style=flat-square)](https://unpkg.com/@kareemkermad/monaco-auto-import/dist/index.html)

Forked from https://github.com/stackblitz/monaco-auto-import


Easily add auto-import to the Monaco editor, with Javascript & Typescript support.

## Demo

![](https://i.imgur.com/BvQuMRC.gif)

### Example code

```ts
import AutoImport, { regexTokeniser } from '@kareemkermad/monaco-auto-import'

const editor = monaco.editor.create(document.getElementById('demo'), {
  value: `
    PAD
    leftPad
    rightPad
  `,
  language: 'typescript'
})

const completor = new AutoImport({ monaco: monaco, editor: editor, spacesBetweenBraces: true, doubleQuotes: true, semiColon: true, alwaysApply: false });

completor.imports.saveFile({
  path: './node_modules/left-pad/index.js',
  aliases: ['left-pad'],
  imports: regexTokeniser(`
    export const PAD = ''
    export function leftPad() {}
    export function rightPad() {}
  `)
})
```

## Getting started

### Installing

```bash
yarn add @kareemkermad/monaco-auto-import
# or
npm i @kareemkermad/monaco-auto-import --save
```

### How to Use

#### Initializing a new instance

Simply create a new Monaco editor instance and pass it to `AutoImport`. This will register custom completion providers for Monaco's `javascript` and `typescript` language services.

```ts
import AutoImport from '@kareemkermad/monaco-auto-import'

const editor = monaco.editor.create(document.getElementById('demo'), {
  language: 'typescript'
})

const completor = new AutoImport({ monaco: monaco, editor: editor, spacesBetweenBraces: true, doubleQuotes: true, semiColon: true, alwaysApply: false });
```

#### Options

* `monaco` - Monaco instance.
* `editor` - Monaco editor instance.
* `spacesBetweenBraces` - True uses a space between the curly braces, false otherwise. <br> e.g. `import { Test } from "testing"` or `import {Test} from "testing"`
* `doubleQuotes` - True uses double quotes in the import path, false uses single quotes. <br> e.g. `import { Test } from "testing"` or `import {Test} from 'testing'`
* `semiColon` - True uses a semi colon after the import path, false otherwise. <br> e.g. `import { Test } from "testing";` or `import {Test} from 'testing'`
* `alwaysApply` - True will always use the spacesBetweenBraces, doubleQuotes and semiColon options. False will only use them the first time you auto import and then automatically preserve any changes you make.

  
e.g. If `alwaysApply = true` and `doubleQuotes = true` then it will always use double quotes whenever you auto import. If `alwaysApply = false` and `doubleQuotes = true` then it will use double quotes the first time you auto import. But if you decide to modify the string to use single quotes then it will preserve the single quotes every other time you try to auto import.

#### Providing completion items

To make the auto-importer aware of a file with exports, simply call `completor.imports.saveFile`.

```ts
completor.imports.saveFile({
  path: './src/my-app.js',
  imports: [
    { type: 'const', name: 'Testing' },
    { type: 'class', name: 'World' },
    { type: 'class', name: 'type Universe' },
    { type: 'interface', name: 'Shape' },
    { type: 'function', name: 'drawShape' },
    { type: 'enum', name: 'Primitive' },
  ]
})
```

![](https://i.imgur.com/zSuZr7j.png)

#### Tokenization

This package includes a built-in `regexTokeniser`, which uses a simple Regex to extracts exports from Javascript / Typescript code

```ts
import { regexTokeniser } from '@kareemkermad/monaco-auto-import'

const imports = regexTokeniser(`
  export const a = 1
  export class Test {}
  export interface type Shape
`)
// [{ type: 'const', name: 'a'}, { type: 'class', name: 'Test' }, { type: 'interface', name: 'type Shape' }]

completor.imports.saveFile({
  path: './src/my-app.js',
  imports: imports
})
```

## New Features and Bug Fixes (https://github.com/stackblitz/monaco-auto-import)
* Added `monaco`, `editor`, `spacesBetweenBraces`, `doubleQuotes`, `semiColon`, `alwaysApply` options.
* Added support for import type - e.g. `import {type Test} from "testing";`
* Added support for module.
* Updated auto import suggestion to not show up a second time if it has already been imported.
* Updated auto import suggestion description for import type.
* Fixed import merging not working when swapping from single quotes to double quotes.
* Fixed a bug that caused the name to autocomplete twice.
* Fixed a bug that caused the mouse cursor position to move to a previous line.

## API

### `imports.saveFile(file: File): void`

Saves a file to the internal store, making it available for completion

### `imports.saveFiles(files: File[]): void`

Bulk-saves files to the internal store from an Array of files

### `imports.getFile(path: string): File`

Fetches a file from the internal store by it's path name (or one of it's aliases).

### `imports.getImports(name: string): ImportObject[]`

Returns all the imports that exactly match a given string.

### `imports.addImport(path: string, name: string, type?: Expression): boolean`

Adds an import to a given file, with an optional `type` paramater. Returns true if the file existed

### `imports.removeImport(path: string, name: string): boolean`

Removes an import from a given file. Returns true if the file existed
