const path = require('path')
const slash = require('slash')
const chokidar = require('chokidar')
const { EventEmitter } = require('events')
const { Demo } = require('./demo')

const modulePrefix = '/@demos/'
const demoManifestId = modulePrefix + 'manifest.js'

/**
 * @returns {import('vite').Plugin}
 */
module.exports = () => {
  const events = new EventEmitter()
  const demoCache = {}

  // Dedupe auto-formatted files.
  const timeoutCache = {}
  const emitChange = moduleId => {
    clearTimeout(timeoutCache[moduleId])
    timeoutCache[moduleId] = setTimeout(
      () => events.emit('change', moduleId),
      150
    )
  }

  return {
    name: 'demos',
    enforce: 'pre',
    config: () => ({
      resolve: {
        alias: {
          '@demos/manifest': demoManifestId,
        },
      },
    }),
    configResolved(config) {
      const demoDir = slash(path.join(config.root, 'demos'))
      const watcher = chokidar
        .watch(['**/App.tsx'], { cwd: demoDir })
        .on('all', (event, name) => {
          name = slash(name)
          const demoId = path.dirname(name)
          if (event == 'add') {
            const demoModuleId = modulePrefix + demoId + '/'
            demoCache[demoId] = new Demo(path.join(demoDir, name), file => {
              if (file == 'App.tsx') {
                emitChange(demoModuleId + 'App.json')
                emitChange(demoModuleId + file)
              } else if (file == 'props.ts') {
                emitChange(demoModuleId + file)
              }
            })
            emitChange(demoManifestId)
          } else if (event == 'unlink') {
            const demo = demoCache[demoId]
            delete demoCache[demoId]
            demo.watcher.close()
            emitChange(demoManifestId)
          }
        })

      this.closeWatcher = () => {
        watcher.close()
        Object.values(demoCache).forEach(demo => {
          demo.watcher.close()
        })
      }

      /** @type import('vite-plugin-mdx').MdxPlugin */
      const mdxPlugin = config.plugins.find(
        plugin => plugin.name === 'vite-plugin-mdx'
      )

      // Import the Demo component automatically.
      mdxPlugin.mdxOptions.remarkPlugins.push(() => (root, file) => {
        if (root.children.some(node => node.type === 'mdxBlockElement')) {
          const [firstChild] = root.children
          const importIndex = firstChild.type === 'yaml' ? 1 : 0

          root.children.splice(importIndex, 0, {
            type: 'import',
            value: `import { Demo } from 'theme/demo'`,
          })
        }
      })
    },
    configureServer({ moduleGraph, watcher }) {
      events.on('change', moduleId => {
        const module = moduleGraph.getModuleById(moduleId)
        if (module) {
          moduleGraph.invalidateModule(module)
          watcher.emit('change', moduleId)
        }
      })
    },
    resolveId(id) {
      if (id.startsWith(modulePrefix)) {
        return id
      }
    },
    load(id) {
      if (id == demoManifestId) {
        const lines = ['export default {']
        for (const demoId in demoCache) {
          lines.push(
            `  '${demoId}': () => [`,
            `    import('${modulePrefix + demoId}/App.json'),`,
            `    import('${modulePrefix + demoId}/App.tsx'),`,
            `    import('${modulePrefix + demoId}/props.ts'),`,
            `  ],`
          )
        }
        lines.push('}')
        return lines.join('\n')
      }
      if (id.startsWith(modulePrefix)) {
        const file = path.basename(id)
        const demoId = id.slice(modulePrefix.length, -file.length - 1)
        const demo = demoCache[demoId]
        if (demo) {
          if (file === 'props.ts') {
            return demo.renderConfig()
          }
          if (file === 'App.tsx') {
            return demo.renderIndex(true)
          }
          if (file === 'App.json') {
            return JSON.stringify(demo.renderIndex())
          }
        }
      }
    },
    // Other plugins may try to read our virtual modules
    // in their `handleHotUpdate` hooks (eg: windicss).
    handleHotUpdate(ctx) {
      if (ctx.file.startsWith(modulePrefix)) {
        ctx.read = () => this.load(ctx.file)
      }
    },
  }
}
