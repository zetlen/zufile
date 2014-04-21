

    var attrs = [];

    function setAttr(k, v) {
      attrs.push({ name: k, value: v});
    }

    function show() {
      var dl = document.createElement('dl');
      attrs.forEach(function(attr) {
        var dt = document.createElement('dt'),
        dd = document.createElement('dd');
        dt.appendChild(document.createTextNode(attr.name));
        dd.appendChild(document.createTextNode(attr.value));
        dl.appendChild(dt);
        dl.appendChild(dd);
      });
      var w = document.getElementById('wait');
      w.parentNode.removeChild(w);
      document.body.appendChild(dl);
    }

    function collectMozuData(data) {
      setAttr("Site Name", data.siteContext.generalSettings.websiteName);
      setAttr("CDN Enabled?", data.cdnEnabled);
      setAttr("Environment", data.environment || "(unknown when CDN disabled)");
      setAttr("Pod", data.pod || "(unknown when CDN disabled)");
      setAttr("Tenant Id", data.apiContext.headers['x-vol-tenant']);
      setAttr("Site Id", data.apiContext.headers['x-vol-site']);
      setAttr("Theme Id", data.siteContext.themeId);
      setAttr("Number of Products", data.numProducts);
      setAttr("Number of Categories", data.numCategories);
      setAttr("Logged in?", !data.pageContext.user.isAnonymous);
      show(attrs);
    }

      /* Once the DOM is ready... */
      window.addEventListener("DOMContentLoaded", function() {
          /* ...query for the active tab... */
          chrome.tabs.query({
              active: true,
              currentWindow: true
          }, function(tabs) {
              /* ...and send a request for the DOM info... */
              chrome.tabs.sendMessage(
                      tabs[0].id,
                      { from: "popup", subject: "mozuinfo" },
                      /* ...also specifying a callback to be called 
                       *    from the receiving end (content script) */
                      collectMozuData);
          });
      });