(function () {
  window.DOSWASMSETTINGS = {
    CLOUDSAVEURL: '',
    DEFAULTIMG: '',
  };

  const loadScript = (src) =>
    new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(script);
    });

  const updateProgress = (loaded, total) => {
    const bar = document.getElementById('myProgress');
    if (!bar) return;
    const percent = total > 0 ? Math.round((loaded / total) * 100) : 0;
    bar.style.width = `${percent}%`;
    bar.textContent = `${percent}%`;
  };

  const fetchManifest = async () => {
    try {
      const res = await fetch('/wasm/manifest.json', { cache: 'no-store' });
      if (!res.ok) return null;
      return await res.json();
    } catch (error) {
      console.warn('Manifest load failed', error);
      return null;
    }
  };

  const waitForAppReady = async () => {
    const start = Date.now();
    return new Promise((resolve, reject) => {
      const tick = () => {
        if (window.myApp && window.myApp.rivetsData) {
          if (!window.myApp.rivetsData.moduleInitializing) {
            resolve(window.myApp);
            return;
          }
        }
        if (Date.now() - start > 20000) {
          reject(new Error('WASM engine did not initialize in time.'));
          return;
        }
        setTimeout(tick, 120);
      };
      tick();
    });
  };

  const normalizePath = (path) =>
    path.startsWith('/') ? path.slice(1) : path;

  const basename = (path) => path.split('/').pop() || path;

  const bootGame = async (game) => {
    const app = window.myApp;
    if (!app || !game) return;

    app.Run();

    if (game.startupScript) {
      const normalized = game.startupScript.replace(/;/g, '\n').trim();
      app.configuration.startupScript = normalized.endsWith('\n')
        ? normalized
        : `${normalized}\n`;
    }
    if (game.cpu) {
      app.rivetsData.cpu = game.cpu;
    }
    if (game.ram) {
      app.ram = Number(game.ram);
    }
    if (game.harddrive) {
      app.initialHardDrive = game.harddrive;
    }

    const files = Array.isArray(game.files) ? game.files : [];
    const total = files.length;
    let loaded = 0;

    app.multiFiles = [];

    for (const filePath of files) {
      const target = `/wasm/${normalizePath(filePath)}`;
      const response = await fetch(target);
      if (!response.ok) {
        throw new Error(`Failed to load ${target}`);
      }
      const buffer = await response.arrayBuffer();
      app.multiFiles.push({
        name: basename(filePath),
        data: new Uint8Array(buffer),
      });
      loaded += 1;
      updateProgress(loaded, total);
    }

    updateProgress(total, total);
    app.parseMultipleFiles();

    const panel = document.getElementById('topPanel');
    if (panel) {
      panel.classList.add('hidden');
    }
    document.body.classList.add('game-ready');
  };

  const run = async () => {
    const manifest = await fetchManifest();
    if (manifest?.games) {
      window.ROMLIST = manifest.games;
    } else {
      window.ROMLIST = window.ROMLIST || [];
    }
    window.PORTAL_MANIFEST = manifest || null;

    await loadScript(`script.js?v=${Date.now()}`);

    await waitForAppReady();

    const params = new URLSearchParams(window.location.search);
    const gameId = params.get('game') || manifest?.defaultGame || null;
    const list = manifest?.games || window.ROMLIST || [];
    const selected = list.find((game) => game.id === gameId) || list[0];

    if (!selected) {
      console.warn('No game found in manifest.');
      return;
    }

    try {
      await bootGame(selected);
    } catch (error) {
      console.error('Game boot failed', error);
      const panel = document.getElementById('topPanel');
      if (panel) {
        panel.classList.remove('hidden');
        panel.innerHTML = `<div style=\"font-weight:600;font-size:16px\">Failed to boot game</div><div style=\"font-size:13px;opacity:.7\">${String(
          error?.message || error,
        )}</div>`;
      }
    }
  };

  run();
})();
