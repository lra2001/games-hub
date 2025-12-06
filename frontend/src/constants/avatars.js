export const AVATARS = [
  { id: "avatar1", src: "/avatars/ninja.png", label: "Ninja" },
  { id: "avatar2", src: "/avatars/gorilla.png", label: "Gorilla" },
  { id: "avatar3", src: "/avatars/astronaut.png", label: "Astronaut" },
  { id: "avatar4", src: "/avatars/cow.png", label: "Cow" },
  { id: "avatar5", src: "/avatars/redpanda.png", label: "Red Panda" },
];

// Helper map: id -> avatar object
export const AVATAR_MAP = AVATARS.reduce((map, avatar) => {
  map[avatar.id] = avatar;
  return map;
}, {});