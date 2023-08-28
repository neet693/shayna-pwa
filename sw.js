var CACHE_NAME = 'shayna-cache-v1';
var urlsToChache=[
    '/',
    '/index.html',
    '/page.html',
];

self.addEventListener('install',function(event){
event.waitUntil(
    caches.open(CACHE_NAME)
    .then(function(cache){
        console.log('Opened Cache');
        return cache.addAll(urlsToChache);
    })
)
});
  

self.addEventListener('fetch',function(event){
    event.respondWith(
        caches.match(event.request)
        .then(function(response){
            if(response){
                return response;
            }
            return fetch(event.request).then(
                function(response){
                    if(!response || response.status !== 200 || response.type !== 'basic'){
                        return response;
                    }
                    var responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                    .then(function(cache){
                        cache.put(event.request,responseToCache);
                    });

                    return response;
                }
            );
        })
    );
});

self.addEventListener('activate',function(event){
    // var cacheWhiteList = ['pages-cache-v1','blog-post-cache-v1'];
    var cacheWhiteList = CACHE_NAME;

    event.waitUntil(
        caches.keys().then(function(cacheNames){
            return Promise.all(
                cacheNames.map(function(cacheName){
                    if(cacheWhiteList.indexOf(cacheName)===-1){
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});