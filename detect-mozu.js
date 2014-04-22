(function() {

function extend(obj1, obj2) {
  for (var k in obj2) {
    if (obj2.hasOwnProperty(k)) {
      obj1[k] = obj2[k];
    }
  }
}

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


var ENVS = {
  "mozu": "Production",
  "mozu-qa": "QA"
},
PODS = {
  "cdn-sb": "Sandbox",
  "cdn-tp1": "TP1",
  "cdn-tp2": "TP2",
  "cdn-origin-tp1": "TP1",
  "cdn-origin-tp2": "TP2",
  "cdn-origin-sb": "Sandbox"
};

function getEnvironmentData(cdnPrefix) {
  var data = {
    cdnEnabled: !!cdnPrefix
  },
  matchColl, match;

  if (cdnPrefix) {
    var matchColl = cdnPrefix.match(/\/\/([^\/]+)\.com\/.*/);
    if (matchColl && matchColl[1]) {
      match = matchColl[1].split('.');
      data.environment = ENVS[match.pop()];
      data.pod = PODS[match.shift()];
    }
  }

  return data;
}

function sendMozuInfo() {
  if (!dataLoaded) {
    var x = new XMLHttpRequest();
    x.onload = function() {
      api.all(api.get('products', { pageSize: 1}), api.get('categories', { pageSize: 1 })).then(function(arr) {
        
        extend(data, {
          pageContext: pageContext,
          apiContext: apiContext,
          siteContext: JSON.parse(x.responseText).locals.siteContext,
          numProducts: arr[0].data.totalCount,
          numCategories: arr[1].data.totalCount
        });
        
        extend(data, getEnvironmentData(data.siteContext.cdnPrefix));

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