if (!self.define) {
  let e,
    a = {}
  const i = (i, s) => (
    (i = new URL(i + ".js", s).href),
    a[i] ||
      new Promise((a) => {
        if ("document" in self) {
          const e = document.createElement("script")
          ;(e.src = i), (e.onload = a), document.head.appendChild(e)
        } else (e = i), importScripts(i), a()
      }).then(() => {
        let e = a[i]
        if (!e) throw new Error(`Module ${i} didn’t register its module`)
        return e
      })
  )
  self.define = (s, n) => {
    const c =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href
    if (a[c]) return
    let r = {}
    const t = (e) => i(e, c),
      g = { module: { uri: c }, exports: r, require: t }
    a[c] = Promise.all(s.map((e) => g[e] || t(e))).then((e) => (n(...e), r))
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
          revision: "a4d0094feb594ac1b3d57d33f64d9e36",
        },
        {
          url: "/_next/static/9zYgi8ZXVYD_gcAOLher9/_buildManifest.js",
          revision: "172e769da91baa11de9b258fb2d92f86",
        },
        {
          url: "/_next/static/9zYgi8ZXVYD_gcAOLher9/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        {
          url: "/_next/static/chunks/0e5ce63c-28e4e30573fe9396.js",
          revision: "9zYgi8ZXVYD_gcAOLher9",
        },
        {
          url: "/_next/static/chunks/117-fd595ded79189c36.js",
          revision: "9zYgi8ZXVYD_gcAOLher9",
        },
        {
          url: "/_next/static/chunks/137-d933acea554cf76f.js",
          revision: "9zYgi8ZXVYD_gcAOLher9",
        },
        {
          url: "/_next/static/chunks/145-afa869b7c53ce52c.js",
          revision: "9zYgi8ZXVYD_gcAOLher9",
        },
        {
          url: "/_next/static/chunks/226-e6d9584f1d46ea82.js",
          revision: "9zYgi8ZXVYD_gcAOLher9",
        },
        {
          url: "/_next/static/chunks/237.9bbe1c2225320c40.js",
          revision: "9bbe1c2225320c40",
        },
        {
          url: "/_next/static/chunks/307-e53b3c670ddfd2e8.js",
          revision: "9zYgi8ZXVYD_gcAOLher9",
        },
        {
          url: "/_next/static/chunks/33-5435a39822a89adb.js",
          revision: "9zYgi8ZXVYD_gcAOLher9",
        },
        {
          url: "/_next/static/chunks/405-6216afaf2e38a74a.js",
          revision: "9zYgi8ZXVYD_gcAOLher9",
        },
        {
          url: "/_next/static/chunks/506-021a49c42aff7f7e.js",
          revision: "9zYgi8ZXVYD_gcAOLher9",
        },
        {
          url: "/_next/static/chunks/56-32294109a2224767.js",
          revision: "9zYgi8ZXVYD_gcAOLher9",
        },
        {
          url: "/_next/static/chunks/609-51292bbd9457145a.js",
          revision: "9zYgi8ZXVYD_gcAOLher9",
        },
        {
          url: "/_next/static/chunks/64-159e36c2f3ae1a8b.js",
          revision: "9zYgi8ZXVYD_gcAOLher9",
        },
        {
          url: "/_next/static/chunks/648-d498b762ce3a8eeb.js",
          revision: "9zYgi8ZXVYD_gcAOLher9",
        },
        {
          url: "/_next/static/chunks/884-6cc4c2d667e97180.js",
          revision: "9zYgi8ZXVYD_gcAOLher9",
        },
        {
          url: "/_next/static/chunks/952-2c2abe8c168631c9.js",
          revision: "9zYgi8ZXVYD_gcAOLher9",
        },
        {
          url: "/_next/static/chunks/995-85a98c320c628099.js",
          revision: "9zYgi8ZXVYD_gcAOLher9",
        },
        {
          url: "/_next/static/chunks/app/(pages)/auth/page-255b4e0caba54bae.js",
          revision: "9zYgi8ZXVYD_gcAOLher9",
        },
        {
          url: "/_next/static/chunks/app/(pages)/website/hunt/page-4302e9f1a1a8a111.js",
          revision: "9zYgi8ZXVYD_gcAOLher9",
        },
        {
          url: "/_next/static/chunks/app/(pages)/website/layout-d0c53d65b077d931.js",
          revision: "9zYgi8ZXVYD_gcAOLher9",
        },
        {
          url: "/_next/static/chunks/app/(pages)/website/page-87d3abf863b881e0.js",
          revision: "9zYgi8ZXVYD_gcAOLher9",
        },
        {
          url: "/_next/static/chunks/app/(pages)/website/raids/page-006362e2a48e9a2c.js",
          revision: "9zYgi8ZXVYD_gcAOLher9",
        },
        {
          url: "/_next/static/chunks/app/(pages)/website/team/page-bde7f9c76c24fd54.js",
          revision: "9zYgi8ZXVYD_gcAOLher9",
        },
        {
          url: "/_next/static/chunks/app/(pwa)/layout-b768c986383def90.js",
          revision: "9zYgi8ZXVYD_gcAOLher9",
        },
        {
          url: "/_next/static/chunks/app/(pwa)/page-76be2fe38375cefd.js",
          revision: "9zYgi8ZXVYD_gcAOLher9",
        },
        {
          url: "/_next/static/chunks/app/_not-found/page-887a6b78f334643d.js",
          revision: "9zYgi8ZXVYD_gcAOLher9",
        },
        {
          url: "/_next/static/chunks/app/layout-39171107e1de7278.js",
          revision: "9zYgi8ZXVYD_gcAOLher9",
        },
        {
          url: "/_next/static/chunks/app/not-found-3dc48222fbcc814a.js",
          revision: "9zYgi8ZXVYD_gcAOLher9",
        },
        {
          url: "/_next/static/chunks/e37a0b60-5bdbaf635e24431c.js",
          revision: "9zYgi8ZXVYD_gcAOLher9",
        },
        {
          url: "/_next/static/chunks/fd9d1056-b19a8acabfc12584.js",
          revision: "9zYgi8ZXVYD_gcAOLher9",
        },
        {
          url: "/_next/static/chunks/framework-00a8ba1a63cfdc9e.js",
          revision: "9zYgi8ZXVYD_gcAOLher9",
        },
        {
          url: "/_next/static/chunks/main-app-a782fb1548bbffd5.js",
          revision: "9zYgi8ZXVYD_gcAOLher9",
        },
        {
          url: "/_next/static/chunks/main-dbbb7333a03b6c46.js",
          revision: "9zYgi8ZXVYD_gcAOLher9",
        },
        {
          url: "/_next/static/chunks/pages/_app-15e2daefa259f0b5.js",
          revision: "9zYgi8ZXVYD_gcAOLher9",
        },
        {
          url: "/_next/static/chunks/pages/_error-28b803cb2479b966.js",
          revision: "9zYgi8ZXVYD_gcAOLher9",
        },
        {
          url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
          revision: "846118c33b2c0e922d7b3a7676f81f6f",
        },
        {
          url: "/_next/static/chunks/webpack-90a9957489b193ac.js",
          revision: "9zYgi8ZXVYD_gcAOLher9",
        },
        {
          url: "/_next/static/css/b0d2eee97ba6f2c5.css",
          revision: "b0d2eee97ba6f2c5",
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
          revision: "6d503ea3b83dad6b4e018ef4c961b4df",
        },
        {
          url: "/icons/favicon-96x96.png",
          revision: "350f1c05ad55f2b46893853ae4bdbc3e",
        },
        {
          url: "/icons/icon-128x128.png",
          revision: "4ebddb657142780967289989424ad1ae",
        },
        {
          url: "/icons/icon-144x144.png",
          revision: "57bb0bc3c4b48e00917a18410c787133",
        },
        {
          url: "/icons/icon-152x152.png",
          revision: "938224d5116f6b9a912f01bc1a999f04",
        },
        {
          url: "/icons/icon-192x192.png",
          revision: "9f18d5aab51f884e3fa9333951c31ab4",
        },
        {
          url: "/icons/icon-256x256.png",
          revision: "99775a70ef98d7da1439617c6bdb711f",
        },
        {
          url: "/icons/icon-384x384.png",
          revision: "4ede3d4310a0586a9868abea39d19d84",
        },
        {
          url: "/icons/icon-48x48.png",
          revision: "387bcee8f6756c7c0ec5555c4682c779",
        },
        {
          url: "/icons/icon-512x512.png",
          revision: "1a6ab84152a9cd8e1541da3d2c89fc2a",
        },
        {
          url: "/icons/icon-72x72.png",
          revision: "d702d7e218de5c6df2f65f6c2f966eff",
        },
        {
          url: "/icons/icon-96x96.png",
          revision: "a75c934558d36b52d2f5c60fc283513c",
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
          url: "/images/alien/elements/fire-bg.png",
          revision: "dac6a5a65078ba555e5ecbf98014c699",
        },
        {
          url: "/images/alien/elements/fire.png",
          revision: "36c8cd447c12c6c3afe61216319d1bd2",
        },
        {
          url: "/images/alien/elements/gamma-bg.png",
          revision: "4d961a39ef44f928c09f2ed8779a5d2a",
        },
        {
          url: "/images/alien/elements/gamma.png",
          revision: "c74ac5f572f187fc0c48a4eac78be0b4",
        },
        {
          url: "/images/alien/elements/gravity-bg.png",
          revision: "ae6bed2515a01f29314a2585ef05a151",
        },
        {
          url: "/images/alien/elements/gravity.png",
          revision: "8c6c82bd0020d3843269b9a9a40f7703",
        },
        {
          url: "/images/alien/elements/life-bg.png",
          revision: "8536caebbd65d0968099c2044c207a11",
        },
        {
          url: "/images/alien/elements/life.png",
          revision: "86ded719a40b8432cb7bda79315a8445",
        },
        {
          url: "/images/alien/elements/love-bg.png",
          revision: "85edd1b1489924ab5fe675c3c061de27",
        },
        {
          url: "/images/alien/elements/love.png",
          revision: "e4a7aab851ba8aad3f0773171200e2e0",
        },
        {
          url: "/images/alien/elements/plasma-bg.png",
          revision: "f6f8efb4947c811559045ae8aa0b86aa",
        },
        {
          url: "/images/alien/elements/plasma.png",
          revision: "5cb297b3b58094abe4dfc3c38c834a9a",
        },
        {
          url: "/images/alien/elements/thunder-bg.png",
          revision: "c7733c699d53dd6f5fe429df42fe9d5a",
        },
        {
          url: "/images/alien/elements/thunder.png",
          revision: "4f5a8dc6a705012a3921633505c10149",
        },
        {
          url: "/images/alien/elements/water-bg.png",
          revision: "56386284be2abcc76437db037c53bc8d",
        },
        {
          url: "/images/alien/elements/water.png",
          revision: "d7456fe82101f609bc9b690543b52146",
        },
        {
          url: "/images/alien/face/persona1.png",
          revision: "293a9d4d905b7896b1a13eb9a52d11d5",
        },
        {
          url: "/images/alien/face/persona2.png",
          revision: "68b8ff599d02a931b7d85af147f76cf9",
        },
        {
          url: "/images/alien/face/persona3.png",
          revision: "20a11c432352c746eb3779e65aa894d9",
        },
        {
          url: "/images/alien/face/persona4.png",
          revision: "5e2aafe79cd4ad1de48ccc11685d8415",
        },
        {
          url: "/images/alien/face/persona5.png",
          revision: "a804a5b98e2a60404e360a590cb58d39",
        },
        {
          url: "/images/alien/face/persona6.png",
          revision: "64e42c8c56ff2814a34003f97ed54f29",
        },
        {
          url: "/images/alien/face/persona7.png",
          revision: "2b07e85206d31682a865ae330c52c016",
        },
        {
          url: "/images/alien/face/persona8.png",
          revision: "1c278527f26c11e09807ba85dd5aa32c",
        },
        {
          url: "/images/alien/hair/bocchangari.png",
          revision: "8616102d067f6106aa11f1fe5334ca5c",
        },
        {
          url: "/images/alien/hair/bouken.png",
          revision: "4723e9dc09768ccab914ff5a8365cf7a",
        },
        {
          url: "/images/alien/hair/kusege.png",
          revision: "af7a75997a20ccda06f78a55b3c19d29",
        },
        {
          url: "/images/alien/hair/mijikai.png",
          revision: "84c032214dc73be6e46d6b176e5a4d8f",
        },
        {
          url: "/images/alien/hair/poniteru.png",
          revision: "ec605c6a1f4ca6713500d3e98419ea67",
        },
        {
          url: "/images/alien/hair/raito.png",
          revision: "9aee492a11e73aa19bacf583947afb22",
        },
        {
          url: "/images/alien/hair/rokusu.png",
          revision: "87237a35616e11f463c8664a038c48fd",
        },
        {
          url: "/images/alien/hair/tepa.png",
          revision: "7fab73cb49fb5d6dfe71e012729195c4",
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
          url: "/images/logo.svg",
          revision: "3197583e6ca3f43d378d8f02fadffbdb",
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
          url: "/images/user.png",
          revision: "64f7148043d45b10bbeef5c38278bee5",
        },
        { url: "/images/xp.png", revision: "d6a47a450d539d9a4a22a12d31ee8570" },
        { url: "/manifest.json", revision: "3336832cebf8045203746c073c585974" },
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
              response: a,
              event: i,
              state: s,
            }) =>
              a && "opaqueredirect" === a.type
                ? new Response(a.body, {
                    status: 200,
                    statusText: "OK",
                    headers: a.headers,
                  })
                : a,
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
        const a = e.pathname
        return !a.startsWith("/api/auth/") && !!a.startsWith("/api/")
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
