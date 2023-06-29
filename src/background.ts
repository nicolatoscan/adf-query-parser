/// <reference path="../node_modules/chrome-types/index.d.ts" />


chrome.contextMenus.create({
  title: "Copy Query",
  id: "copyADFMenu",
  contexts: ["selection"],
});

chrome.contextMenus.create({
  title: "Paste Query",
  id: "pastADFMenu",
  contexts: ["editable"],
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  sendCommand(info.menuItemId.toString(), tab?.id, info.selectionText);
});

chrome.commands.onCommand.addListener(async (command) => {
  const { tabId, selection } = await getTabIdAndSelection();
  sendCommand(command, tabId, selection);
});

function sendCommand(cmd: string, tabId: number | undefined, textToCopy?: string) {
  if (tabId !== undefined && ["copyADF", "pasteADF", "copyADFMenu", "pastADFMenu"].includes(cmd) )
    chrome.tabs.sendMessage(tabId, { cmd, textToCopy });
}

async function getTabIdAndSelection() {
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  const [{ result }] = await chrome.scripting.executeScript({
    target: {tabId: tab.id ?? 0},
    func: () => getSelection()?.toString(),
  });

  return { tabId: tab.id, selection: result };
}