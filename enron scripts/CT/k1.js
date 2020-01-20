var CACHE_NAME = 'CACHE';


self.addEventListener('activate', function(event) {
    clients.claim().then(function() {
        return self.clients.matchAll().then(function(clients) {
            return Promise.all(clients.map(function(client) {
                return client.postMessage({
                    'activated': true
                });
            }));
        });
    })
});


self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((resp) => {
      return resp || fetch(event.request).then((response) => {
        return caches.open(CACHE_NAME).then((cache) => {
			if ( event.request.url.match('http://localhost:8000/CT/') ) {
				return response;
			}
          cache.put(event.request, response.clone());
          return response;
        });  
      });
    })
  );
});


self.addEventListener('message', function(event) {
    if (event.data.clean) {
        // caches.delete(CACHE_NAME);
        return;
    }
    caches.open(CACHE_NAME).then(function(cache) {
        request = new Request(event.data.url, {
            mode: 'no-cors',
            credentials: 'include',
        });
        cache.add(request).then(function() {
            // NO redirect
            event.ports[0].postMessage({
                'url': event.data.url,
                'response': false
            });
        }).catch(function(error) {
            // REDIRECTION
            event.ports[0].postMessage({
                'url': event.data.url,
                'response': true
            });
        });
    });
});
