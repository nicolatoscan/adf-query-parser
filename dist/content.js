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
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.cmd === "copyADF" || request.cmd === "copyADFMenu")
        copyToTheClipboard(request.textToCopy);
    else if (request.cmd === "pastADF" || request.cmd === "pastADFMenu")
        pasteFromClipboard();
    sendResponse();
    return true;
});
function copyToTheClipboard(t) {
    return __awaiter(this, void 0, void 0, function* () {
        t = t.trim();
        if (t.startsWith('"'))
            t = t.slice(1);
        if (t.endsWith('"'))
            t = t.slice(0, -1);
        t = t.replace(/\\n/g, '\n').replace(/\${(\w+)}/g, '@$1');
        yield navigator.clipboard.writeText(t);
    });
}
function pasteFromClipboard() {
    return __awaiter(this, void 0, void 0, function* () {
        let t = yield navigator.clipboard.readText();
        t = t.replace(/\r\n/g, '\\n').replace(/\n/g, '\\n').replace(/@(\w+)/g, '${$1}');
        if (!t.startsWith('"'))
            t = `"${t}`;
        if (!t.endsWith('"'))
            t = `${t}"`;
        yield navigator.clipboard.writeText(t);
        document.execCommand('paste');
    });
}
