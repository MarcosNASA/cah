export const slugify = (string: string) =>
  string
    .split(" ")
    .flatMap((word) => (word ? [word.trim()] : []))
    .join("-");
