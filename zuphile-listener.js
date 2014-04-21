chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (message === "isMozuPage") chrome.pageAction.show(sender.tab.id);
})