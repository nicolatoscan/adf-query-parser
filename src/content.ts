/// <reference path="../node_modules/chrome-types/index.d.ts" />

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.cmd === "copyADF" || request.cmd === "copyADFMenu")
      copyToTheClipboard(request.textToCopy);
    else if (request.cmd === "pastADF" || request.cmd === "pastADFMenu")
      pasteFromClipboard();
    sendResponse();
    return true;
  }
);

async function copyToTheClipboard(t: string) {
  t = t.trim();
  if (t.startsWith('"'))
    t = t.slice(1)
  if (t.endsWith('"'))
    t = t.slice(0, -1)
  t = t.replace(/\\n/g, '\n').replace(/\{\$(\w+)}/g, '@$1');

  await navigator.clipboard.writeText(t);
}

async function pasteFromClipboard() {
  let t = await navigator.clipboard.readText();
  t = t.replace(/\r\n/g, '\\n').replace(/\n/g, '\\n').replace(/@(\w+)/g, '\'{$$$1}\'')
  if (!t.startsWith('"'))
    t = `"${t}`;
  if (!t.endsWith('"'))
    t = `${t}"`;
  await navigator.clipboard.writeText(t);
  document.execCommand('paste');
}
