import { useState, useEffect } from 'react'
import { Debug } from './Debug'
import { PlayProvider } from './Play'
import { Book } from './Book'
import { Toc } from './Toc'
import "./style.css";
import { useCtx } from './useCtx';
import { loadToc, loadBook, loadCuts } from './backend'
import { useLongPress } from 'use-long-press';
import { useScreenSize } from './useScreenSize';

const TOC_PRESS_DURATION = 2000;

function App() {
  let { e, page, back } = useCtx();

  let [book, setBook] = useState([]);
  let [cuts, setCuts] = useState([]);
  let [toc, setToc] = useState([]);

  useEffect(() => {
    loadBook().then(x =>
      setBook(x)
    ).catch(e)
    loadCuts().then(x =>
      setCuts(x)
    ).catch(e)
    loadToc().then(x =>
      setToc(x)
    ).catch(e)
  }, [])

  let screenSize = useScreenSize();

  let bind = useLongPress((e) => {
    if (e.target.tagName == 'BUTTON') return
    back()
  }, {
    cancelOnMovement: screenSize / 4,
    threshold: TOC_PRESS_DURATION,
  });

  return (
    <div {...bind()}>
      <PlayProvider>
        <Debug />
        { page.toc && <Toc toc={toc} /> }
        { page.book && <Book book={book} cuts={cuts} /> }
      </PlayProvider>
    </div>
  );
}

export default App;
