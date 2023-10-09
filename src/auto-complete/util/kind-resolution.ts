import { languages } from 'monaco-editor'
import type { ImportObject } from '../import-db'

const kindResolver = (imp: ImportObject) => {
  switch (imp.type) {
    case 'function':
      return languages.CompletionItemKind.Function
      
    case 'interface':
      return languages.CompletionItemKind.Interface

    case 'var':
    case 'const':
    case 'let':
    case 'default':
      return languages.CompletionItemKind.Variable

    case 'enum':
    case 'const enum':
      return languages.CompletionItemKind.Enum

    case 'class':
      return languages.CompletionItemKind.Class

    case 'type':
      return languages.CompletionItemKind.Method

    case 'module':
      return languages.CompletionItemKind.Module

    default:
      return languages.CompletionItemKind.Reference
  }
}

export default kindResolver
