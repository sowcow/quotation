import { useState, useContext, createContext } from 'react';
import { readFile } from '@tauri-apps/plugin-fs';
import * as path from '@tauri-apps/api/path';

export let Context = createContext()

export function Provider ({ children }) {
  let fallback = { toc: true }
  let [stack, setStack] = useState([])
  let page = stack[stack.length - 1] || fallback
  let go = x => setStack(xs => [...xs, x])
  let back = x => setStack(xs => xs.slice(0, -1))

  return (
    <Context.Provider value={{ page, go, back }}>
      {children}
    </Context.Provider>
  );
};
