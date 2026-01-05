// Game metadata for the portal games section.
export type GameRuntime = 'inline' | 'iframe';
export type GameStatus = 'live' | 'coming_soon';

export type GameDefinition = {
  id: string;
  title: string;
  description: string;
  cover: string;
  runtime: GameRuntime;
  status: GameStatus;
  launchUrl?: string;
  tags?: string[];
};

// Static games catalog for the portal UI.
export const games: GameDefinition[] = [
  {
    id: 'orb-chase',
    title: 'Orb Chase',
    description: 'A quick reflex game to warm up while the portal connects.',
    cover:
      'radial-gradient(circle at top, rgba(47, 109, 246, 0.45), transparent 70%)',
    runtime: 'inline',
    status: 'live',
    tags: ['arcade', 'quick'],
  },
  {
    id: 'nebula-shift',
    title: 'Nebula Shift',
    description: 'Drift through the nebula lanes. Coming soon.',
    cover:
      'radial-gradient(circle at top, rgba(251, 113, 133, 0.35), transparent 70%)',
    runtime: 'iframe',
    status: 'coming_soon',
    tags: ['runner'],
  },
  {
    id: 'signal-quest',
    title: 'Signal Quest',
    description: 'Solve fast puzzles to keep the array online.',
    cover:
      'radial-gradient(circle at top, rgba(34, 197, 94, 0.35), transparent 70%)',
    runtime: 'iframe',
    status: 'coming_soon',
    tags: ['puzzle'],
  },
];

// Find a game by id.
export const getGameById = (id: string | null) =>
  games.find((game) => game.id === id);
