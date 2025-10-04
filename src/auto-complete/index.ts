import * as Monaco from 'monaco-editor'

import { ImportAction } from './import-action'
import ImportCompletion from './import-completion'
import ImportDb from './import-db'

export let monaco: typeof Monaco

export interface Options {
  monaco: typeof Monaco,
  editor: Monaco.editor.IStandaloneCodeEditor,
  spacesBetweenBraces: boolean,
  doubleQuotes: boolean,
  semiColon: boolean
  alwaysApply: boolean
}

class AutoImport {
  public imports = new ImportDb()
  private readonly editor: Monaco.editor.IStandaloneCodeEditor
  private readonly spacesBetweenBraces: boolean
  private readonly doubleQuotes: boolean
  private readonly semiColon: boolean
  private readonly alwaysApply: boolean
  private completor: ImportCompletion;

  constructor(options: Options) {
    monaco = options.monaco
    this.editor = options.editor
    this.spacesBetweenBraces = options.spacesBetweenBraces ?? true
    this.doubleQuotes = options.doubleQuotes ?? true
    this.semiColon = options.semiColon ?? true
    this.alwaysApply = options.alwaysApply ?? true
    this.attachCommands()
  }
  
  /**
   * Register the commands to monaco & enable auto-importation
   */
  public attachCommands() {
    this.completor = new ImportCompletion(monaco, this.editor, this.imports, this.spacesBetweenBraces, this.doubleQuotes, this.semiColon, this.alwaysApply)
    monaco.languages.registerCompletionItemProvider('javascript', this.completor)
    monaco.languages.registerCompletionItemProvider('typescript', this.completor)

    const actions = new ImportAction(this.editor, this.imports)
    monaco.languages.registerCodeActionProvider('javascript', actions as any)
    monaco.languages.registerCodeActionProvider('typescript', actions as any)
  }

  private extractNameFromMarker(message: string): string {
    const match = message.match(/Cannot find name '([^']*)'./);
    return match ? match[1] : "";
  }

  /**
   * Resolve missing imports from the markers.
   */
  public resolveMissingImports() {
    const document = this.editor.getModel();
    if (document === null) { return; }

    const unresolved = new Set<string>();
    const markers = monaco.editor.getModelMarkers({ owner: 'typescript', resource: document.uri });
    for (const marker of markers) {
      if (marker.severity === monaco.MarkerSeverity.Error && marker.message.startsWith('Cannot find name')) {
        const name = this.extractNameFromMarker(marker.message);
        if (name.length > 0) {
          unresolved.add(name);
        }
      }
    }

    for (const name of unresolved) {
      const imports = this.imports.getImports(name);
      if (imports.length === 1) {
        this.completor.handleCommand(imports[0], document);
      }
    }

  }
}

export default AutoImport
