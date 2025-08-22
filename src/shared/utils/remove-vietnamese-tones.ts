export function removeVietnameseTones(str: string, replaceSpace = false): string {
  str = str.normalize("NFD").replace(/\u0300-\u036f/g, "");
  str = str.replace(/đ/g, "d").replace(/Đ/g, "D");
  str = str.replace(/ + /g, " ");
  str = str.trim();
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|=|<|>|\?|\/|,|\.|:|;|'|\"|&|#|\[|]|~|\$|_|`|-|{|}|\||\\/g,
    " ",
  );
  if (replaceSpace) str = str.replaceAll(" ", "_");
  return str;
}
