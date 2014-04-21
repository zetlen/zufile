chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request === "isMozuPage") chrome.pageAction.show(sender.tab.id);
  if (request === "sdkplease") {
    chrome.tabs.executeScript(sender.tab.id, {
      file: 'mozu-javascript-sdk-min.js'
    }, function(script) {
      console.log(this, arguments);
      sendResponse(script);

    });
    return true;
  }
})