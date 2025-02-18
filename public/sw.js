if (!self.define) {
  let e,
    s = {}
  const a = (a, i) => (
    (a = new URL(a + ".js", i).href),
    s[a] ||
      new Promise((s) => {
        if ("document" in self) {
          const e = document.createElement("script")
          ;(e.src = a), (e.onload = s), document.head.appendChild(e)
        } else (e = a), importScripts(a), s()
      }).then(() => {
        let e = s[a]
        if (!e) throw new Error(`Module ${a} didn’t register its module`)
        return e
      })
  )
  self.define = (i, c) => {
    const n =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href
    if (s[n]) return
    let d = {}
    const r = (e) => a(e, n),
      t = { module: { uri: n }, exports: d, require: r }
    s[n] = Promise.all(i.map((e) => t[e] || r(e))).then((e) => (c(...e), d))
  }
}
define(["./workbox-1bb06f5e"], function (e) {
  "use strict"
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: "/_next/app-build-manifest.json",
          revision: "e7d909355a8041f606b0b0705d1f9cd1",
        },
        {
          url: "/_next/static/cXcdiHTn8QgzdK0W0NNV-/_buildManifest.js",
          revision: "172e769da91baa11de9b258fb2d92f86",
        },
        {
          url: "/_next/static/cXcdiHTn8QgzdK0W0NNV-/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        {
          url: "/_next/static/chunks/0e5ce63c-ba908e60fa75493d.js",
          revision: "cXcdiHTn8QgzdK0W0NNV-",
        },
        {
          url: "/_next/static/chunks/117-885630d6aa605918.js",
          revision: "cXcdiHTn8QgzdK0W0NNV-",
        },
        {
          url: "/_next/static/chunks/12-c4c91dfb89962261.js",
          revision: "cXcdiHTn8QgzdK0W0NNV-",
        },
        {
          url: "/_next/static/chunks/145-e80c88072fa0a115.js",
          revision: "cXcdiHTn8QgzdK0W0NNV-",
        },
        {
          url: "/_next/static/chunks/148-23f7de661c2e26f6.js",
          revision: "cXcdiHTn8QgzdK0W0NNV-",
        },
        {
          url: "/_next/static/chunks/157-ce5798a63690a029.js",
          revision: "cXcdiHTn8QgzdK0W0NNV-",
        },
        {
          url: "/_next/static/chunks/175-f3346b9d32315e46.js",
          revision: "cXcdiHTn8QgzdK0W0NNV-",
        },
        {
          url: "/_next/static/chunks/275.f7d888ce2d9ab1ea.js",
          revision: "f7d888ce2d9ab1ea",
        },
        {
          url: "/_next/static/chunks/276-1ff1dcb266294667.js",
          revision: "cXcdiHTn8QgzdK0W0NNV-",
        },
        {
          url: "/_next/static/chunks/32-597ff9621e3bdba3.js",
          revision: "cXcdiHTn8QgzdK0W0NNV-",
        },
        {
          url: "/_next/static/chunks/357-50740578b79fe2ce.js",
          revision: "cXcdiHTn8QgzdK0W0NNV-",
        },
        {
          url: "/_next/static/chunks/488.6538d1c8774add49.js",
          revision: "6538d1c8774add49",
        },
        {
          url: "/_next/static/chunks/506-73fef65bdcd42cf6.js",
          revision: "cXcdiHTn8QgzdK0W0NNV-",
        },
        {
          url: "/_next/static/chunks/538-8a0c062c5f1203a0.js",
          revision: "cXcdiHTn8QgzdK0W0NNV-",
        },
        {
          url: "/_next/static/chunks/56-353f121824ce2228.js",
          revision: "cXcdiHTn8QgzdK0W0NNV-",
        },
        {
          url: "/_next/static/chunks/567-958c2ac7018aa3df.js",
          revision: "cXcdiHTn8QgzdK0W0NNV-",
        },
        {
          url: "/_next/static/chunks/598-4be753ef0beec535.js",
          revision: "cXcdiHTn8QgzdK0W0NNV-",
        },
        {
          url: "/_next/static/chunks/648-b822529d4fa336f8.js",
          revision: "cXcdiHTn8QgzdK0W0NNV-",
        },
        {
          url: "/_next/static/chunks/695-ecfb2ae526681871.js",
          revision: "cXcdiHTn8QgzdK0W0NNV-",
        },
        {
          url: "/_next/static/chunks/781-a7c2008d71ffb834.js",
          revision: "cXcdiHTn8QgzdK0W0NNV-",
        },
        {
          url: "/_next/static/chunks/823-26ca71d2db53634e.js",
          revision: "cXcdiHTn8QgzdK0W0NNV-",
        },
        {
          url: "/_next/static/chunks/844.17d09a631aa49dc3.js",
          revision: "17d09a631aa49dc3",
        },
        {
          url: "/_next/static/chunks/884-740f385de5e5dd95.js",
          revision: "cXcdiHTn8QgzdK0W0NNV-",
        },
        {
          url: "/_next/static/chunks/952-0bd619b9d4232456.js",
          revision: "cXcdiHTn8QgzdK0W0NNV-",
        },
        {
          url: "/_next/static/chunks/978.d36d580f6c38aa64.js",
          revision: "d36d580f6c38aa64",
        },
        {
          url: "/_next/static/chunks/app/(pages)/auth/page-e170ba98075a5181.js",
          revision: "cXcdiHTn8QgzdK0W0NNV-",
        },
        {
          url: "/_next/static/chunks/app/(pages)/purchase/page-fbecc1976f702e97.js",
          revision: "cXcdiHTn8QgzdK0W0NNV-",
        },
        {
          url: "/_next/static/chunks/app/(pages)/treasure/layout-e142680457953326.js",
          revision: "cXcdiHTn8QgzdK0W0NNV-",
        },
        {
          url: "/_next/static/chunks/app/(pages)/treasure/page-056dbdaf6b8f0ab1.js",
          revision: "cXcdiHTn8QgzdK0W0NNV-",
        },
        {
          url: "/_next/static/chunks/app/(pages)/website/hunt/page-19e4a480cd2d4f93.js",
          revision: "cXcdiHTn8QgzdK0W0NNV-",
        },
        {
          url: "/_next/static/chunks/app/(pages)/website/layout-2f5b7b2972054bb9.js",
          revision: "cXcdiHTn8QgzdK0W0NNV-",
        },
        {
          url: "/_next/static/chunks/app/(pages)/website/page-d78f6026f63401e0.js",
          revision: "cXcdiHTn8QgzdK0W0NNV-",
        },
        {
          url: "/_next/static/chunks/app/(pages)/website/raids/page-8f4da2670c688183.js",
          revision: "cXcdiHTn8QgzdK0W0NNV-",
        },
        {
          url: "/_next/static/chunks/app/(pages)/website/team/page-ef4cd8161c46c780.js",
          revision: "cXcdiHTn8QgzdK0W0NNV-",
        },
        {
          url: "/_next/static/chunks/app/(pwa)/layout-5f28cc3f6634ebe1.js",
          revision: "cXcdiHTn8QgzdK0W0NNV-",
        },
        {
          url: "/_next/static/chunks/app/(pwa)/page-a8f7dcac6058d9d5.js",
          revision: "cXcdiHTn8QgzdK0W0NNV-",
        },
        {
          url: "/_next/static/chunks/app/_not-found/page-887a6b78f334643d.js",
          revision: "cXcdiHTn8QgzdK0W0NNV-",
        },
        {
          url: "/_next/static/chunks/app/layout-458caf7012eef6b4.js",
          revision: "cXcdiHTn8QgzdK0W0NNV-",
        },
        {
          url: "/_next/static/chunks/app/not-found-e37b273eca2faa4c.js",
          revision: "cXcdiHTn8QgzdK0W0NNV-",
        },
        {
          url: "/_next/static/chunks/c16f53c3-8ba8ddb0f19a5b6d.js",
          revision: "cXcdiHTn8QgzdK0W0NNV-",
        },
        {
          url: "/_next/static/chunks/fd9d1056-7efa2690de02be3f.js",
          revision: "cXcdiHTn8QgzdK0W0NNV-",
        },
        {
          url: "/_next/static/chunks/framework-00a8ba1a63cfdc9e.js",
          revision: "cXcdiHTn8QgzdK0W0NNV-",
        },
        {
          url: "/_next/static/chunks/main-3aa39b3e8202c014.js",
          revision: "cXcdiHTn8QgzdK0W0NNV-",
        },
        {
          url: "/_next/static/chunks/main-app-a782fb1548bbffd5.js",
          revision: "cXcdiHTn8QgzdK0W0NNV-",
        },
        {
          url: "/_next/static/chunks/pages/_app-15e2daefa259f0b5.js",
          revision: "cXcdiHTn8QgzdK0W0NNV-",
        },
        {
          url: "/_next/static/chunks/pages/_error-28b803cb2479b966.js",
          revision: "cXcdiHTn8QgzdK0W0NNV-",
        },
        {
          url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
          revision: "846118c33b2c0e922d7b3a7676f81f6f",
        },
        {
          url: "/_next/static/chunks/webpack-edc8f3d72ada855e.js",
          revision: "cXcdiHTn8QgzdK0W0NNV-",
        },
        {
          url: "/_next/static/css/b13b4e2fa42953fc.css",
          revision: "b13b4e2fa42953fc",
        },
        {
          url: "/_next/static/media/26a46d62cd723877-s.woff2",
          revision: "befd9c0fdfa3d8a645d5f95717ed6420",
        },
        {
          url: "/_next/static/media/55c55f0601d81cf3-s.woff2",
          revision: "43828e14271c77b87e3ed582dbff9f74",
        },
        {
          url: "/_next/static/media/581909926a08bbc8-s.woff2",
          revision: "f0b86e7c24f455280b8df606b89af891",
        },
        {
          url: "/_next/static/media/6d93bde91c0c2823-s.woff2",
          revision: "621a07228c8ccbfd647918f1021b4868",
        },
        {
          url: "/_next/static/media/79b9e062b39a8bab-s.p.woff2",
          revision: "519c222206ccffae2860f2d83283df89",
        },
        {
          url: "/_next/static/media/97e0cb1ae144a2a9-s.woff2",
          revision: "e360c61c5bd8d90639fd4503c829c2dc",
        },
        {
          url: "/_next/static/media/a34f9d1faa5f3315-s.p.woff2",
          revision: "d4fe31e6a2aebc06b8d6e558c9141119",
        },
        {
          url: "/_next/static/media/df0a9ae256c0569c-s.woff2",
          revision: "d54db44de5ccb18886ece2fda72bdfe0",
        },
        {
          url: "/_next/static/media/f4d88d1e9def2b83-s.p.woff2",
          revision: "dd2afafc1e862a72ef12f838a3a32ebe",
        },
        {
          url: "/icons/apple-touch-icon.png",
          revision: "8092d2d91664782b88a6265dc54bc9d2",
        },
        {
          url: "/icons/favicon-96x96.png",
          revision: "b7f0e165d7daf75e9a03e5d8c8593d61",
        },
        {
          url: "/icons/icon-128x128.png",
          revision: "608eb5d4d17032b148e94a6854cb9ef6",
        },
        {
          url: "/icons/icon-144x144.png",
          revision: "db809beed511b09b3f82393c94948f57",
        },
        {
          url: "/icons/icon-152x152.png",
          revision: "db316754947fa07337f67e75fbb2c58b",
        },
        {
          url: "/icons/icon-192x192.png",
          revision: "04cc5691d1cd63d59a3a03b03480796f",
        },
        {
          url: "/icons/icon-256x256.png",
          revision: "6e28442d9cde05920883d2b2a8cbbb8c",
        },
        {
          url: "/icons/icon-384x384.png",
          revision: "f301b8ba30cf2fdc310fb9993fa53a4a",
        },
        {
          url: "/icons/icon-48x48.png",
          revision: "d4a5fbf4e3ff6d1efb1aa2d0dc67acf3",
        },
        {
          url: "/icons/icon-512x512.png",
          revision: "e64c0fd84d25d054f710effccba98ab3",
        },
        {
          url: "/icons/icon-72x72.png",
          revision: "8dd4a1078aa5745446c3be079a103192",
        },
        {
          url: "/icons/icon-96x96.png",
          revision: "b7f0e165d7daf75e9a03e5d8c8593d61",
        },
        {
          url: "/images/404.jpeg",
          revision: "4857ddc3a61dca24fc2460bdbf79e54e",
        },
        {
          url: "/images/alien/body/body.png",
          revision: "f93a0fab2af0e4a664375934e81794db",
        },
        {
          url: "/images/alien/body/cothes.png",
          revision: "c099c9916284b79d1be0ceccfd49945c",
        },
        {
          url: "/images/alien/body/head.png",
          revision: "bf3f6d7b974fe4f8f84aa772f6555125",
        },
        {
          url: "/images/auth/bg.png",
          revision: "50acb14dc1f2413a81af6c16549773b8",
        },
        {
          url: "/images/auth/desktop-bg.mov",
          revision: "6658293be2d6f6f1969077b5367de879",
        },
        {
          url: "/images/auth/mobile-bg.jpeg",
          revision: "67e0576b9929ddc1942e343113feb93a",
        },
        {
          url: "/images/carousel/slide-1.jpg",
          revision: "2268ce101eff5865e1d13fd08e3ddc94",
        },
        {
          url: "/images/characters/character-1-avatar.png",
          revision: "1f87c324964c0d57f9f95249caff858a",
        },
        {
          url: "/images/characters/character-1-main.png",
          revision: "989cd9c4a71d0e61e0e7ba04e696dab8",
        },
        {
          url: "/images/characters/character-1-mobile.png",
          revision: "096897e02d52102f6c4ae15517619ffe",
        },
        {
          url: "/images/characters/character-1.png",
          revision: "bb64e98e36c171875ce2d410c5602aaa",
        },
        {
          url: "/images/characters/character-2.png",
          revision: "0f33c87c53fbd712871a4268e7f9b856",
        },
        {
          url: "/images/characters/character-3.png",
          revision: "0fad2ddfdce65644d62f6e003222d254",
        },
        {
          url: "/images/coin-zone.png",
          revision: "59c168445002f88d6e4356bc897344b8",
        },
        {
          url: "/images/elements/element-1.png",
          revision: "ceae0496e90d612f3a1360cb653017d5",
        },
        {
          url: "/images/elements/element-2.png",
          revision: "0761717826a2f20af0157951fa6f3bf7",
        },
        {
          url: "/images/elements/element-3.png",
          revision: "9a38ac6ad6ca8328e36efa6ea7149cc6",
        },
        {
          url: "/images/elements/element-4.png",
          revision: "7c6bf1d056c614b483aef9285cc53828",
        },
        {
          url: "/images/elements/element-5.png",
          revision: "b4de7c2756065a59032b3ed1b3665d5b",
        },
        {
          url: "/images/elements/element-6.png",
          revision: "ef11a22e95ea8b31e73fd733b505a817",
        },
        {
          url: "/images/elements/element-7.png",
          revision: "6787d54c135881a5944939a761a0848a",
        },
        {
          url: "/images/elements/element-8.png",
          revision: "1c082a0becc10c707769cda46504a032",
        },
        {
          url: "/images/image1.png",
          revision: "3868c0fa994a2cd272def6c317e85e1e",
        },
        {
          url: "/images/logo.png",
          revision: "9f5ced537086d477c23f3f19419d2096",
        },
        {
          url: "/images/logo.svg",
          revision: "3197583e6ca3f43d378d8f02fadffbdb",
        },
        {
          url: "/images/logos/arb-sepolia.png",
          revision: "ab1fa351e89e3285606250a1dc1e3867",
        },
        {
          url: "/images/logos/arb.png",
          revision: "1a223d405428d8a0254c5788d07b1eb7",
        },
        {
          url: "/images/pages/bg.jpg",
          revision: "bdfac37994c00333688fe2eed0fa7635",
        },
        {
          url: "/images/pages/dojo.png",
          revision: "d18fc1edd9fe513c43d7386996b730b9",
        },
        {
          url: "/images/pages/draw.png",
          revision: "2a11bb4a3249328602180289019bab8c",
        },
        {
          url: "/images/pages/journal.png",
          revision: "d9b7108bb732d9a8610b59d44364ddca",
        },
        {
          url: "/images/pages/raids-bg.jpg",
          revision: "80cf912315498c20a7aacbbe4adeb4f1",
        },
        {
          url: "/images/pages/raids.png",
          revision: "5e8a17286c8bd4326ff48f6ce754c55c",
        },
        {
          url: "/images/pages/store.png",
          revision: "c7452e17133a6a7c4a13adb72f664b3d",
        },
        {
          url: "/images/pages/team-bg.jpg",
          revision: "fdd151b41915c20fb05b52e4b4b639fc",
        },
        {
          url: "/images/pages/team.png",
          revision: "c4d1ce664d4a4dc1bbae33a9e147df25",
        },
        {
          url: "/images/pages/upgrade.png",
          revision: "6fc460386675f49345fa9b03f9046e23",
        },
        {
          url: "/images/pages/wheel.png",
          revision: "176a3b7034ac4d97f168575371dd4b13",
        },
        {
          url: "/images/raids/raid-1.jpg",
          revision: "02c51344e296fc97c2fea2037a7e22f1",
        },
        {
          url: "/images/raids/raid-1_icon.png",
          revision: "c74ac5f572f187fc0c48a4eac78be0b4",
        },
        {
          url: "/images/raids/raid-2.jpg",
          revision: "09d52176e198417bc2fe180bddd13876",
        },
        {
          url: "/images/raids/raid-2_icon.png",
          revision: "36c8cd447c12c6c3afe61216319d1bd2",
        },
        {
          url: "/images/raids/raid-3.jpg",
          revision: "3d9c12d5ada104665c2eb70de462c757",
        },
        {
          url: "/images/raids/raid-3_icon.png",
          revision: "86ded719a40b8432cb7bda79315a8445",
        },
        {
          url: "/images/raids/raid-4.jpg",
          revision: "8951f432f7e7c7870598d67514c900f8",
        },
        {
          url: "/images/rep.png",
          revision: "77a1b879f6289f61a1d727c6c954ecfe",
        },
        {
          url: "/images/stars.png",
          revision: "7c7a8b62be246934156c602dfca8f050",
        },
        {
          url: "/images/treasure/bag-of-star.png",
          revision: "95a85397387eb9826dd19fe024e6f34a",
        },
        {
          url: "/images/treasure/case-of-star.png",
          revision: "845b7dc6469813cd39da85bdd8c8d83a",
        },
        {
          url: "/images/treasure/pile-of-star.png",
          revision: "92915b0e35261362be1895f7f273014b",
        },
        {
          url: "/images/treasure/three-bags-of-star.png",
          revision: "0bda5300fd20d57e02884dfb809514b6",
        },
        {
          url: "/images/user.png",
          revision: "64f7148043d45b10bbeef5c38278bee5",
        },
        { url: "/images/xp.png", revision: "d6a47a450d539d9a4a22a12d31ee8570" },
        { url: "/manifest.json", revision: "99f762f76ecccaa406bc276d7de4d16a" },
        { url: "/music.mp3", revision: "e2c8e721c240ccbc5b9be3c60c8b5572" },
      ],
      { ignoreURLParametersMatching: [] }
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      "/",
      new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: async ({
              request: e,
              response: s,
              event: a,
              state: i,
            }) =>
              s && "opaqueredirect" === s.type
                ? new Response(s.body, {
                    status: 200,
                    statusText: "OK",
                    headers: s.headers,
                  })
                : s,
          },
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-image",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: "static-audio-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: "static-video-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-data",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1
        const s = e.pathname
        return !s.startsWith("/api/auth/") && !!s.startsWith("/api/")
      },
      new e.NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1
        return !e.pathname.startsWith("/api/")
      },
      new e.NetworkFirst({
        cacheName: "others",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: "cross-origin",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      "GET"
    )
})
