interface IArrowProps {
  tip: { x: number; y: number }
  size: number
  stroke: string
  rotateAngle?: number
}

export default function Arrow(props: IArrowProps) {
  const path = `M
                  ${props.tip.x} ${props.tip.y}
                  l ${-props.size} ${-props.size / 2}
                  v ${props.size}
                  z
                `
  return (
    <path
      d={path}
      fill={props.stroke}
      stroke={props.stroke}
      transform={`rotate(${props.rotateAngle || 0} ${props.tip.x} ${props.tip.y})`}
    />
  )
}
