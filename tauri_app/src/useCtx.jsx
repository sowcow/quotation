import { useContext } from 'react';
import { Context as DebugContext } from './Debug'
import { Context as NavContext } from './Nav'

export function useCtx() {
  let result = [
    useContext(DebugContext),
    useContext(NavContext),
  ].reduce((a,x) => ({ ...a, ...x }), {})
  return result
} 
