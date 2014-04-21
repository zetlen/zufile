(function() {
var apiContext,
    pageContext,
    apiContextElm = document.getElementById('data-mz-preload-apicontext');
if (apiContextElm) {
  try {
    apiContext = JSON.parse(apiContextElm.textContent);
    pageContext = JSON.parse(document.getElementById('data-mz-preload-pagecontext'));
  } catch(e) {}

  if (apiContext) {
    chrome.runtime.sendMessage('isMozuPage');
    chrome.runtime.onMessage.addListener(function(msg, sender, response) {
      if (msg && msg.from === "popup" && msg.subject === "mozuinfo") {
        var x = new XMLHttpRequest();
        x.onload = function() {
          response({
            pageContext: pageContext,
            apiContext: apiContext,
            siteContext: JSON.parse(x.responseText).locals.siteContext
          });
        }
        x.open('GET','/hyprlivecontext');
        x.send();
      }
    });
  }
}
}());