/* tiny classnames joiner */
export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter((part): part is string => Boolean(part)).join(' ')
}
