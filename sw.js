self.addEventListener("install", function(event) {
    event.waitUntil(
        caches.open("v1").then(function(cache) {
            return cache.addAll([
                "index.html",
                "counter.css",
                "counter.min.css",
                "counter.js",
                "counter.min.js",
                "hammer.2.0.8.js",
                "hammer.2.0.8.min.js",
                "slideout.js",
                "slideout.min.js",
                "head.png",
                "menu-hr.png",
                "skull.gif"
            ]);
        })
    );
});
self.addEventListener("fetch", function(event) {
    event.respondWith(
        caches.match(event.request).then(function(resp) {
            return resp || fetch(event.request).then(function(response) {
                var responseClone = response.clone();
                caches.open("v1").then(function(cache) {
                    cache.put(event.request, responseClone);
                });
                return response;
            });
        }).catch(function() {
            return caches.match("skull.gif");
        })
    );
});
