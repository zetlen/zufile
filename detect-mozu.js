(function() {
var data = {},
    dataLoaded,
    apiContext,
    pageContext,
    sdkLoaded,
    api,
    cb,
    apiContextElm = document.getElementById('data-mz-preload-apicontext');
if (apiContextElm) {
  try {
    apiContext = JSON.parse(apiContextElm.textContent);
    pageContext = JSON.parse(document.getElementById('data-mz-preload-pagecontext').textContent);
  } catch(e) {}

  if (apiContext) {
    chrome.runtime.sendMessage('isMozuPage');
    chrome.runtime.onMessage.addListener(function(msg, sender, response) {
      cb = response;
      if (msg && msg.from === "popup" && msg.subject === "mozuinfo") {
        if (!sdkLoaded) {
          chrome.runtime.sendMessage('sdkplease', function() {
            sdkLoaded = true;
            MozuSDK.setServiceUrls(apiContext.urls);
            var headers = apiContext.headers;
            api = MozuSDK.Tenant(headers['x-vol-tenant'])
                 .MasterCatalog(headers['x-vol-master-catalog'])
                 .Site(headers['x-vol-site'])
                 .AppClaims(headers['x-vol-app-claims'])
                 .UserClaims(headers['x-vol-user-claims'])
                 .api();

            sendMozuInfo();
          });
          return true;
        } else {
          sendMozuInfo(); 
        }
      }
    });
  }
}

function sendMozuInfo() {
  if (!dataLoaded) {
    var x = new XMLHttpRequest();
    x.onload = function() {
      api.all(api.get('products'), api.get('categories')).then(function(arr) {
        data.pageContext = pageContext;
        data.apiContext = apiContext;
        data.siteContext = JSON.parse(x.responseText).locals.siteContext;
        data.numProducts = arr[0].data.totalCount;
        data.numCategories = arr[1].data.totalCount;
        dataLoaded = true;
        cb(data);
      });
    }
    x.open('GET','/hyprlivecontext');
    x.send();
  } else {
    cb(data);
  }
}

}());