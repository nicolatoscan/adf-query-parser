"use strict";
/// <reference path="../node_modules/chrome-types/index.d.ts" />
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
chrome.contextMenus.onClicked.addListener((info, tab) => __awaiter(void 0, void 0, void 0, function* () {
    sendCommand(info.menuItemId.toString(), tab === null || tab === void 0 ? void 0 : tab.id, info.selectionText);
}));
chrome.commands.onCommand.addListener((command) => __awaiter(void 0, void 0, void 0, function* () {
    const { tabId, selection } = yield getTabIdAndSelection();
    sendCommand(command, tabId, selection);
}));
function sendCommand(cmd, tabId, textToCopy) {
    if (tabId !== undefined && ["copyADF", "pasteADF", "copyADFMenu", "pastADFMenu"].includes(cmd))
        chrome.tabs.sendMessage(tabId, { cmd, textToCopy });
}
function getTabIdAndSelection() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const [tab] = yield chrome.tabs.query({ active: true, currentWindow: true });
        const [{ result }] = yield chrome.scripting.executeScript({
            target: { tabId: (_a = tab.id) !== null && _a !== void 0 ? _a : 0 },
            func: () => { var _a; return (_a = getSelection()) === null || _a === void 0 ? void 0 : _a.toString(); },
        });
        return { tabId: tab.id, selection: result };
    });
}
