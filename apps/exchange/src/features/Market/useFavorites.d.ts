export interface UseFavoritesResult {
  favorites: Set<string>;
  isFavorite: (symbol: string) => boolean;
  toggleFavorite: (symbol: string) => void;
  isLoading: boolean;
}

export function useFavorites(): UseFavoritesResult;
