// Localization dictionaries and lookup helpers.
import type { ServiceId } from '@/lib/services';

// Supported locale codes.
export const locales = ['tr', 'en', 'it'] as const;
export type Locale = (typeof locales)[number];

// Default locale used when none is resolved.
export const defaultLocale: Locale = 'tr';

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
    search: string;
    library: string;
    games: string;
    shortcuts: string;
    services: string;
    system: string;
    board: string;
    settings: string;
    chat: string;
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
    devMode: string;
  };
  chat: {
    title: string;
    description: string;
    welcome: string;
    placeholder: string;
    send: string;
    thinking: string;
    suggestions: {
      serverStatus: string;
      downloads: string;
      newMovies: string;
      weather: string;
      searchMedia: string;
      quickActions: string;
    };
    actions: {
      restart: string;
      shutdown: string;
      checkServices: string;
      viewDownloads: string;
      searchMovie: string;
      addMovie: string;
    };
    errors: {
      generic: string;
      offline: string;
      apiError: string;
    };
  };
  accessibility: {
    themeToggle: string;
    languageToggle: string;
    primaryNav: string;
    mobileNav: string;
    dialogClose: string;
    backToTop: string;
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
    devMode: string;
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
  shortcuts: {
    title: string;
    description: string;
    searchTitle: string;
    searchDesc: string;
    searchPlaceholder: string;
    searchMovies: string;
    searchSeries: string;
    searchButton: string;
    resultsTitle: string;
    resultsEmpty: string;
    addButton: string;
    actionsTitle: string;
    actionsDesc: string;
    actionSync: string;
    actionRescan: string;
    actionTest: string;
    comingSoon: string;
    errorInvalid: string;
    errorUnavailable: string;
    errorForbidden: string;
    errorMissingKey: string;
    errorMissingConfig: string;
    errorUnknown: string;
  };
  search: {
    title: string;
    description: string;
    placeholder: string;
    cta: string;
    resultsTitle: string;
    resultsHint: string;
    idle: string;
    empty: string;
    badgeDownloaded: string;
    badgeNew: string;
    kindMovie: string;
    kindSeries: string;
    playCta: string;
    addCta: string;
  };
  library: {
    title: string;
    description: string;
    loading: string;
  };
  games: {
    title: string;
    description: string;
    cta: string;
    nowPlaying: string;
    collectionTitle: string;
    collectionDesc: string;
    play: string;
    playAgain: string;
    comingSoon: string;
    liveLabel: string;
    score: string;
    timeLeft: string;
    orbChaseTitle: string;
    orbChaseHint: string;
    playsLabel: string;
    topScoreLabel: string;
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
  settings: {
    title: string;
    description: string;
    comingSoon: string;
  };
  board: {
    title: string;
    description: string;
    tailnetOnly: string;
    recentTitle: string;
    recentDesc: string;
    filterLabel: string;
    filterPlaceholder: string;
    sortNewest: string;
    sortOldest: string;
    dateFromLabel: string;
    dateToLabel: string;
    clearFilters: string;
    emptyFiltered: string;
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
    dismiss: string;
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
    shortcutAdded: {
      title: string;
      description: string;
    };
    shortcutFailed: {
      title: string;
      description: string;
    };
    shortcutMissingConfig: {
      title: string;
      description: string;
    };
    shortcutMissingKey: {
      title: string;
      description: string;
    };
    shortcutUnavailable: {
      title: string;
      description: string;
    };
  };
  misc: {
    updated: string;
    na: string;
    tailnetOnly: string;
  };
  footer: {
    onlineNow: string;
    peakOnline: string;
  };
  errors: {
    title: string;
    description: string;
    retry: string;
  };
  forbidden: {
    title: string;
    description: string;
    action: string;
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
      dashboard: 'Gosterge',
      search: 'Arama',
      library: 'Kutuphane',
      games: 'Oyunlar',
      shortcuts: 'Kisayollar',
      services: 'Servisler',
      system: 'Sistem',
      board: 'Pano',
      settings: 'Ayarlar',
      chat: 'Sohbet',
    },
    header: {
      kicker: 'Ev Medya Portali',
      title: 'Ev Medya Portali',
      subtitle: 'Medya servisleriniz icin tek bir evren',
      search: 'Ara',
      searchHint: 'Cmd+K',
      liveNote: 'Canli servisler portal icinde calisir.',
      previewNote: 'Onizleme modu: servisler kilitli.',
      devMode: 'Gelistirici modu',
      asideNote: 'Tek evren',
    },
    accessibility: {
      themeToggle: 'Tema degistir',
      languageToggle: 'Dil degistir',
      primaryNav: 'Ana gezinme',
      mobileNav: 'Mobil gezinme',
      dialogClose: 'Kapat',
      backToTop: 'Yukari cik',
    },
    badges: {
      homePortal: 'Ev Portali',
      publicPreview: 'Herkese Acik Onizleme',
    },
    tailnet: {
      reachable: 'Tailnet erisilebilir',
      offline: 'Tailnet cevrimdisi',
      connecting: 'Baglaniyor',
      devMode: 'Gelistirici modu',
      retry: 'Yeniden dene',
      connectedNote: 'Tailnet yiginina baglisin.',
      lockedNote: 'Kilitli kabuk. Tailnet baglantisi gerekiyor.',
    },
    services: {
      title: 'Servisler',
      description: 'Medya yiginiza portaldan cikmadan girin.',
      focusHint: 'Odak modu paneli gorunur tutar.',
      latency: 'Gecikme',
      open: 'Ac',
      newTab: 'Yeni sekme',
      copyLink: 'Baglantiyi kopyala',
      restart: 'Yeniden baslat',
      restartPending: 'Yeniden baslatiliyor',
      restartQueued: 'Kuyruga alindi',
      restartUnavailable: 'Hazir degil',
      statusOnline: 'Cevrimici',
      statusOffline: 'Cevrimdisi',
      statusChecking: 'Kontrol ediliyor',
      statusLocked: 'Kilitli',
      overlayHint: 'Odak modunda acilir.',
      newTabHint: 'Yeni sekmede acilir.',
      items: {
        jellyfin: 'Film, dizi ve kisisel medya akisi.',
        radarr: 'Film otomasyonu ve kutuphane yonetimi.',
        sonarr: 'Dizi otomasyonu ve bolum takibi.',
        prowlarr: 'Indexer yonetimi ve kesif merkezi.',
        bazarr: 'Kutuphane altyazi yonetimi.',
        qbittorrent: 'Indirme kuyrugu ve torrent istemcisi.',
      },
    },
    shortcuts: {
      title: 'Hizli Kisayollar',
      description: 'Sik kullanilan islemler tek panelde.',
      searchTitle: 'Arama',
      searchDesc: 'Radarr/Sonarr aramasi yakinda.',
      searchPlaceholder: 'Film veya dizi ara...',
      searchMovies: 'Film ara',
      searchSeries: 'Dizi ara',
      searchButton: 'Ara',
      resultsTitle: 'Sonuclar',
      resultsEmpty: 'Sonuc bulunamadi.',
      addButton: 'Ekle',
      actionsTitle: 'Hizli Aksiyonlar',
      actionsDesc: 'Servis gorevleri yakinda aktif.',
      actionSync: 'Senkronize et',
      actionRescan: 'Yeniden tara',
      actionTest: 'Test et',
      comingSoon: 'Yakinda',
      errorInvalid: 'Arama bos olamaz.',
      errorUnavailable: 'Tailnet disinda kullanilamaz.',
      errorForbidden: 'Bu islem icin yetkin yok.',
      errorMissingKey: 'API anahtari eksik.',
      errorMissingConfig: 'Profil veya klasor ayarlanmamis.',
      errorUnknown: 'Arama basarisiz oldu.',
    },
    search: {
      title: 'Global Arama',
      description: 'Yeni medya ve kutuphane arasinda ara.',
      placeholder: 'Film, dizi veya kutuphane ara...',
      cta: 'Ara',
      resultsTitle: 'Sonuclar',
      resultsHint: 'Kaynak · Durum',
      idle: 'Arama yapmak icin yazmaya basla.',
      empty: 'Sonuc bulunamadi.',
      badgeDownloaded: 'Indirildi',
      badgeNew: 'Yeni',
      kindMovie: 'Film',
      kindSeries: 'Dizi',
      playCta: 'Oynat',
      addCta: 'Ekle',
    },
    library: {
      title: 'Kutuphane',
      description: 'Indirilen icerikleri satirlar halinde gor.',
      loading: 'Kutuphane baglantisi hazirlaniyor...',
    },
    games: {
      title: 'Oyun Kosesi',
      description: 'Beklerken kisa bir oyun oyna.',
      cta: 'Tum oyunlar',
      nowPlaying: 'Secili oyun',
      collectionTitle: 'Oyunlar',
      collectionDesc: 'Koleksiyondan sec.',
      play: 'Oyna',
      playAgain: 'Tekrar oyna',
      comingSoon: 'Yakinda',
      liveLabel: 'Canli',
      score: 'Skor',
      timeLeft: 'Sure',
      orbChaseTitle: 'Orb Avcisi',
      orbChaseHint: 'Parlayan orbu tikla ve sure bitmeden puan topla.',
      playsLabel: 'Oynanma',
      topScoreLabel: 'En yuksek skor',
    },
    system: {
      title: 'Sistem durumu',
      description: 'Ev sunucusundan canli saglik verisi.',
      updatedLabel: 'Guncellendi',
      vitalsTitle: 'Durum',
      vitalsDesc: 'CPU, bellek, disk ve calisma suresi.',
      loadAvg: 'Yuk ort. (1/5/15)',
      memory: 'Bellek',
      disk: 'Disk kullanimi',
      uptime: 'Calisma suresi',
      temperature: 'Sicaklik',
      quickTitle: 'Hizli durum',
      quickDesc: 'Servis saglik ozeti.',
    },
    settings: {
      title: 'Ayarlar',
      description: 'Portal tercihlerini yonet.',
      comingSoon: 'Yakinda',
    },
    board: {
      title: 'Aile mesaj panosu',
      description: 'Ev portalinda kisa notlar birakin.',
      tailnetOnly: 'Sadece tailnet',
      recentTitle: 'Son notlar',
      recentDesc: 'Son 50 mesaj.',
      filterLabel: 'Filtre',
      filterPlaceholder: 'Mesaj veya isim ara...',
      sortNewest: 'Yeniden eskiye',
      sortOldest: 'Eskiden yeniye',
      dateFromLabel: 'Baslangic tarihi',
      dateToLabel: 'Bitis tarihi',
      clearFilters: 'Filtreleri temizle',
      emptyFiltered: 'Filtreyle eslesen mesaj yok.',
      empty: 'Henuz not yok. Ilk mesaji birakin.',
      postTitle: 'Not birak',
      postDesc: 'Kisa ve net yaz.',
      nameLabel: 'Isim',
      messageLabel: 'Mesaj',
      namePlaceholder: 'Aileden biri',
      messagePlaceholder: 'Film gecesi 21:30!',
      postButton: 'Mesaj gonder',
      charCount: 'Karakter',
      errorInvalid: 'Mesaj gecersiz.',
      errorRate: 'Cok hizli gonderiyorsunuz.',
      errorGeneric: 'Su anda gonderilemiyor.',
    },
    focus: {
      label: 'Odak modu',
      openInTab: 'Sekmede ac',
      close: 'Kapat',
      frameTitleSuffix: 'paneli',
    },
    gate: {
      title: 'Tailnet Kapisi',
      connected: 'Tailnet bagli',
      waiting: 'Tailnet bekleniyor',
      connecting: "Tailnet'e baglaniyor",
      publicDescription:
        "Tailscale'i acip tailnet'e baglanin ve ev portalini acin.",
      homeDescription:
        "Portal yerelde calisiyor. Gomulu uygulamalar icin tailnet'e baglanin.",
      enter: 'Ev Portalina Gir',
      waitingLabel: 'Tailnet bekleniyor',
      connectingLabel: 'Baglaniyor',
    },
    command: {
      placeholder: 'Servis ara...',
      empty: 'Eslesme yok.',
      groupServices: 'Servisler',
    },
    chat: {
      title: 'Ev Asistani',
      description: 'Sorularini sor, sistemi kontrol et.',
      welcome:
        'Merhaba! Ben ev asistanınım. Sunucu durumu sorgulayabilir, film arayabilir, hava durumunu öğrenebilir veya servisleri yönetebilirim. Nasıl yardımcı olabilirim?',
      placeholder: 'Mesaj yaz...',
      send: 'Gonder',
      thinking: 'Dusunuyorum...',
      suggestions: {
        serverStatus: 'Sunucu durumu',
        downloads: 'Indirmeler',
        newMovies: 'Yeni filmler',
        weather: 'Hava durumu',
        searchMedia: 'Medya ara',
        quickActions: 'Hizli aksiyonlar',
      },
      actions: {
        restart: 'Yeniden baslat',
        shutdown: 'Kapat',
        checkServices: 'Servisleri kontrol et',
        viewDownloads: 'Indirmeleri goster',
        searchMovie: 'Film ara',
        addMovie: 'Film ekle',
      },
      errors: {
        generic: 'Bir hata olustu. Tekrar dene.',
        offline: 'Sunucuya baglanilamadi.',
        apiError: 'API hatasi. Servisleri kontrol et.',
      },
    },
    toasts: {
      dismiss: 'Kapat',
      tailnetOnline: {
        title: 'Tailnet baglandi',
        description: 'Ev portali hazir.',
      },
      tailnetOffline: {
        title: 'Tailnet kapali',
        description: "Tailscale'i acip tekrar dene.",
      },
      tailnetConnecting: {
        title: 'Baglaniyor',
        description: 'Tailnet kontrol ediliyor.',
      },
      boardSuccess: {
        title: 'Mesaj gonderildi',
        description: 'Pano guncellendi.',
      },
      boardError: {
        title: 'Mesaj gonderilemedi',
        description: 'Tekrar dene.',
      },
      boardRate: {
        title: 'Cok hizli',
        description: 'Biraz bekleyip tekrar deneyin.',
      },
      boardUnavailable: {
        title: 'Tailnet disinda',
        description: 'Pano yalnizca ev icinde acik.',
      },
      restartQueued: {
        title: 'Yeniden baslatma kuyruga alindi',
        description: 'Servis kisa surede yeniden baslayacak.',
      },
      restartUnavailable: {
        title: 'Yeniden baslatma kapali',
        description: 'Bu servis icin desteklenmiyor.',
      },
      shortcutAdded: {
        title: 'Istek eklendi',
        description: 'Servis ekleme istegini aldi.',
      },
      shortcutFailed: {
        title: 'Islem basarisiz',
        description: 'Tekrar dene veya servis kontrol et.',
      },
      shortcutMissingConfig: {
        title: 'Ayar eksik',
        description: 'Profil veya klasor ayari gerekir.',
      },
      shortcutMissingKey: {
        title: 'API anahtari eksik',
        description: 'Radarr/Sonarr API anahtarini ekleyin.',
      },
      shortcutUnavailable: {
        title: 'Bu islem kilitli',
        description: 'Yalnizca yetkili kullanicilar icindir.',
      },
    },
    misc: {
      updated: 'Guncellendi',
      na: 'yok',
      tailnetOnly: 'Sadece tailnet',
    },
    footer: {
      onlineNow: 'Simdi online',
      peakOnline: 'En yuksek online',
    },
    errors: {
      title: 'Bir hata olustu',
      description:
        'Portal beklenmeyen bir hatayla karsilasti. Tekrar deneyin ya da sayfayi yenileyin.',
      retry: 'Tekrar dene',
    },
    notFound: {
      title: 'Sayfa bulunamadi',
      description: 'Aradigin sayfa yok ya da tasinmis olabilir.',
      action: 'Ana sayfaya don',
    },
    http: {
      title: 'HTTPS gerekli',
      description:
        'Guvenli baglanti icin HTTPS kullanin. Birazdan yonlendirileceksiniz.',
      action: "HTTPS'e git",
    },
    time: {
      justNow: 'az once',
      minutesAgo: '{count} dk once',
      hoursAgo: '{count} sa once',
      daysAgo: '{count} gun once',
      minuteShort: 'dk',
      hourShort: 'sa',
      dayShort: 'gun',
    },
    forbidden: {
      title: 'Erisim engellendi',
      description: 'Bu sayfaya erisim yok.',
      action: 'Ana sayfaya don',
    },
  },
  en: {
    nav: {
      dashboard: 'Dashboard',
      search: 'Search',
      library: 'Library',
      games: 'Games',
      shortcuts: 'Shortcuts',
      services: 'Services',
      system: 'System',
      board: 'Board',
      settings: 'Settings',
      chat: 'Chat',
    },
    header: {
      kicker: 'Home Media Portal',
      title: 'Home Media Portal',
      subtitle: 'A single universe for your media services',
      search: 'Search',
      searchHint: 'Cmd+K',
      liveNote: 'Live services run inside the portal.',
      previewNote: 'Preview mode: services are locked.',
      devMode: 'Developer mode',
      asideNote: 'Single universe',
    },
    accessibility: {
      themeToggle: 'Toggle theme',
      languageToggle: 'Change language',
      primaryNav: 'Primary navigation',
      mobileNav: 'Mobile navigation',
      dialogClose: 'Close dialog',
      backToTop: 'Back to top',
    },
    badges: {
      homePortal: 'Home Portal',
      publicPreview: 'Public Preview',
    },
    tailnet: {
      reachable: 'Tailnet reachable',
      offline: 'Tailnet offline',
      connecting: 'Connecting',
      devMode: 'Developer mode',
      retry: 'Retry',
      connectedNote: 'Connected to your tailnet stack.',
      lockedNote: 'Locked shell. Tailnet access required.',
    },
    services: {
      title: 'Services',
      description: 'Jump into your media stack without leaving the portal.',
      focusHint: 'Focus mode keeps the dashboard present.',
      latency: 'Latency',
      open: 'Open',
      newTab: 'New tab',
      copyLink: 'Copy link',
      restart: 'Restart',
      restartPending: 'Restarting',
      restartQueued: 'Queued',
      restartUnavailable: 'Unavailable',
      statusOnline: 'Online',
      statusOffline: 'Offline',
      statusChecking: 'Checking',
      statusLocked: 'Locked',
      overlayHint: 'Opens inside focus mode.',
      newTabHint: 'Opens in a new tab.',
      items: {
        jellyfin: 'Movies, shows, and personal media streaming.',
        radarr: 'Movie automation and library management.',
        sonarr: 'Series automation and episode tracking.',
        prowlarr: 'Indexer management and discovery hub.',
        bazarr: 'Subtitle management for your library.',
        qbittorrent: 'Download queue and torrent client.',
      },
    },
    shortcuts: {
      title: 'Quick Shortcuts',
      description: 'Common tasks in one panel.',
      searchTitle: 'Search',
      searchDesc: 'Radarr/Sonarr search coming soon.',
      searchPlaceholder: 'Search for a movie or series...',
      searchMovies: 'Search movies',
      searchSeries: 'Search series',
      searchButton: 'Search',
      resultsTitle: 'Results',
      resultsEmpty: 'No results found.',
      addButton: 'Add',
      actionsTitle: 'Quick Actions',
      actionsDesc: 'Service tasks will be enabled soon.',
      actionSync: 'Sync',
      actionRescan: 'Rescan',
      actionTest: 'Test',
      comingSoon: 'Coming soon',
      errorInvalid: 'Search cannot be empty.',
      errorUnavailable: 'Not available outside the tailnet.',
      errorForbidden: 'You do not have permission.',
      errorMissingKey: 'Missing API key.',
      errorMissingConfig: 'Missing profile or folder config.',
      errorUnknown: 'Search failed.',
    },
    search: {
      title: 'Global Search',
      description: 'Search across new requests and your library.',
      placeholder: 'Search movies, series, or your library...',
      cta: 'Search',
      resultsTitle: 'Results',
      resultsHint: 'Source · Status',
      idle: 'Start typing to search the library.',
      empty: 'No results found.',
      badgeDownloaded: 'Downloaded',
      badgeNew: 'New',
      kindMovie: 'Movie',
      kindSeries: 'Series',
      playCta: 'Play',
      addCta: 'Add',
    },
    library: {
      title: 'Library',
      description: 'Browse downloaded content in rows.',
      loading: '',
    },
    games: {
      title: 'Games Lounge',
      description: 'Play a quick game while you wait.',
      cta: 'All games',
      nowPlaying: 'Now playing',
      collectionTitle: 'Library',
      collectionDesc: 'Pick a game to spotlight.',
      play: 'Play',
      playAgain: 'Play again',
      comingSoon: 'Coming soon',
      liveLabel: 'Live',
      score: 'Score',
      timeLeft: 'Time left',
      orbChaseTitle: 'Orb Chase',
      orbChaseHint: 'Tap the glowing orb and score before the timer ends.',
      playsLabel: 'Plays',
      topScoreLabel: 'Top score',
    },
    system: {
      title: 'System status',
      description: 'Live health overview from the home server.',
      updatedLabel: 'Updated',
      vitalsTitle: 'Vitals',
      vitalsDesc: 'CPU, memory, disk, and uptime.',
      loadAvg: 'Load avg (1/5/15)',
      memory: 'Memory',
      disk: 'Disk usage',
      uptime: 'Uptime',
      temperature: 'Temperature',
      quickTitle: 'Quick status',
      quickDesc: 'Service health snapshot.',
    },
    settings: {
      title: 'Settings',
      description: 'Manage portal preferences.',
      comingSoon: 'Coming soon',
    },
    board: {
      title: 'Family message board',
      description: 'Leave quick notes inside the home portal.',
      tailnetOnly: 'Tailnet only',
      recentTitle: 'Recent notes',
      recentDesc: 'Latest 50 messages.',
      filterLabel: 'Filter',
      filterPlaceholder: 'Search name or message...',
      sortNewest: 'Newest first',
      sortOldest: 'Oldest first',
      dateFromLabel: 'From date',
      dateToLabel: 'To date',
      clearFilters: 'Clear filters',
      emptyFiltered: 'No messages match the filters.',
      empty: 'No notes yet. Be the first to post.',
      postTitle: 'Post a note',
      postDesc: 'Keep it short and sweet.',
      nameLabel: 'Name',
      messageLabel: 'Message',
      namePlaceholder: 'Someone at home',
      messagePlaceholder: 'Movie night at 21:30!',
      postButton: 'Post message',
      charCount: 'Characters',
      errorInvalid: 'Message is invalid.',
      errorRate: 'You are posting too fast.',
      errorGeneric: 'Unable to post right now.',
    },
    focus: {
      label: 'Focus mode',
      openInTab: 'Open in tab',
      close: 'Close',
      frameTitleSuffix: 'panel',
    },
    gate: {
      title: 'Tailnet Gate',
      connected: 'Tailnet connected',
      waiting: 'Waiting for tailnet',
      connecting: 'Connecting to tailnet',
      publicDescription:
        'Enable Tailscale and connect to your tailnet to unlock the home portal.',
      homeDescription:
        'The portal is running locally. Connect to tailnet for embedded apps.',
      enter: 'Enter Home Portal',
      waitingLabel: 'Waiting for tailnet',
      connectingLabel: 'Connecting',
    },
    command: {
      placeholder: 'Search services...',
      empty: 'No matches found.',
      groupServices: 'Services',
    },
    chat: {
      title: 'Home Assistant',
      description: 'Ask questions, control your system.',
      welcome:
        "Hello! I'm your home assistant. I can check server status, search for movies, get weather info, or manage services. How can I help you?",
      placeholder: 'Type a message...',
      send: 'Send',
      thinking: 'Thinking...',
      suggestions: {
        serverStatus: 'Server status',
        downloads: 'Downloads',
        newMovies: 'New movies',
        weather: 'Weather',
        searchMedia: 'Search media',
        quickActions: 'Quick actions',
      },
      actions: {
        restart: 'Restart',
        shutdown: 'Shutdown',
        checkServices: 'Check services',
        viewDownloads: 'View downloads',
        searchMovie: 'Search movie',
        addMovie: 'Add movie',
      },
      errors: {
        generic: 'An error occurred. Please try again.',
        offline: 'Could not connect to server.',
        apiError: 'API error. Check services.',
      },
    },
    toasts: {
      dismiss: 'Dismiss',
      tailnetOnline: {
        title: 'Tailnet connected',
        description: 'Home portal is ready.',
      },
      tailnetOffline: {
        title: 'Tailnet offline',
        description: 'Enable Tailscale and try again.',
      },
      tailnetConnecting: {
        title: 'Connecting',
        description: 'Checking tailnet status.',
      },
      boardSuccess: {
        title: 'Message posted',
        description: 'Board updated.',
      },
      boardError: {
        title: 'Message failed',
        description: 'Please try again.',
      },
      boardRate: {
        title: 'Too fast',
        description: 'Slow down and try again.',
      },
      boardUnavailable: {
        title: 'Tailnet only',
        description: 'Board is available on the home network.',
      },
      restartQueued: {
        title: 'Restart queued',
        description: 'Service will restart soon.',
      },
      restartUnavailable: {
        title: 'Restart unavailable',
        description: 'Not supported for this service.',
      },
      shortcutAdded: {
        title: 'Request queued',
        description: 'The service received the add request.',
      },
      shortcutFailed: {
        title: 'Action failed',
        description: 'Try again or check the service.',
      },
      shortcutMissingConfig: {
        title: 'Missing config',
        description: 'Set a profile and root folder first.',
      },
      shortcutMissingKey: {
        title: 'Missing API key',
        description: 'Add the Radarr/Sonarr API key.',
      },
      shortcutUnavailable: {
        title: 'Action locked',
        description: 'Only authorized users can run this.',
      },
    },
    misc: {
      updated: 'Updated',
      na: 'n/a',
      tailnetOnly: 'Tailnet only',
    },
    footer: {
      onlineNow: 'Online now',
      peakOnline: 'Peak online',
    },
    errors: {
      title: 'Something went wrong',
      description:
        'The portal hit an unexpected error. Try again or refresh the page.',
      retry: 'Try again',
    },
    notFound: {
      title: 'Page not found',
      description: 'The page you are looking for does not exist or moved.',
      action: 'Back to home',
    },
    http: {
      title: 'HTTPS required',
      description: 'Use HTTPS for a secure connection. Redirecting now.',
      action: 'Go to HTTPS',
    },
    time: {
      justNow: 'just now',
      minutesAgo: '{count}m ago',
      hoursAgo: '{count}h ago',
      daysAgo: '{count}d ago',
      minuteShort: 'm',
      hourShort: 'h',
      dayShort: 'd',
    },
    forbidden: {
      title: 'Access denied',
      description: 'You do not have access to this page.',
      action: 'Back to home',
    },
  },
  it: {
    nav: {
      dashboard: 'Dashboard',
      search: 'Ricerca',
      library: 'Libreria',
      games: 'Giochi',
      shortcuts: 'Scorciatoie',
      services: 'Servizi',
      system: 'Sistema',
      board: 'Bacheca',
      settings: 'Impostazioni',
      chat: 'Chat',
    },
    header: {
      kicker: 'Home Media Portal',
      title: 'Home Media Portal',
      subtitle: 'Un unico universo per i tuoi servizi media',
      search: 'Cerca',
      searchHint: 'Cmd+K',
      liveNote: 'I servizi live girano dentro il portale.',
      previewNote: 'Modalita anteprima: servizi bloccati.',
      devMode: 'Modalita sviluppatore',
      asideNote: 'Universo unico',
    },
    accessibility: {
      themeToggle: 'Cambia tema',
      languageToggle: 'Cambia lingua',
      primaryNav: 'Navigazione principale',
      mobileNav: 'Navigazione mobile',
      dialogClose: 'Chiudi finestra',
      backToTop: 'Torna su',
    },
    badges: {
      homePortal: 'Portale Casa',
      publicPreview: 'Anteprima Pubblica',
    },
    tailnet: {
      reachable: 'Tailnet raggiungibile',
      offline: 'Tailnet offline',
      connecting: 'Connessione',
      devMode: 'Modalita sviluppatore',
      retry: 'Riprova',
      connectedNote: 'Connesso alla tua tailnet.',
      lockedNote: 'Shell bloccata. Serve accesso tailnet.',
    },
    services: {
      title: 'Servizi',
      description: 'Entra nel tuo stack media senza uscire dal portale.',
      focusHint: 'La modalita focus mantiene visibile la dashboard.',
      latency: 'Latenza',
      open: 'Apri',
      newTab: 'Nuova scheda',
      copyLink: 'Copia link',
      restart: 'Riavvia',
      restartPending: 'Riavvio',
      restartQueued: 'In coda',
      restartUnavailable: 'Non disponibile',
      statusOnline: 'Online',
      statusOffline: 'Offline',
      statusChecking: 'Controllo',
      statusLocked: 'Bloccato',
      overlayHint: 'Si apre in modalita focus.',
      newTabHint: 'Si apre in una nuova scheda.',
      items: {
        jellyfin: 'Film, serie e streaming media personale.',
        radarr: 'Automazione film e gestione libreria.',
        sonarr: 'Automazione serie e tracciamento episodi.',
        prowlarr: 'Gestione indexer e hub di scoperta.',
        bazarr: 'Gestione sottotitoli per la libreria.',
        qbittorrent: 'Coda download e client torrent.',
      },
    },
    shortcuts: {
      title: 'Scorciatoie',
      description: 'Azioni frequenti in un solo pannello.',
      searchTitle: 'Ricerca',
      searchDesc: 'Ricerca Radarr/Sonarr in arrivo.',
      searchPlaceholder: 'Cerca un film o una serie...',
      searchMovies: 'Cerca film',
      searchSeries: 'Cerca serie',
      searchButton: 'Cerca',
      resultsTitle: 'Risultati',
      resultsEmpty: 'Nessun risultato.',
      addButton: 'Aggiungi',
      actionsTitle: 'Azioni rapide',
      actionsDesc: 'Le azioni dei servizi saranno disponibili a breve.',
      actionSync: 'Sincronizza',
      actionRescan: 'Scansiona',
      actionTest: 'Test',
      comingSoon: 'In arrivo',
      errorInvalid: 'La ricerca non puo essere vuota.',
      errorUnavailable: 'Non disponibile fuori dal tailnet.',
      errorForbidden: 'Non hai i permessi.',
      errorMissingKey: 'API key mancante.',
      errorMissingConfig: 'Profilo o cartella mancanti.',
      errorUnknown: 'Ricerca non riuscita.',
    },
    search: {
      title: 'Ricerca globale',
      description: 'Cerca tra nuove richieste e libreria.',
      placeholder: 'Cerca film, serie o libreria...',
      cta: 'Cerca',
      resultsTitle: 'Risultati',
      resultsHint: 'Fonte · Stato',
      empty: 'Nessun risultato.',
      badgeDownloaded: 'Scaricato',
      badgeNew: 'Nuovo',
      kindMovie: 'Film',
      kindSeries: 'Serie',
      playCta: 'Riproduci',
      addCta: 'Aggiungi',
      idle: '',
    },
    library: {
      title: 'Libreria',
      description: 'Sfoglia i contenuti scaricati per righe.',
      loading: '',
    },
    games: {
      title: 'Angolo Giochi',
      description: 'Gioca mentre aspetti.',
      cta: 'Tutti i giochi',
      nowPlaying: 'In primo piano',
      collectionTitle: 'Collezione',
      collectionDesc: 'Scegli un gioco.',
      play: 'Gioca',
      playAgain: 'Gioca di nuovo',
      comingSoon: 'In arrivo',
      liveLabel: 'Live',
      score: 'Punteggio',
      timeLeft: 'Tempo',
      orbChaseTitle: "Caccia all'Orb",
      orbChaseHint: "Tocca l'orb brillante prima che scada il tempo.",
      playsLabel: 'Partite',
      topScoreLabel: 'Punteggio massimo',
    },
    system: {
      title: 'Stato sistema',
      description: 'Panoramica live dal server di casa.',
      updatedLabel: 'Aggiornato',
      vitalsTitle: 'Parametri',
      vitalsDesc: 'CPU, memoria, disco e uptime.',
      loadAvg: 'Carico medio (1/5/15)',
      memory: 'Memoria',
      disk: 'Uso disco',
      uptime: 'Uptime',
      temperature: 'Temperatura',
      quickTitle: 'Stato rapido',
      quickDesc: 'Snapshot salute servizi.',
    },
    settings: {
      title: 'Impostazioni',
      description: 'Gestisci le preferenze del portale.',
      comingSoon: 'In arrivo',
    },
    board: {
      title: 'Bacheca di famiglia',
      description: 'Lascia note rapide nel portale di casa.',
      tailnetOnly: 'Solo tailnet',
      recentTitle: 'Note recenti',
      recentDesc: 'Ultimi 50 messaggi.',
      filterLabel: 'Filtro',
      filterPlaceholder: 'Cerca nome o messaggio...',
      sortNewest: 'Piu recenti',
      sortOldest: 'Piu vecchi',
      dateFromLabel: 'Data inizio',
      dateToLabel: 'Data fine',
      clearFilters: 'Rimuovi filtri',
      emptyFiltered: 'Nessun messaggio corrisponde ai filtri.',
      empty: 'Nessuna nota. Pubblica la prima.',
      postTitle: 'Pubblica una nota',
      postDesc: 'Breve e chiaro.',
      nameLabel: 'Nome',
      messageLabel: 'Messaggio',
      namePlaceholder: 'Qualcuno a casa',
      messagePlaceholder: 'Serata film alle 21:30!',
      postButton: 'Invia messaggio',
      charCount: 'Caratteri',
      errorInvalid: 'Messaggio non valido.',
      errorRate: 'Stai inviando troppo in fretta.',
      errorGeneric: 'Impossibile inviare ora.',
    },
    focus: {
      label: 'Modalita focus',
      openInTab: 'Apri in scheda',
      close: 'Chiudi',
      frameTitleSuffix: 'pannello',
    },
    gate: {
      title: 'Porta Tailnet',
      connected: 'Tailnet connessa',
      waiting: 'In attesa della tailnet',
      connecting: 'Connessione alla tailnet',
      publicDescription:
        'Attiva Tailscale e connettiti alla tailnet per sbloccare il portale di casa.',
      homeDescription:
        'Il portale e locale. Connettiti alla tailnet per le app integrate.',
      enter: 'Entra nel Portale',
      waitingLabel: 'In attesa',
      connectingLabel: 'Connessione',
    },
    command: {
      placeholder: 'Cerca servizi...',
      empty: 'Nessun risultato.',
      groupServices: 'Servizi',
    },
    chat: {
      title: 'Assistente Casa',
      description: 'Fai domande, controlla il sistema.',
      welcome:
        'Ciao! Sono il tuo assistente di casa. Posso controllare lo stato del server, cercare film, informazioni sul meteo o gestire i servizi. Come posso aiutarti?',
      placeholder: 'Scrivi un messaggio...',
      send: 'Invia',
      thinking: 'Sto pensando...',
      suggestions: {
        serverStatus: 'Stato server',
        downloads: 'Download',
        newMovies: 'Nuovi film',
        weather: 'Meteo',
        searchMedia: 'Cerca media',
        quickActions: 'Azioni rapide',
      },
      actions: {
        restart: 'Riavvia',
        shutdown: 'Spegni',
        checkServices: 'Controlla servizi',
        viewDownloads: 'Vedi download',
        searchMovie: 'Cerca film',
        addMovie: 'Aggiungi film',
      },
      errors: {
        generic: 'Si e verificato un errore. Riprova.',
        offline: 'Impossibile connettersi al server.',
        apiError: 'Errore API. Controlla i servizi.',
      },
    },
    toasts: {
      dismiss: 'Chiudi',
      tailnetOnline: {
        title: 'Tailnet connesso',
        description: 'Il portale di casa e pronto.',
      },
      tailnetOffline: {
        title: 'Tailnet offline',
        description: 'Attiva Tailscale e riprova.',
      },
      tailnetConnecting: {
        title: 'Connessione',
        description: 'Controllo stato tailnet.',
      },
      boardSuccess: {
        title: 'Messaggio inviato',
        description: 'Bacheca aggiornata.',
      },
      boardError: {
        title: 'Invio fallito',
        description: 'Riprova.',
      },
      boardRate: {
        title: 'Troppo veloce',
        description: 'Aspetta e riprova.',
      },
      boardUnavailable: {
        title: 'Solo tailnet',
        description: 'Disponibile solo in rete locale.',
      },
      restartQueued: {
        title: 'Riavvio in coda',
        description: 'Il servizio si riavviera presto.',
      },
      restartUnavailable: {
        title: 'Riavvio non disponibile',
        description: 'Non supportato per questo servizio.',
      },
      shortcutAdded: {
        title: 'Richiesta inviata',
        description: 'Il servizio ha ricevuto la richiesta.',
      },
      shortcutFailed: {
        title: 'Azione fallita',
        description: 'Riprova o controlla il servizio.',
      },
      shortcutMissingConfig: {
        title: 'Configurazione mancante',
        description: 'Imposta profilo e cartella.',
      },
      shortcutMissingKey: {
        title: 'API key mancante',
        description: 'Aggiungi la API key di Radarr/Sonarr.',
      },
      shortcutUnavailable: {
        title: 'Azione bloccata',
        description: 'Solo utenti autorizzati.',
      },
    },
    misc: {
      updated: 'Aggiornato',
      na: 'n/d',
      tailnetOnly: 'Solo tailnet',
    },
    footer: {
      onlineNow: 'Online ora',
      peakOnline: 'Picco online',
    },
    errors: {
      title: 'Si e verificato un errore',
      description:
        'Il portale ha riscontrato un errore inatteso. Riprova o aggiorna la pagina.',
      retry: 'Riprova',
    },
    notFound: {
      title: 'Pagina non trovata',
      description: 'La pagina richiesta non esiste o e stata spostata.',
      action: 'Torna alla home',
    },
    http: {
      title: 'HTTPS necessario',
      description:
        'Usa HTTPS per una connessione sicura. Reindirizzamento in corso.',
      action: 'Vai a HTTPS',
    },
    time: {
      justNow: 'proprio ora',
      minutesAgo: '{count} min fa',
      hoursAgo: '{count} h fa',
      daysAgo: '{count} g fa',
      minuteShort: 'min',
      hourShort: 'h',
      dayShort: 'g',
    },
    forbidden: {
      title: 'Accesso negato',
      description: 'Non hai accesso a questa pagina.',
      action: 'Torna alla home',
    },
  },
};

// Pull potential locales from an Accept-Language header.
const parseAcceptLanguage = (header?: string) =>
  header
    ? header
        .split(',')
        .map((part) => part.trim().split(';')[0])
        .filter(Boolean)
        .map((part) => part.toLowerCase())
    : [];

// Normalize a locale string to a supported locale.
export const resolveLocale = (
  value?: string,
  acceptLanguage?: string,
): Locale => {
  if (value) {
    const normalized = value.toLowerCase();
    if (locales.includes(normalized as Locale)) {
      return normalized as Locale;
    }
  }

  for (const candidate of parseAcceptLanguage(acceptLanguage)) {
    const base = candidate.split('-')[0];
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
