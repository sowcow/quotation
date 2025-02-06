import { useState, createContext } from 'react';
import { loadData } from './backend'
import { AudioPlayer } from './AudioPlayer'

export let PlayContext = createContext()

// not really used, it was used for highlighting played text I think
//
export function PlayProvider ({ children }) {
  let Context = PlayContext
  let [value, setValue] = useState('');

  return (
    <Context.Provider value={{ value, setValue }}>
      {children}
    </Context.Provider>
  );
};

let player = new AudioPlayer()
let previousAudio = {}
let previousPlay = {}

export async function doPlay(fileName, seek, e) {
  previousPlay = { fileName, seek, e }
  player.stop()

  let contents
  if (previousAudio.fileName != fileName) {
    contents = await loadData(fileName);
    previousAudio = { fileName, contents }
  } else {
    contents = previousAudio.contents
  }
  player.play(contents, seek)
}

// pause
export function doToggle() {
  player.toggle()
}

export function doReplay() {
  previousPlay && doPlay(previousPlay.fileName, previousPlay.seek, previousPlay.e)
}

export function doRecord() {
  return player.startRecording()
}

export function doStopRecording() {
  return player.stopRecording()
}

export function doPlayRecording() {
  return player.playRecording()
}
