# Home Media Portal / Ev Medya Portali

A dual-deploy Next.js dashboard for a self-hosted media stack. It provides a polished single-universe UX with embedded services (focus mode), system health, and a small family message board.

Caddy + Tailscale keeps services on the same origin so Jellyfin/Radarr/Sonarr etc. can render safely inside iframes.

---

## English

### What this is
A sleek, animated home media portal that lives in two modes:

- **Public shell (Vercel):** shows the UI in a locked state, checks tailnet reachability, and offers a CTA to open the home portal.
- **Home portal (Tailscale + Caddy):** full access, embedded dashboards, system stats, and a local SQLite message board.

### Features
- Single-universe focus mode (services open in an iframe overlay, not a new page)
- Service health and latency checks
- System stats (CPU, RAM, disk, uptime, optional temperature)
- Family message board (SQLite, rate-limited)
- Tailnet reachability gate + public preview lock
- Light/dark themes + TR/EN/IT UI strings
- Responsive layout with animated entrances

### Requirements
- Node.js 20+ and npm
- A Linux home server (recommended) with systemd
- Tailscale installed on the server and client devices
- Reverse proxy with HTTPS (Caddy or Nginx)
- Media services running locally (e.g., Jellyfin, Radarr, Sonarr, Prowlarr, Bazarr)

Note: A separate installer repo will later automate Tailscale/Caddy/systemd for a one-command setup. Until then, this README keeps minimal notes and examples.

### Environment variables
Create a `.env.local` file: 
```dotenv
# public | home
NEXT_PUBLIC_DEPLOY_TARGET=home

# Tailnet home portal URL (used for reachability and links)
NEXT_PUBLIC_HOME_URL=https://home.tailnet.ts.net

# Optional override for the local SQLite database path
BOARD_DB_PATH=/var/lib/home-media-portal/board.db

# Optional dev-only origins for LAN access (comma-separated)
NEXT_PUBLIC_DEV_ORIGINS=http://192.168.1.4:3000
```

### Local development
1. Create `.env.local` (see above)
2. Set `NEXT_PUBLIC_DEPLOY_TARGET=home`
3. `npm install`
4. `npm run dev`

### Public shell (Vercel)
Set `NEXT_PUBLIC_DEPLOY_TARGET=public` and `NEXT_PUBLIC_HOME_URL` to your tailnet domain. The UI stays locked until the tailnet is reachable and then shows an "Enter Home Portal" CTA.

### Home server deployment
1. `npm install`
2. `npm run build`
3. `npm run start`

SQLite note: ensure `BOARD_DB_PATH` directory exists and is writable by the systemd user.

### Reverse proxy (Caddy example)
Replace `home.tailnet.ts.net` with your tailnet domain and update ports for your services:

```
home.tailnet.ts.net {
  tls /etc/ssl/tailscale/home.tailnet.ts.net.crt /etc/ssl/tailscale/home.tailnet.ts.net.key

  handle /jelly* { reverse_proxy 127.0.0.1:8096 }
  handle /radarr* { reverse_proxy 127.0.0.1:7878 }
  handle /sonarr* { reverse_proxy 127.0.0.1:8989 }
  handle /prowlarr* { reverse_proxy 127.0.0.1:9696 }
  handle /bazarr* { reverse_proxy 127.0.0.1:6767 }
  handle /qb* { redir https://qb.tailnet.ts.net 302 }

  handle /* { reverse_proxy 127.0.0.1:3000 }
}
```

### HTTP to HTTPS redirect
The portal includes an `/http-redirect` page for plain HTTP. Choose one:

Option A (simple redirect):
```
:80 {
  redir https://home.tailnet.ts.net/http-redirect 302
}
```

Option B (proxy HTTP to Next):
```
:80 {
  reverse_proxy 127.0.0.1:3000
}
```

### Future ideas
- More system sensors and charts
- Service admin actions (e.g., reset passwords for Radarr/Sonarr/Jellyfin)
- Alerts and health history

---

## Turkce

### Proje nedir?
Evdeki medya servisleri icin tek bir portal. Iki modda calisir:

- **Public shell (Vercel):** arayuz gozukur ama kilitlidir; tailnet erisimi varsa ev portalina CTA sunar.
- **Home portal (Tailscale + Caddy):** tum servisler portal icinde calisir, sistem istatistikleri ve mesaj panosu aktif olur.

### Ozellikler
- Tek evren odak modu (iframe overlay)
- Servis saglik ve gecikme kontrolu
- Sistem istatistikleri (CPU, RAM, disk, uptime, opsiyonel sicaklik)
- Aile mesaj panosu (SQLite, rate-limit)
- Tailnet kontrol kapisi + public preview
- Acik/koyu tema + TR/EN/IT dil destegi
- Mobil uyumlu, animasyonlu arayuz

### Gereksinimler
- Node.js 20+ ve npm
- Linux ev sunucusu (onerilir) ve systemd
- Sunucuda ve istemci cihazlarda Tailscale
- HTTPS destekli reverse proxy (Caddy veya Nginx)
- Yerel calisan medya servisleri (Jellyfin, Radarr, Sonarr, Prowlarr, Bazarr)

Not: Tek komutluk kurulum icin Tailscale/Caddy/systemd otomasyonu ayri bir repo olacak. O repo hazir olana kadar burada kisa notlar ve ornekler var.

### Ortam degiskenleri
`.env.local` dosyasi olusturun: 
```dotenv
# public | home
NEXT_PUBLIC_DEPLOY_TARGET=home

# Tailnet home portal URL (used for reachability and links)
NEXT_PUBLIC_HOME_URL=https://home.tailnet.ts.net

# Optional override for the local SQLite database path
BOARD_DB_PATH=/var/lib/home-media-portal/board.db

# Optional dev-only origins for LAN access (comma-separated)
NEXT_PUBLIC_DEV_ORIGINS=http://192.168.1.4:3000
```

### Lokal gelistirme
1. `.env.local` dosyasini olustur (ustteki ornek)
2. `NEXT_PUBLIC_DEPLOY_TARGET=home`
3. `npm install`
4. `npm run dev`

### Public shell (Vercel)
`NEXT_PUBLIC_DEPLOY_TARGET=public` ve `NEXT_PUBLIC_HOME_URL` tailnet domainin olacak. Tailnet erisimi yoksa UI kilitli kalir, erisim olunca "Enter Home Portal" butonu gorunur.

### Sunucuya kurulum
1. `npm install`
2. `npm run build`
3. `npm run start`

SQLite notu: `BOARD_DB_PATH` klasoru mevcut olmali ve systemd kullanicisi yazabilmeli.

### Reverse proxy (Caddy ornegi)
`home.tailnet.ts.net` yerine kendi tailnet domainini ve servis portlarini yaz:

```
home.tailnet.ts.net {
  tls /etc/ssl/tailscale/home.tailnet.ts.net.crt /etc/ssl/tailscale/home.tailnet.ts.net.key

  handle /jelly* { reverse_proxy 127.0.0.1:8096 }
  handle /radarr* { reverse_proxy 127.0.0.1:7878 }
  handle /sonarr* { reverse_proxy 127.0.0.1:8989 }
  handle /prowlarr* { reverse_proxy 127.0.0.1:9696 }
  handle /bazarr* { reverse_proxy 127.0.0.1:6767 }
  handle /qb* { redir https://qb.tailnet.ts.net 302 }

  handle /* { reverse_proxy 127.0.0.1:3000 }
}
```

### HTTP -> HTTPS yonlendirme
HTTP ile gelenler icin `/http-redirect` sayfasi vardir. Iki secenek:

Secenek A (basit yonlendirme):
```
:80 {
  redir https://home.tailnet.ts.net/http-redirect 302
}
```

Secenek B (HTTP proxy):
```
:80 {
  reverse_proxy 127.0.0.1:3000
}
```

### Gelecek fikirleri
- Daha fazla sistem istatistigi ve grafik
- Radarr/Sonarr/Jellyfin icin admin aksiyonlari
- Gecmis saglik verisi ve uyarilar
