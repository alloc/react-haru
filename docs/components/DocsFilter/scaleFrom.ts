export function scaleFrom(anchorX: number, anchorY: number) {
  const x = (anchorX - 0.5) * 100
  const y = (anchorY - 0.5) * 100
  return (scale: number) =>
    `translate3d(${x}%, ${y}%, 0) scale(${scale}) translate(${-x}%, ${-y}%)`
}
