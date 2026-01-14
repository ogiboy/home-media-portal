// Library data types for upcoming Jellyfin integrations.
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

// Populated by the Jellyfin integration once available.
export const libraryRows: LibraryRow[] = [];
