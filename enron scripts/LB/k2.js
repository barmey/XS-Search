var CACHE_NAME = 'CACHE';
var URL_PARAMETER = "url_par";

var counter = -1;

self.addEventListener('activate', function(event) {
    clients.claim().then(function() {
        return self.clients.matchAll().then(function(clients) {
            return Promise.all(clients.map(function(client) {
				//cacheAll(initialRequests)
                return client.postMessage({
                    'activated': true
                });
            }));
        });
    })
});


function getParams(u)
{
	var params = {};

	var index = u.indexOf("?");
	if (index == -1)
		return params;
	
	u = u.substr(index);
	
	var parts = u.substring(1).split('&');

	for (var i = 0; i < parts.length; i++) {
		var nv = parts[i].split('=');
		if (!nv[0]) continue;
			params[nv[0]] = nv[1] || true;
	}
	
	return params;
}

// The page has made a request
self.addEventListener("fetch", function (event) {
  var addCacheEntry = false;
  p = getParams(event.request.url);
  var req;
  if (p[URL_PARAMETER] != undefined)
  {
	req = new Request(event.request.url.substr(event.request.url.indexOf('=')+1)); // the URL_PARAMETER must be the first parameter
	addCacheEntry = true;
  }
  else
  {
	req = new Request(event.request.url);
  }
  
  event.respondWith(
    caches.match(req)
      .then(function (response) {

        // we have a copy of the response in our cache, so return it
        if (response) {
		  if (addCacheEntry)
		  {
		    counter++;
		    caches.open(CACHE_NAME).then(function (cache) {
				cache.put(new Request("" + counter), response.clone());
			});
		  }
			
          return response;  //no network request necessary
        }else {
			return fetch(req.clone()).then(function(response) {
				return response;
			});
		}
      })
  );
});

self.addEventListener('message', function(event) {
    if (event.data.clean) {
        // caches.delete(CACHE_NAME);
        return;
    }
	else if (event.data && event.data.urls && event.data.action === 'cacheAll') {
		// console.log('cacheAll');
		cacheAll(event.data.urls).then(function() {
			event.ports[0].postMessage('OK');
		});
	}
	else if (event.data && event.data.action === 'cacheFirst') {
		cacheAll(initialRequests).then(function() {
			event.ports[0].postMessage('OK');
		});
	}
});

function cacheAll(urls) {
	return new Promise(function(resolve) {
		caches.open(CACHE_NAME).then(function(cache) {
			var cacheEmAll = urls.map(function(url) {
				return new Promise(function(urlResolve) {
					var request = new Request(url, {mode: "no-cors", credentials: "same-origin"});
					fetch(request).then(function(response) {
						cache.put(request, response).then(urlResolve);
					});
				});
			});
			Promise.all(cacheEmAll).then(resolve);
		});
	});
}

