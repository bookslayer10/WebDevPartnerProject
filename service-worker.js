const version = 'v2326';  // change this everytime you update the service worker
                          // to force the browser to also update it.

self.addEventListener('install', function(event) {
  console.log('Service worker install event!');

  event.waitUntil(
    
    caches.open(version).then(function(cache) {
    // add all images, js, css, and html files needed to run
    // the app offline to the list below
      return cache.addAll([    
        '/',                   
        '/index.html',
        '/style.css',
        '/script.js',
        '/manifest.json',
        '/images/512img.png',
        '/images/favicon.ico',
        '/images/256img.png'
      ]);
    })
  );
});

self.addEventListener('activate', event => {
  console.log('Service worker activate event!');
});

self.addEventListener("fetch", function(event) {
  console.log("[Service Worker] Fetch (url)", event.request.url);

  // fetch resources
  event.respondWith(caches.match(event.request).then(function(response) {
     console.log("Found in Cache ", event.request.url);
    // caches.match() always resolves
    // but in case of success response will have value
    if (response !== undefined) {
      console.log("response was undefined");
      return response;
    } else {
       console.log("[Service Worker] Caching (data)", event.request.url);
      return fetch(event.request).then(function (response) {
        // response may be used only once
        // we need to save clone to put one copy in cache
        // and serve second one
        let responseClone = response.clone();

        caches.open(version).then(function (cache) {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(function () {
        return caches.match('/notfound.txt');  // notfound.txt is a simple page 
                                               // to load if the page does not 
                                               // load and must be saved in the root folder
      });
    }
  }));

});