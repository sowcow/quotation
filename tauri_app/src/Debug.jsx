import { useState, useContext, createContext } from 'react';
import { readFile } from '@tauri-apps/plugin-fs';
import * as path from '@tauri-apps/api/path';

export let Context = createContext()

function enumerateKeys(obj) {
    let keys = new Set();

    // Add own property keys
    Object.getOwnPropertyNames(obj).forEach(key => keys.add(key));
    Object.getOwnPropertySymbols(obj).forEach(sym => keys.add(sym.toString()));

    // Traverse the prototype chain
    let proto = Object.getPrototypeOf(obj);
    while (proto) {
        Object.getOwnPropertyNames(proto).forEach(key => keys.add(key));
        Object.getOwnPropertySymbols(proto).forEach(sym => keys.add(sym.toString()));
        proto = Object.getPrototypeOf(proto);
    }

    return [...keys];
}


export function Provider ({ children }) {
  let [logs, setValue] = useState([]);
  let e = x => {
    //if (isObject(x) && 'stack' in x) {
    let str = ''
    str += x.toString()
    let add = line => {
      str += '\n  ' + line
    }
    add(x.toString())

    if (ArrayBuffer.isView(x) || Array.isArray(x)) {
        add(`[...] ~ ${x.length}`)
    } else if (isObject(x)) {
      enumerateKeys(x).forEach(k => {
        try {
          add(`${k} - ${x[k]}`)
        } catch (e) {
          add(`${k} - ...`)
        }
      })
    }

    setValue(xs => [...xs, str])
  }

  return (
    <Context.Provider value={{ logs, e }}>
      {children}
    </Context.Provider>
  );
};

export function Debug() {
  let { logs } = useContext(Context)

  if (!logs.length) {
    return null
  }

  return <div style={{ position: 'fixed', top: 0, left: 0, right: 50, outline: 'solid 3px orange', backgroundColor: '#ffeeaa',
      maxHeight: '50vh', overflowY: 'auto'
  }}>
    { logs.map((x, i) =>
      <div key={i}>
        { x }
      </div>
    )}
  </div>
}

let isObject = (x) => x !== null && typeof x === 'object';
