## zufile

When Zufile is installed, a little Mozu icon should show up in the address bar as a page action, whenever the active tab is on a Mozu site. Click on it, wait for it to run a couple requests, and it should show you some good stuff.

### Prerelease Installation

1. Download the code or clone the repository.
2. In Chrome, visit chrome://extensions
3. Click "Load unpacked extension..."
4. Find the zufile folder and click "Select".

### Possible extension points

* We can run other requests to the runtime services to get other stats besides number of products and number of categories
* We can make a version of this for the admin
* We can display payment settings on the checkout page only
* We can add more metadata to storefront pages so we don’t have to hack environment info out of the CDN prefix

### Known limitations

* Limited currently to data available to shoppers, not to admins or anyone with higher privilege
* Doesn't have direct access to environment/pod info, is hacking it out of the CDN prefix url. When the CDN prefix URL isn't present, neither is this data
* Relies on a couple of script tags being present in the theme, generated by the {% preload_json %} tag
* Kind of ugly.