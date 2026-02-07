// Game metadata for the portal games section.
export type GameRuntime = 'inline' | 'iframe' | 'wasm';
export type GameStatus = 'live' | 'coming_soon';

export type WasmConfig = {
  romUrl?: string;
  startupScript?: string;
  cpu?: string;
  ram?: number;
  harddrive?: string;
  gameId?: string;
};

export type GameDefinition = {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  runtime: GameRuntime;
  status: GameStatus;
  launchUrl?: string;
  tags?: string[];
  wasmConfig?: WasmConfig;
};

const normalizeValue = (value?: string) => {
  const trimmed = value?.trim();
  return trimmed || undefined;
};

const parsePositiveInt = (value?: string) => {
  if (!value) {
    return undefined;
  }
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? Math.floor(num) : undefined;
};

const compactWasmConfig = (config: WasmConfig) => {
  const normalized: WasmConfig = {
    romUrl: normalizeValue(config.romUrl),
    startupScript: normalizeValue(config.startupScript),
    cpu: normalizeValue(config.cpu),
    ram:
      typeof config.ram === 'number' && Number.isFinite(config.ram)
        ? Math.floor(config.ram)
        : undefined,
    harddrive: normalizeValue(config.harddrive),
    gameId: normalizeValue(config.gameId),
  };
  const hasValue = Object.values(normalized).some(
    (value) => value !== undefined,
  );
  return hasValue ? normalized : undefined;
};

const retroEngineWasmConfig = compactWasmConfig({
  romUrl: process.env.NEXT_PUBLIC_RETRO_DOCK_ROM_URL,
  startupScript: process.env.NEXT_PUBLIC_RETRO_DOCK_STARTUP,
  cpu: process.env.NEXT_PUBLIC_RETRO_DOCK_CPU,
  ram: parsePositiveInt(process.env.NEXT_PUBLIC_RETRO_DOCK_RAM),
  harddrive: process.env.NEXT_PUBLIC_RETRO_DOCK_HDD,
  gameId: process.env.NEXT_PUBLIC_RETRO_DOCK_GAME,
});

// Static games catalog for the portal UI.
export const games: GameDefinition[] = [
  {
    id: 'orb-chase',
    title: 'Orb Chase',
    description: 'A quick reflex game to warm up while the portal connects.',
    coverImage:
      'radial-gradient(circle at top, rgba(47, 109, 246, 0.45), transparent 70%)',
    runtime: 'inline',
    status: 'live',
    tags: ['arcade', 'quick'],
  },
  {
    id: 'retro-engine',
    title: 'Retro Engine',
    description: 'Boot into the retro engine. WASM powered runtime.',
    coverImage: "url('/wasm/engine/github_logo.png')",
    runtime: 'wasm',
    status: 'live',
    launchUrl: '/wasm/engine/index.html',
    wasmConfig: retroEngineWasmConfig,
    tags: ['retro', 'wasm'],
  },
  {
    id: 'nebula-shift',
    title: 'Nebula Shift',
    description: 'Drift through the nebula lanes. Coming soon.',
    coverImage:
      'radial-gradient(circle at top, rgba(251, 113, 133, 0.35), transparent 70%)',
    runtime: 'iframe',
    status: 'coming_soon',
    tags: ['runner'],
  },
  {
    id: 'signal-quest',
    title: 'Signal Quest',
    description: 'Solve fast puzzles to keep the array online.',
    coverImage:
      'radial-gradient(circle at top, rgba(34, 197, 94, 0.35), transparent 70%)',
    runtime: 'iframe',
    status: 'coming_soon',
    tags: ['puzzle'],
  },
];

// Find a game by id.
export const getGameById = (id: string | null) =>
  games.find((game) => game.id === id);

// Resolve the launch URL for a game, including wasm query parameters when present.
export const getGameLaunchUrl = (game: GameDefinition) => {
  if (!game.launchUrl) {
    return undefined;
  }

  if (game.runtime !== 'wasm' || !game.wasmConfig) {
    return game.launchUrl;
  }

  const url = new URL(game.launchUrl, 'http://portal.local');
  url.searchParams.set('title', game.title);

  const { romUrl, startupScript, cpu, ram, harddrive, gameId } =
    game.wasmConfig;
  if (gameId) {
    url.searchParams.set('game', gameId);
  }
  if (romUrl) {
    url.searchParams.set('rom', romUrl);
  }
  if (startupScript) {
    url.searchParams.set('startup', startupScript);
  }
  if (cpu) {
    url.searchParams.set('cpu', cpu);
  }
  if (typeof ram === 'number' && Number.isFinite(ram)) {
    url.searchParams.set('ram', String(ram));
  }
  if (harddrive) {
    url.searchParams.set('hdd', harddrive);
  }

  return `${url.pathname}${url.search}`;
};
