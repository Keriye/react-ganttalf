import React from 'react'

type Props = {
  text?: string
}

const GanttCart = ({ text = 'Hello World' }: Props) => {
  return <div>{text}</div>
}

export default GanttCart
