export function filterByGenre(genreFilter, game) {
  if (genreFilter === "all") return true;

  return (game.genres || []).some(
    (genre) => String(genre.id) === String(genreFilter)
  );
}

export function filterByPlatform(platformFilter, game) {
  if (platformFilter === "all") return true;

  const targetId = Number(platformFilter);
  return (game.platforms || []).some((p) => {
    const platform = p.platform || p;
    return platform && platform.id === targetId;
  });
}

export function filterByRating(ratingFilter, game) {
  const r = game.rating ?? 0;

  switch (ratingFilter) {
    case "all":
      return true;
    case "5":
      return r === 5;
    case "4-5":
      return r >= 4 && r < 5;
    case "3-4":
      return r >= 3 && r < 4;
    case "2-3":
      return r >= 2 && r < 3;
    case "0-2":
      return r < 2;
    default:
      return true;
  }
}

export function buildPlatformOptions(games) {
  const map = new Map();

  games.forEach((g) => {
    (g.platforms || []).forEach((p) => {
      const platform = p.platform || p;
      if (platform && !map.has(platform.id)) {
        map.set(platform.id, platform.name);
      }
    });
  });
  return Array.from(map.entries())
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function buildGenreOptions(games) {
  const map = new Map();

  games.forEach((g) => {
    (g.genres || []).forEach((genre) => {
      if (genre && !map.has(genre.id)) {
        map.set(genre.id, genre.name);
      }
    });
  });

  return Array.from(map.entries())
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}