import type * as Monaco from 'monaco-editor'

import { ImportAction } from './import-action'
import ImportCompletion from './import-completion'
import ImportDb from './import-db'

export interface Options {
  monaco: typeof Monaco,
  editor: Monaco.editor.IStandaloneCodeEditor,
  spacesBetweenBraces: boolean,
  doubleQuotes: boolean,
  semiColon: boolean
  alwaysApply: boolean
  dontAttach?: boolean
}

class AutoImport {
  public imports = new ImportDb()
  private readonly editor: Monaco.editor.IStandaloneCodeEditor
  private readonly spacesBetweenBraces: boolean
  private readonly doubleQuotes: boolean
  private readonly semiColon: boolean
  private readonly alwaysApply: boolean

  constructor(options: Options) {
    this.editor = options.editor
    this.spacesBetweenBraces = options.spacesBetweenBraces ?? true
    this.doubleQuotes = options.doubleQuotes ?? true
    this.semiColon = options.semiColon ?? true
    this.alwaysApply = options.alwaysApply ?? true
    options.dontAttach || this.attachCommands(options.monaco)
  }
  
  /**
   * Register the commands to monaco & enable auto-importation
   */
  public attachCommands(monaco: typeof Monaco) {
    const completor = new ImportCompletion(this.editor, this.imports, this.spacesBetweenBraces, this.doubleQuotes, this.semiColon, this.alwaysApply)
    const actions = new ImportAction(this.editor, this.imports)
    return [
      monaco.languages.registerCompletionItemProvider('javascript', completor),
      monaco.languages.registerCompletionItemProvider('typescript', completor),
      monaco.languages.registerCodeActionProvider('javascript', actions as any),
      monaco.languages.registerCodeActionProvider('typescript', actions as any)
    ];
  }
}

export default AutoImport
