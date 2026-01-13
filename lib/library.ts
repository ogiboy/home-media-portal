// Dummy library rows for the dashboard preview.
export type LibraryItem = {
  id: string;
  title: string;
  subtitle?: string;
  coverImage: string;
};

export type LibraryRow = {
  id: string;
  title: string;
  items: LibraryItem[];
};

const makeCover = (color: string) =>
  `radial-gradient(circle at top, ${color}, transparent 70%)`;

export const libraryRows: LibraryRow[] = [
  {
    id: 'recent',
    title: 'Recently Added',
    items: [
      { id: 'r1', title: 'The Martian', subtitle: 'Movie', coverImage: makeCover('rgba(56, 189, 248, 0.5)') },
      { id: 'r2', title: 'Foundation', subtitle: 'Series', coverImage: makeCover('rgba(251, 113, 133, 0.5)') },
      { id: 'r3', title: 'Arrival', subtitle: 'Movie', coverImage: makeCover('rgba(34, 197, 94, 0.45)') },
      { id: 'r4', title: 'Andor', subtitle: 'Series', coverImage: makeCover('rgba(148, 163, 184, 0.5)') },
      { id: 'r5', title: 'Dune', subtitle: 'Movie', coverImage: makeCover('rgba(234, 179, 8, 0.5)') },
    ],
  },
  {
    id: 'movies',
    title: 'Movies',
    items: [
      { id: 'm1', title: 'Interstellar', subtitle: 'Movie', coverImage: makeCover('rgba(47, 109, 246, 0.5)') },
      { id: 'm2', title: 'Blade Runner 2049', subtitle: 'Movie', coverImage: makeCover('rgba(251, 113, 133, 0.4)') },
      { id: 'm3', title: 'Tenet', subtitle: 'Movie', coverImage: makeCover('rgba(59, 130, 246, 0.45)') },
      { id: 'm4', title: 'Arrival', subtitle: 'Movie', coverImage: makeCover('rgba(99, 102, 241, 0.45)') },
    ],
  },
  {
    id: 'series',
    title: 'Series',
    items: [
      { id: 's1', title: 'Dark', subtitle: 'Series', coverImage: makeCover('rgba(34, 197, 94, 0.45)') },
      { id: 's2', title: 'Severance', subtitle: 'Series', coverImage: makeCover('rgba(14, 116, 144, 0.45)') },
      { id: 's3', title: 'The Expanse', subtitle: 'Series', coverImage: makeCover('rgba(168, 85, 247, 0.45)') },
      { id: 's4', title: 'Silo', subtitle: 'Series', coverImage: makeCover('rgba(59, 130, 246, 0.45)') },
    ],
  },
  {
    id: 'turkish-subbed',
    title: 'Turkish Subbed',
    items: [
      { id: 't1', title: 'Succession', subtitle: 'Series', coverImage: makeCover('rgba(251, 146, 60, 0.45)') },
      { id: 't2', title: 'The Bear', subtitle: 'Series', coverImage: makeCover('rgba(14, 165, 233, 0.45)') },
      { id: 't3', title: 'Mindhunter', subtitle: 'Series', coverImage: makeCover('rgba(94, 234, 212, 0.45)') },
    ],
  },
];
