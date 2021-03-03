import { useEffect, useState } from 'react'
import FontFaceObserver from 'fontfaceobserver-es'

const defaultFonts = ['AcehSoft', 'Inter var']
const promiseCache: { [fontFamily: string]: Promise<void> } = {}

export function useFontLoaded(fonts = defaultFonts) {
  let [loaded, setLoaded] = useState(false)
  useEffect(() => {
    let remaining = fonts.length
    const onLoad = () => --remaining || setLoaded(true)
    fonts.forEach(fontFamily => {
      const promise =
        promiseCache[fontFamily] ||
        (promiseCache[fontFamily] = new FontFaceObserver(fontFamily).load())

      promise.then(onLoad, console.error)
    })
    return () => {
      setLoaded = () => {}
    }
  }, [])
  return loaded
}
