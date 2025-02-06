import { useState } from 'react'
import { useCtx } from './useCtx'

let Node = ({ n, expand, ...rest }) => {
  let [expanded, setExpanded] = useState(expand ? true : false)
  let level = n.level || 0  // 0 is leaf item

  let onClick = () => {
    setExpanded(x => !x)
  }
  let header = { onClick, style: { cursor: 'pointer' } }

  onClick = () => rest.itemClick(n)
  let item = { onClick, style: { cursor: 'pointer' } }

  let str = n.str
  if (level) {
    if (!expanded) str = '+ ' + str
    if (expanded) str = '  ' + str
  }

  // not using any numeration/n.num - noise, those intro-lines are good already

  return <div>
    { level == 1 && <h1 {...header}>{str}</h1> }
    { level == 2 && <h2 {...header}>{str}</h2> }
    { level == 0 && <p {...item}>{str}</p> }
    { expanded && n.xs && n.xs.map((x,i) => <Node n={x} {...rest} key={i} />) }
  </div>
}

export function Toc({ toc }) {
  let { go } = useCtx()
  let itemClick = (n) => go({ book: true, focus: n })
  let ctx = { itemClick }
  return ( 
    <div className='toc'>{
      toc.map((x, i) =>
        <Node n={x} key={i} expand {...ctx} />
      )
    }</div>
  )
}
