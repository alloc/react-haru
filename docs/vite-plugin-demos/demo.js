const path = require('path')
const slash = require('slash')
const dedent = require('dedent')
const chokidar = require('chokidar')
const { Project, SourceFile, Node, ts } = require('ts-morph')

exports.Demo = class Demo {
  constructor(appPath, onChange) {
    this.baseDir = path.dirname(appPath)

    const project = new Project()
    const appFile = project.addSourceFileAtPath(appPath)
    let propsFile = project.addSourceFileAtPathIfExists(
      path.join(this.baseDir, 'props.ts')
    )

    let demoFile // The appFile with demo mods.
    let demoConfig // The propsFile with demo mods.

    let ready = false
    this.watcher = chokidar
      .watch(['**/*'], {
        cwd: this.baseDir,
      })
      .on('all', (event, name) => {
        name = slash(name)
        const filePath = path.join(this.baseDir, name)
        if (name == 'props.ts') {
          if (event == 'unlink') {
            project.removeSourceFile(propsFile)
            demoConfig = null
          } else {
            if (event == 'add') {
              propsFile = project.addSourceFileAtPath(filePath)
            } else {
              propsFile.refreshFromFileSystemSync()
            }
            demoConfig = createDemoConfig(propsFile)
          }
        } else if (name == 'App.tsx') {
          if (event == 'change') {
            appFile.refreshFromFileSystemSync()
          }
          demoFile = appFile.copy('App.demo.tsx', { overwrite: true })
          prepareApp(demoFile, true)
          prepareApp(appFile)
        }
        if (ready) {
          onChange(name)
        }
      })
      .once('ready', () => (ready = true))

    this.renderIndex = isDemo => (isDemo ? demoFile : appFile).getFullText()
    this.renderConfig = () =>
      demoConfig ? demoConfig.getFullText() : 'export {}'

    /**
     * @param {SourceFile} appFile
     */
    function prepareApp(appFile, isDemo) {
      const propsImport = appFile.getImportDeclarations().find(importDecl => {
        return importDecl.getModuleSpecifierSourceFile() === propsFile
      })
      if (!propsImport) {
        return
      }
      const appComponent = appFile
        .getExportedDeclarations()
        .get('App')
        .find(Node.isFunctionDeclaration)
      if (!appComponent) {
        return
      }
      const propsArg = appComponent.getParameter('props')
      if (!propsArg) {
        return
      }

      // Strip the prop types.
      propsArg.replaceWithText('props')
      propsImport.remove()

      // Insert tracking code.
      if (isDemo) {
        appFile.insertStatements(
          0,
          `import {Globals as _G} from 'react-haru/web'`
        )
        propsArg.replaceWithText('{props, tracker}')
        appComponent.setBodyText(dedent`
          _G.assign({ tracker })
          try {
            ${appComponent.getBodyText().replace(/\n/g, '\\n')}
          } finally {
            _G.assign({ tracker: null })
          }
        `)
      }
    }

    /**
     * @param {SourceFile} propsFile
     */
    function createDemoConfig(propsFile) {
      const configFile = project.createSourceFile('config.ts', '', {
        overwrite: true,
      })

      let knobs
      let onCycle
      let propTypes

      for (const stmt of propsFile.getStatements()) {
        if (Node.isExpressionStatement(stmt)) {
          const call = stmt.getExpressionIfKind(ts.SyntaxKind.CallExpression)
          if (call) {
            const callee = call.getExpression()
            const [firstArg] = call.getArguments()
            switch (Node.isIdentifier(callee) && callee.getText()) {
              case 'defineKnobs':
                knobs = firstArg
                break
              case 'defineCycle':
                onCycle = firstArg
                break
            }
          }
        } else if (Node.isInterfaceDeclaration(stmt)) {
          if (stmt.getName() === 'Props') {
            propTypes = stmt.getProperties()
          }
        }
      }

      /** @type string[] */
      const added = []

      if (propTypes && Node.isObjectLiteralExpression(knobs)) {
        for (const prop of knobs.getProperties()) {
          if (!Node.isPropertyAssignment(prop)) {
            continue
          }
          const name = prop.getName()
          const init = prop.getInitializer()
          if (!Node.isObjectLiteralExpression(init)) {
            continue
          }
          const propType = propTypes.find(prop => prop.getName() === name)
          if (!propType) {
            continue
          }
          const type = propType.getType().getText()
          const knobType =
            type === 'boolean'
              ? 'toggle'
              : type === 'number'
              ? type
              : type === 'Channel'
              ? 'button'
              : null

          if (knobType)
            init.addPropertyAssignment({
              name: 'type',
              initializer: `"${knobType}"`,
            })
        }

        added.push('export const knobs = ' + knobs.getText())
      }

      if (Node.isArrowFunction(onCycle)) {
        added.push('export const onCycle = ' + onCycle.getText())
      }

      if (added.length) {
        configFile.addStatements('\n' + added.join('\n\n') + '\n')
        return configFile
      }
    }
  }
}
