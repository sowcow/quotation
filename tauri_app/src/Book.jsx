import { useContext, useState, useEffect, useMemo } from 'react'
import { doPlay, doToggle, doReplay, doRecord, doStopRecording, doPlayRecording } from './Play'
import { useCtx } from './useCtx'
import { loadBook, loadCuts } from './backend'
import { Button } from './Button'


export function Book({ book, cuts }) {
  let { e, page } = useCtx();

  let focus = useMemo(() => page && page.focus && page.focus.ref, [page])
  let [recording, setRecording] = useState(false)

  useEffect(() => {
    if (focus == null) return
    let el = document.getElementById(`part-${focus}`)
    el && el.scrollIntoView({ behavior: 'auto', block: 'start' });
  }, [focus]);

  return <div>
    <div style={{ position: 'fixed', top: 0, right: 0 }}>
      <Button s='⏮' onClick={doReplay} />
      <Button s='⏯' onClick={doToggle} />
      <div></div>
      <Button s='⟳' onClick={doPlayRecording} />
      <Button s={ recording ? '◼' : '●'} onClick={() => {
        if (recording) {
          doStopRecording()
          setRecording(false)
        } else {
          doRecord()
          setRecording(true)
        }
      }} />
    {/*
      <HoldButton s='●' onPress={async () => {
        try {
          await doRecord()
        } catch(err) {
          e(err)
        }
      }} onRelease={doStopRecording} />
      */}
    </div>
    {book.map((x,i) =>
      <div key={i} onClick={(event) => {
        if (event.target !== event.currentTarget) return

        if (x.seek == null) return

        let xs = cuts.filter(y => y.t <= x.seek);
        let cut = xs[xs.length - 1];
        if (!cut) return

        event.preventDefault()
        event.stopPropagation()
        doPlay(cut.f, 0, e).catch(e);
      }}>
        <span key={i} id={`part-${i}`} onClick={() => {
          if (x.seek == null) return

          let xs = cuts.filter(y => y.t <= x.seek);
          let cut = xs[xs.length - 1];
          if (!cut) return

          let seek = x.seek - cut.t;
          doPlay(cut.f, seek, e).catch(e);
        }}>
        {x.part}
        </span>
      </div>
    )}
  </div>
}
