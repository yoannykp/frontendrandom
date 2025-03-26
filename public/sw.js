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
  self.define = (s, c) => {
    const n =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href
    if (a[n]) return
    let r = {}
    const t = (e) => i(e, n),
      d = { module: { uri: n }, exports: r, require: t }
    a[n] = Promise.all(s.map((e) => d[e] || t(e))).then((e) => (c(...e), r))
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
          revision: "d00cbe2e25556567d27ce8ae5ec9788e",
        },
        {
          url: "/_next/static/Np381Q0y00KvZ8cakLXiJ/_buildManifest.js",
          revision: "6310079bf1ae7bebeb6a2135896e4564",
        },
        {
          url: "/_next/static/Np381Q0y00KvZ8cakLXiJ/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        {
          url: "/_next/static/chunks/0e5ce63c-ef72d0858f179dd6.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/1091-4cba3a43d4baae7a.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/13b76428-e1bf383848c17260.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/1735.b6cec72d272dc07e.js",
          revision: "b6cec72d272dc07e",
        },
        {
          url: "/_next/static/chunks/2116-9950e412c0a52fce.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/2117-13e91ea47f6e538f.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/2519-e9643922f9ccaba7.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/3145-c1ec96eca4981d8b.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/3157-f47510dfb5ab5b8e.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/3376-486440f3c696305a.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/3404-3d929fb8465d530c.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/3467-7c64844a17c3f692.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/3654-c45ab34c35e62cf7.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/3825-addc2039fdb6053e.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/4208-14b8cc219b1f627c.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/4978.f19de5daea982214.js",
          revision: "f19de5daea982214",
        },
        {
          url: "/_next/static/chunks/53c13509-19870a1e36b301ad.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/5903-cdf7ef7ed2b770e3.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/6275.f5bc990c149abf8a.js",
          revision: "f5bc990c149abf8a",
        },
        {
          url: "/_next/static/chunks/7086-c5e7bb5f11e616e4.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/7391-5c20474699a1bd04.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/7610-f09f511544497bfc.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/7648-c307a2ff52a8050b.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/7859-c239941dd0510d1b.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/7952-d6363b281b0a9630.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/8306-9bbf259ab147c190.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/8450-d5f94159bb647f28.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/8488.dc5f8f77bb493a48.js",
          revision: "dc5f8f77bb493a48",
        },
        {
          url: "/_next/static/chunks/9044-7b0f5d00ad6963a6.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/9313-d72bbd3bba9e869e.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/9686-b885c6a4b86c710b.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/app/(pages)/(web)/draw/page-b1c846b5b8f9e528.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/app/(pages)/(web)/inventory/page-116c72d8c36ff4ce.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/app/(pages)/(web)/layout-32f5f5ff9cdd27a0.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/app/(pages)/(web)/leaderboard/page-77b7c5061a677ae8.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/app/(pages)/(web)/raids/page-e2027fc8b006884f.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/app/(pages)/(web)/team/page-c79bbe04273f514b.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/app/(pages)/(web)/treasure/page-b626704114dbd833.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/app/(pages)/auth/page-e4befbef711f8c03.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/app/(pages)/dojo/page-adf41bef94a1f687.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/app/(pages)/forge/page-9db2236040dbbddf.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/app/(pages)/friends/page-6975f0c4c5c376d9.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/app/(pages)/profile/page-055897e7c18ea1a0.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/app/(pages)/purchase/page-4516a5c42aa9327c.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/app/(pages)/wheel/page-ded43af0191c1404.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/app/(pwa)/layout-e65c602acc17bb37.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/app/(pwa)/page-aba2417c8ea654a4.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/app/_not-found/page-f7931a9da2ac4330.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/app/layout-05d5986e2a0523c3.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/app/not-found-78865d167b4ee46c.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/c16f53c3-6981fdfabbf6d4c5.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/fd9d1056-89b8f38588a4b2ad.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/framework-8e0e0f4a6b83a956.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/main-820d92e96f110765.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/main-app-da36af68fdc0d768.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/pages/_app-3c9ca398d360b709.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/pages/_error-cf5ca766ac8f493f.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
          revision: "846118c33b2c0e922d7b3a7676f81f6f",
        },
        {
          url: "/_next/static/chunks/webpack-5cccf0456d410c50.js",
          revision: "Np381Q0y00KvZ8cakLXiJ",
        },
        {
          url: "/_next/static/css/0b569eba0d4b2dad.css",
          revision: "0b569eba0d4b2dad",
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
          url: "/_next/static/media/frame.d371c867.png",
          revision: "4e2feef41dcc27375e5cd98ec9ce99da",
        },
        {
          url: "/icons/apple-touch-icon.png",
          revision: "03cca17cc8c76384908de5dd88e3424b",
        },
        {
          url: "/icons/favicon-96x96.png",
          revision: "af55c4b075ba4d50c2b0be2781bca910",
        },
        {
          url: "/icons/icon-128x128.png",
          revision: "d1ffaa7a81fabf455ad3ac2c9d4ea01a",
        },
        {
          url: "/icons/icon-144x144.png",
          revision: "5176b23d6baf88e305c8e80c558504c1",
        },
        {
          url: "/icons/icon-152x152.png",
          revision: "7ceefb25cfd6f8a0c0cc692691573c25",
        },
        {
          url: "/icons/icon-192x192.png",
          revision: "b432765b7e143165cc6b4bcd95af4c8b",
        },
        {
          url: "/icons/icon-256x256.png",
          revision: "6f63fff9ee13b7034ffc9977e789918c",
        },
        {
          url: "/icons/icon-384x384.png",
          revision: "78188eaf3002e490c1b8e22abf352c4c",
        },
        {
          url: "/icons/icon-48x48.png",
          revision: "e1f0d89a8fa2d7eb66e72c1247a7b958",
        },
        {
          url: "/icons/icon-512x512.png",
          revision: "0cba0a6cbf17afa20a4733fc57c236ab",
        },
        {
          url: "/icons/icon-72x72.png",
          revision: "8200d96dfc0bf1228a0a2e2f73f3991b",
        },
        {
          url: "/icons/icon-96x96.png",
          revision: "af55c4b075ba4d50c2b0be2781bca910",
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
          url: "/images/badge.png",
          revision: "71955f60d216810d2e34f643bf1d145b",
        },
        {
          url: "/images/carousel/slide-1.jpg",
          revision: "2268ce101eff5865e1d13fd08e3ddc94",
        },
        {
          url: "/images/cat.jpeg",
          revision: "0b02fafadfc2b5b3608d5891af10d2ec",
        },
        {
          url: "/images/character-img.png",
          revision: "e67360c09bfe1e58c17442334a4e2f6c",
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
          url: "/images/girl.jpeg",
          revision: "2dd4e83dfb54e6a3e1da6a562d6af84a",
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
          url: "/images/logos/eth.png",
          revision: "72eb49c0b6a4f313b14059c1f6ecd9f5",
        },
        {
          url: "/images/modal-bg.jpeg",
          revision: "007476ff0db7d9f750ce0c3172bb8dba",
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
          url: "/images/pages/dojo/accessories.png",
          revision: "49d503212d800aa92965b213b015baee",
        },
        {
          url: "/images/pages/dojo/background.png",
          revision: "c5444b60a796eae892056bb46a1986a1",
        },
        {
          url: "/images/pages/dojo/body.png",
          revision: "0e0129807a8d2dd78276d8c208d925c1",
        },
        {
          url: "/images/pages/dojo/eyes.png",
          revision: "e11a584fd571a7680d1e7bb6da138d19",
        },
        {
          url: "/images/pages/dojo/hairs.png",
          revision: "fe055ca1cd66e0fe7657996aa741bb66",
        },
        {
          url: "/images/pages/dojo/marks.png",
          revision: "9e1c67f3e5a5b4af96db1fc461a89a30",
        },
        {
          url: "/images/pages/dojo/mouth.png",
          revision: "560243054842435001cd99416aa3610c",
        },
        {
          url: "/images/pages/dojo/power.png",
          revision: "f0b953f658308201fb12d8372a6fab0d",
        },
        {
          url: "/images/pages/draw-bg-1.png",
          revision: "609bd87ea06ab25ae1ecc9cbb2a7621a",
        },
        {
          url: "/images/pages/draw-bg-2.png",
          revision: "a084d87d2d57cbb9fefae461d3bfc311",
        },
        {
          url: "/images/pages/draw.png",
          revision: "2a11bb4a3249328602180289019bab8c",
        },
        {
          url: "/images/pages/forge.jpeg",
          revision: "4857ddc3a61dca24fc2460bdbf79e54e",
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
          url: "/images/rank-1.png",
          revision: "9a13fe1e73f9b7f57ace67eed2708f65",
        },
        {
          url: "/images/rank-2.png",
          revision: "d7cfb4d270014726206eed3e510268d1",
        },
        {
          url: "/images/rank-3.png",
          revision: "71849baba03d3b14bd32311d2c48f5e7",
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
        {
          url: "/images/wheel/fire.png",
          revision: "c3fc8e68e2fc48ba0e9841dbb7b2bddb",
        },
        {
          url: "/images/wheel/frame.png",
          revision: "4e2feef41dcc27375e5cd98ec9ce99da",
        },
        {
          url: "/images/wheel/pointer.png",
          revision: "75befbb37f3b0919809f904eb6428aaf",
        },
        {
          url: "/images/wheel/wheel-bg.png",
          revision: "378e2edd69b0474b1826c684b11feb17",
        },
        {
          url: "/images/wheel/wheel.png",
          revision: "94829b7b23d5eccbbdcff52d7beb32fc",
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
