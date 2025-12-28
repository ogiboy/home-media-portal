// Localization dictionaries and lookup helpers.
import type { ServiceId } from "@/lib/services";

// Supported locale codes.
export const locales = ["tr", "en", "it"] as const;
export type Locale = (typeof locales)[number];

// Default locale used when none is resolved.
export const defaultLocale: Locale = "tr";

type TimeStrings = {
  justNow: string;
  minutesAgo: string;
  hoursAgo: string;
  daysAgo: string;
  minuteShort: string;
  hourShort: string;
  dayShort: string;
};

type ServiceDescriptions = Record<ServiceId, string>;

export type PortalStrings = {
  nav: {
    dashboard: string;
    system: string;
    board: string;
  };
  header: {
    kicker: string;
    title: string;
    subtitle: string;
    search: string;
    searchHint: string;
    liveNote: string;
    previewNote: string;
    asideNote: string;
  };
  accessibility: {
    themeToggle: string;
    languageToggle: string;
    primaryNav: string;
    mobileNav: string;
    dialogClose: string;
  };
  badges: {
    homePortal: string;
    publicPreview: string;
  };
  tailnet: {
    reachable: string;
    offline: string;
    connecting: string;
    retry: string;
    connectedNote: string;
    lockedNote: string;
  };
  services: {
    title: string;
    description: string;
    focusHint: string;
    latency: string;
    open: string;
    newTab: string;
    copyLink: string;
    restart: string;
    restartPending: string;
    restartQueued: string;
    restartUnavailable: string;
    statusOnline: string;
    statusOffline: string;
    statusChecking: string;
    statusLocked: string;
    overlayHint: string;
    newTabHint: string;
    items: ServiceDescriptions;
  };
  system: {
    title: string;
    description: string;
    updatedLabel: string;
    vitalsTitle: string;
    vitalsDesc: string;
    loadAvg: string;
    memory: string;
    disk: string;
    uptime: string;
    temperature: string;
    quickTitle: string;
    quickDesc: string;
  };
  board: {
    title: string;
    description: string;
    tailnetOnly: string;
    recentTitle: string;
    recentDesc: string;
    empty: string;
    postTitle: string;
    postDesc: string;
    nameLabel: string;
    messageLabel: string;
    namePlaceholder: string;
    messagePlaceholder: string;
    postButton: string;
    charCount: string;
    errorInvalid: string;
    errorRate: string;
    errorGeneric: string;
  };
  focus: {
    label: string;
    openInTab: string;
    close: string;
    frameTitleSuffix: string;
  };
  gate: {
    title: string;
    connected: string;
    waiting: string;
    connecting: string;
    publicDescription: string;
    homeDescription: string;
    enter: string;
    waitingLabel: string;
    connectingLabel: string;
  };
  command: {
    placeholder: string;
    empty: string;
    groupServices: string;
  };
  toasts: {
    tailnetOnline: {
      title: string;
      description: string;
    };
    tailnetOffline: {
      title: string;
      description: string;
    };
    tailnetConnecting: {
      title: string;
      description: string;
    };
    boardSuccess: {
      title: string;
      description: string;
    };
    boardError: {
      title: string;
      description: string;
    };
    boardRate: {
      title: string;
      description: string;
    };
    boardUnavailable: {
      title: string;
      description: string;
    };
    restartQueued: {
      title: string;
      description: string;
    };
    restartUnavailable: {
      title: string;
      description: string;
    };
  };
  misc: {
    updated: string;
    na: string;
    tailnetOnly: string;
  };
  errors: {
    title: string;
    description: string;
    retry: string;
  };
  notFound: {
    title: string;
    description: string;
    action: string;
  };
  http: {
    title: string;
    description: string;
    action: string;
  };
  time: TimeStrings;
};

const dictionaries: Record<Locale, PortalStrings> = {
  tr: {
    nav: {
      dashboard: "Gosterge",
      system: "Sistem",
      board: "Pano",
    },
    header: {
      kicker: "Ev Medya Portali",
      title: "Ev Medya Portali",
      subtitle: "Medya servisleriniz icin tek bir evren",
      search: "Ara",
      searchHint: "Cmd+K",
      liveNote: "Canli servisler portal icinde calisir.",
      previewNote: "Onizleme modu: servisler kilitli.",
      asideNote: "Tek evren",
    },
    accessibility: {
      themeToggle: "Tema degistir",
      languageToggle: "Dil degistir",
      primaryNav: "Ana gezinme",
      mobileNav: "Mobil gezinme",
      dialogClose: "Kapat",
    },
    badges: {
      homePortal: "Ev Portali",
      publicPreview: "Herkese Acik Onizleme",
    },
    tailnet: {
      reachable: "Tailnet erisilebilir",
      offline: "Tailnet cevrimdisi",
      connecting: "Baglaniyor",
      retry: "Yeniden dene",
      connectedNote: "Tailnet yiginina baglisin.",
      lockedNote: "Kilitli kabuk. Tailnet baglantisi gerekiyor.",
    },
    services: {
      title: "Servisler",
      description: "Medya yiginiza portaldan cikmadan girin.",
      focusHint: "Odak modu paneli gorunur tutar.",
      latency: "Gecikme",
      open: "Ac",
      newTab: "Yeni sekme",
      copyLink: "Baglantiyi kopyala",
      restart: "Yeniden baslat",
      restartPending: "Yeniden baslatiliyor",
      restartQueued: "Kuyruga alindi",
      restartUnavailable: "Hazir degil",
      statusOnline: "Cevrimici",
      statusOffline: "Cevrimdisi",
      statusChecking: "Kontrol ediliyor",
      statusLocked: "Kilitli",
      overlayHint: "Odak modunda acilir.",
      newTabHint: "Yeni sekmede acilir.",
      items: {
        jellyfin: "Film, dizi ve kisisel medya akisi.",
        radarr: "Film otomasyonu ve kutuphane yonetimi.",
        sonarr: "Dizi otomasyonu ve bolum takibi.",
        prowlarr: "Indexer yonetimi ve kesif merkezi.",
        bazarr: "Kutuphane altyazi yonetimi.",
        qbittorrent: "Indirme kuyrugu ve torrent istemcisi.",
      },
    },
    system: {
      title: "Sistem durumu",
      description: "Ev sunucusundan canli saglik verisi.",
      updatedLabel: "Guncellendi",
      vitalsTitle: "Durum",
      vitalsDesc: "CPU, bellek, disk ve calisma suresi.",
      loadAvg: "Yuk ort. (1/5/15)",
      memory: "Bellek",
      disk: "Disk kullanimi",
      uptime: "Calisma suresi",
      temperature: "Sicaklik",
      quickTitle: "Hizli durum",
      quickDesc: "Servis saglik ozeti.",
    },
    board: {
      title: "Aile mesaj panosu",
      description: "Ev portalinda kisa notlar birakin.",
      tailnetOnly: "Sadece tailnet",
      recentTitle: "Son notlar",
      recentDesc: "Son 50 mesaj.",
      empty: "Henuz not yok. Ilk mesaji birakin.",
      postTitle: "Not birak",
      postDesc: "Kisa ve net yaz.",
      nameLabel: "Isim",
      messageLabel: "Mesaj",
      namePlaceholder: "Aileden biri",
      messagePlaceholder: "Film gecesi 21:30!",
      postButton: "Mesaj gonder",
      charCount: "Karakter",
      errorInvalid: "Mesaj gecersiz.",
      errorRate: "Cok hizli gonderiyorsunuz.",
      errorGeneric: "Su anda gonderilemiyor.",
    },
    focus: {
      label: "Odak modu",
      openInTab: "Sekmede ac",
      close: "Kapat",
      frameTitleSuffix: "paneli",
    },
    gate: {
      title: "Tailnet Kapisi",
      connected: "Tailnet bagli",
      waiting: "Tailnet bekleniyor",
      connecting: "Tailnet'e baglaniyor",
      publicDescription: "Tailscale'i acip tailnet'e baglanin ve ev portalini acin.",
      homeDescription: "Portal yerelde calisiyor. Gomulu uygulamalar icin tailnet'e baglanin.",
      enter: "Ev Portalina Gir",
      waitingLabel: "Tailnet bekleniyor",
      connectingLabel: "Baglaniyor",
    },
    command: {
      placeholder: "Servis ara...",
      empty: "Eslesme yok.",
      groupServices: "Servisler",
    },
    toasts: {
      tailnetOnline: {
        title: "Tailnet baglandi",
        description: "Ev portali hazir.",
      },
      tailnetOffline: {
        title: "Tailnet kapali",
        description: "Tailscale'i acip tekrar dene.",
      },
      tailnetConnecting: {
        title: "Tailnet baglaniyor",
        description: "Baglanti kontrol ediliyor.",
      },
      boardSuccess: {
        title: "Mesaj gonderildi",
        description: "Not panosuna eklendi.",
      },
      boardError: {
        title: "Mesaj gonderilemedi",
        description: "Tekrar dene veya baglantiyi kontrol et.",
      },
      boardRate: {
        title: "Cok hizli gonderim",
        description: "Lutfen biraz bekle.",
      },
      boardUnavailable: {
        title: "Tailnet gerekli",
        description: "Pano sadece ev portalinda.",
      },
      restartQueued: {
        title: "Yeniden baslatma gonderildi",
        description: "Istegin kuyruga alindi.",
      },
      restartUnavailable: {
        title: "Aksiyon hazir degil",
        description: "Bu islem henuz desteklenmiyor.",
      },
    },
    misc: {
      updated: "Guncellendi",
      na: "yok",
      tailnetOnly: "Sadece tailnet",
    },
    errors: {
      title: "Bir hata olustu",
      description: "Portal beklenmeyen bir hatayla karsilasti. Tekrar deneyin ya da sayfayi yenileyin.",
      retry: "Tekrar dene",
    },
    notFound: {
      title: "Sayfa bulunamadi",
      description: "Aradigin sayfa yok ya da tasinmis olabilir.",
      action: "Ana sayfaya don",
    },
    http: {
      title: "HTTPS gerekli",
      description: "Guvenli baglanti icin HTTPS kullanin. Birazdan yonlendirileceksiniz.",
      action: "HTTPS'e git",
    },
    time: {
      justNow: "az once",
      minutesAgo: "{count} dk once",
      hoursAgo: "{count} sa once",
      daysAgo: "{count} gun once",
      minuteShort: "dk",
      hourShort: "sa",
      dayShort: "gun",
    },
  },
  en: {
    nav: {
      dashboard: "Dashboard",
      system: "System",
      board: "Board",
    },
    header: {
      kicker: "Home Media Portal",
      title: "Home Media Portal",
      subtitle: "A single universe for your media services",
      search: "Search",
      searchHint: "Cmd+K",
      liveNote: "Live services run inside the portal.",
      previewNote: "Preview mode: services are locked.",
      asideNote: "Single universe",
    },
    accessibility: {
      themeToggle: "Toggle theme",
      languageToggle: "Change language",
      primaryNav: "Primary navigation",
      mobileNav: "Mobile navigation",
      dialogClose: "Close dialog",
    },
    badges: {
      homePortal: "Home Portal",
      publicPreview: "Public Preview",
    },
    tailnet: {
      reachable: "Tailnet reachable",
      offline: "Tailnet offline",
      connecting: "Connecting",
      retry: "Retry",
      connectedNote: "Connected to your tailnet stack.",
      lockedNote: "Locked shell. Tailnet access required.",
    },
    services: {
      title: "Services",
      description: "Jump into your media stack without leaving the portal.",
      focusHint: "Focus mode keeps the dashboard present.",
      latency: "Latency",
      open: "Open",
      newTab: "New tab",
      copyLink: "Copy link",
      restart: "Restart",
      restartPending: "Restarting",
      restartQueued: "Queued",
      restartUnavailable: "Unavailable",
      statusOnline: "Online",
      statusOffline: "Offline",
      statusChecking: "Checking",
      statusLocked: "Locked",
      overlayHint: "Opens inside focus mode.",
      newTabHint: "Opens in a new tab.",
      items: {
        jellyfin: "Movies, shows, and personal media streaming.",
        radarr: "Movie automation and library management.",
        sonarr: "Series automation and episode tracking.",
        prowlarr: "Indexer management and discovery hub.",
        bazarr: "Subtitle management for your library.",
        qbittorrent: "Download queue and torrent client.",
      },
    },
    system: {
      title: "System status",
      description: "Live health overview from the home server.",
      updatedLabel: "Updated",
      vitalsTitle: "Vitals",
      vitalsDesc: "CPU, memory, disk, and uptime.",
      loadAvg: "Load avg (1/5/15)",
      memory: "Memory",
      disk: "Disk usage",
      uptime: "Uptime",
      temperature: "Temperature",
      quickTitle: "Quick status",
      quickDesc: "Service health snapshot.",
    },
    board: {
      title: "Family message board",
      description: "Leave quick notes inside the home portal.",
      tailnetOnly: "Tailnet only",
      recentTitle: "Recent notes",
      recentDesc: "Latest 50 messages.",
      empty: "No notes yet. Be the first to post.",
      postTitle: "Post a note",
      postDesc: "Keep it short and sweet.",
      nameLabel: "Name",
      messageLabel: "Message",
      namePlaceholder: "Someone at home",
      messagePlaceholder: "Movie night at 21:30!",
      postButton: "Post message",
      charCount: "Characters",
      errorInvalid: "Message is invalid.",
      errorRate: "You are posting too fast.",
      errorGeneric: "Unable to post right now.",
    },
    focus: {
      label: "Focus mode",
      openInTab: "Open in tab",
      close: "Close",
      frameTitleSuffix: "panel",
    },
    gate: {
      title: "Tailnet Gate",
      connected: "Tailnet connected",
      waiting: "Waiting for tailnet",
      connecting: "Connecting to tailnet",
      publicDescription: "Enable Tailscale and connect to your tailnet to unlock the home portal.",
      homeDescription: "The portal is running locally. Connect to tailnet for embedded apps.",
      enter: "Enter Home Portal",
      waitingLabel: "Waiting for tailnet",
      connectingLabel: "Connecting",
    },
    command: {
      placeholder: "Search services...",
      empty: "No matches found.",
      groupServices: "Services",
    },
    toasts: {
      tailnetOnline: {
        title: "Tailnet connected",
        description: "Home portal is reachable.",
      },
      tailnetOffline: {
        title: "Tailnet offline",
        description: "Enable Tailscale and retry.",
      },
      tailnetConnecting: {
        title: "Checking tailnet",
        description: "Connection check in progress.",
      },
      boardSuccess: {
        title: "Message posted",
        description: "Your note is on the board.",
      },
      boardError: {
        title: "Message failed",
        description: "Please try again.",
      },
      boardRate: {
        title: "Too many requests",
        description: "Slow down for a moment.",
      },
      boardUnavailable: {
        title: "Tailnet required",
        description: "Board is available on the home portal.",
      },
      restartQueued: {
        title: "Restart queued",
        description: "Service restart has been queued.",
      },
      restartUnavailable: {
        title: "Action unavailable",
        description: "This action is not available yet.",
      },
    },
    misc: {
      updated: "Updated",
      na: "n/a",
      tailnetOnly: "Tailnet only",
    },
    errors: {
      title: "Something went wrong",
      description: "The portal hit an unexpected error. Try again or refresh the page.",
      retry: "Try again",
    },
    notFound: {
      title: "Page not found",
      description: "The page you are looking for does not exist or moved.",
      action: "Back to home",
    },
    http: {
      title: "HTTPS required",
      description: "Use HTTPS for a secure connection. Redirecting now.",
      action: "Go to HTTPS",
    },
    time: {
      justNow: "just now",
      minutesAgo: "{count}m ago",
      hoursAgo: "{count}h ago",
      daysAgo: "{count}d ago",
      minuteShort: "m",
      hourShort: "h",
      dayShort: "d",
    },
  },
  it: {
    nav: {
      dashboard: "Dashboard",
      system: "Sistema",
      board: "Bacheca",
    },
    header: {
      kicker: "Home Media Portal",
      title: "Home Media Portal",
      subtitle: "Un unico universo per i tuoi servizi media",
      search: "Cerca",
      searchHint: "Cmd+K",
      liveNote: "I servizi live girano dentro il portale.",
      previewNote: "Modalita anteprima: servizi bloccati.",
      asideNote: "Universo unico",
    },
    accessibility: {
      themeToggle: "Cambia tema",
      languageToggle: "Cambia lingua",
      primaryNav: "Navigazione principale",
      mobileNav: "Navigazione mobile",
      dialogClose: "Chiudi finestra",
    },
    badges: {
      homePortal: "Portale Casa",
      publicPreview: "Anteprima Pubblica",
    },
    tailnet: {
      reachable: "Tailnet raggiungibile",
      offline: "Tailnet offline",
      connecting: "Connessione",
      retry: "Riprova",
      connectedNote: "Connesso alla tua tailnet.",
      lockedNote: "Shell bloccata. Serve accesso tailnet.",
    },
    services: {
      title: "Servizi",
      description: "Entra nel tuo stack media senza uscire dal portale.",
      focusHint: "La modalita focus mantiene visibile la dashboard.",
      latency: "Latenza",
      open: "Apri",
      newTab: "Nuova scheda",
      copyLink: "Copia link",
      restart: "Riavvia",
      restartPending: "Riavvio",
      restartQueued: "In coda",
      restartUnavailable: "Non disponibile",
      statusOnline: "Online",
      statusOffline: "Offline",
      statusChecking: "Controllo",
      statusLocked: "Bloccato",
      overlayHint: "Si apre in modalita focus.",
      newTabHint: "Si apre in una nuova scheda.",
      items: {
        jellyfin: "Film, serie e streaming media personale.",
        radarr: "Automazione film e gestione libreria.",
        sonarr: "Automazione serie e tracciamento episodi.",
        prowlarr: "Gestione indexer e hub di scoperta.",
        bazarr: "Gestione sottotitoli per la libreria.",
        qbittorrent: "Coda download e client torrent.",
      },
    },
    system: {
      title: "Stato sistema",
      description: "Panoramica live dal server di casa.",
      updatedLabel: "Aggiornato",
      vitalsTitle: "Parametri",
      vitalsDesc: "CPU, memoria, disco e uptime.",
      loadAvg: "Carico medio (1/5/15)",
      memory: "Memoria",
      disk: "Uso disco",
      uptime: "Uptime",
      temperature: "Temperatura",
      quickTitle: "Stato rapido",
      quickDesc: "Snapshot salute servizi.",
    },
    board: {
      title: "Bacheca di famiglia",
      description: "Lascia note rapide nel portale di casa.",
      tailnetOnly: "Solo tailnet",
      recentTitle: "Note recenti",
      recentDesc: "Ultimi 50 messaggi.",
      empty: "Nessuna nota. Pubblica la prima.",
      postTitle: "Pubblica una nota",
      postDesc: "Breve e chiaro.",
      nameLabel: "Nome",
      messageLabel: "Messaggio",
      namePlaceholder: "Qualcuno a casa",
      messagePlaceholder: "Serata film alle 21:30!",
      postButton: "Invia messaggio",
      charCount: "Caratteri",
      errorInvalid: "Messaggio non valido.",
      errorRate: "Stai inviando troppo in fretta.",
      errorGeneric: "Impossibile inviare ora.",
    },
    focus: {
      label: "Modalita focus",
      openInTab: "Apri in scheda",
      close: "Chiudi",
      frameTitleSuffix: "pannello",
    },
    gate: {
      title: "Porta Tailnet",
      connected: "Tailnet connessa",
      waiting: "In attesa della tailnet",
      connecting: "Connessione alla tailnet",
      publicDescription: "Attiva Tailscale e connettiti alla tailnet per sbloccare il portale di casa.",
      homeDescription: "Il portale e locale. Connettiti alla tailnet per le app integrate.",
      enter: "Entra nel Portale",
      waitingLabel: "In attesa",
      connectingLabel: "Connessione",
    },
    command: {
      placeholder: "Cerca servizi...",
      empty: "Nessun risultato.",
      groupServices: "Servizi",
    },
    toasts: {
      tailnetOnline: {
        title: "Tailnet connessa",
        description: "Il portale di casa e raggiungibile.",
      },
      tailnetOffline: {
        title: "Tailnet offline",
        description: "Attiva Tailscale e riprova.",
      },
      tailnetConnecting: {
        title: "Controllo tailnet",
        description: "Verifica connessione in corso.",
      },
      boardSuccess: {
        title: "Messaggio inviato",
        description: "Il tuo messaggio e sulla bacheca.",
      },
      boardError: {
        title: "Invio fallito",
        description: "Riprova tra poco.",
      },
      boardRate: {
        title: "Troppi invii",
        description: "Attendi un momento.",
      },
      boardUnavailable: {
        title: "Tailnet richiesta",
        description: "La bacheca e solo nel portale di casa.",
      },
      restartQueued: {
        title: "Riavvio in coda",
        description: "Il riavvio e stato accodato.",
      },
      restartUnavailable: {
        title: "Azione non disponibile",
        description: "Questa azione non e ancora attiva.",
      },
    },
    misc: {
      updated: "Aggiornato",
      na: "n/d",
      tailnetOnly: "Solo tailnet",
    },
    errors: {
      title: "Si e verificato un errore",
      description: "Il portale ha riscontrato un errore inatteso. Riprova o aggiorna la pagina.",
      retry: "Riprova",
    },
    notFound: {
      title: "Pagina non trovata",
      description: "La pagina richiesta non esiste o e stata spostata.",
      action: "Torna alla home",
    },
    http: {
      title: "HTTPS necessario",
      description: "Usa HTTPS per una connessione sicura. Reindirizzamento in corso.",
      action: "Vai a HTTPS",
    },
    time: {
      justNow: "proprio ora",
      minutesAgo: "{count} min fa",
      hoursAgo: "{count} h fa",
      daysAgo: "{count} g fa",
      minuteShort: "min",
      hourShort: "h",
      dayShort: "g",
    },
  },
};

// Pull potential locales from an Accept-Language header.
const parseAcceptLanguage = (header?: string) =>
  header
    ? header
        .split(",")
        .map((part) => part.trim().split(";")[0])
        .filter(Boolean)
        .map((part) => part.toLowerCase())
    : [];

// Normalize a locale string to a supported locale.
export const resolveLocale = (value?: string, acceptLanguage?: string): Locale => {
  if (value) {
    const normalized = value.toLowerCase();
    if (locales.includes(normalized as Locale)) {
      return normalized as Locale;
    }
  }

  for (const candidate of parseAcceptLanguage(acceptLanguage)) {
    const base = candidate.split("-")[0];
    if (locales.includes(base as Locale)) {
      return base as Locale;
    }
  }

  return defaultLocale;
};

// Resolve translations and the final locale tuple.
export const getTranslations = (value?: string, acceptLanguage?: string) => {
  const locale = resolveLocale(value, acceptLanguage);
  return { locale, strings: dictionaries[locale] };
};
