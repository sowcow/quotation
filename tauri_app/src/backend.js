import { resolveResource } from '@tauri-apps/api/path';
import { readFile } from '@tauri-apps/plugin-fs';

// -> uint8array
export async function loadData(resFile) {
  let resourcePath = await resolveResource(`resources/${resFile}`);
  let got = await readFile(resourcePath);
  return got
}

async function loadJson(resFile) {
  let got = await loadData(resFile)
  let text = new TextDecoder().decode(got)
  let data = JSON.parse(text);
  return data
}

export async function loadBook() {
  return loadJson('content.json');
}

export async function loadCuts() {
  return loadJson('cuts.json');
}

export async function loadToc() {
  return loadJson('toc.json');
}
