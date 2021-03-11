declare module '@demos/manifest' {
  const demos: {
    [id: string]: import('./types').DemoLoader
  }
  export default demos
}
