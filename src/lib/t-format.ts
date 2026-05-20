export function tFormat(
  t: (key: string) => string,
  key: string,
  vars: Record<string, string>
): string {
  let s = t(key);
  for (const [k, v] of Object.entries(vars)) {
    s = s.replaceAll(`{${k}}`, v);
  }
  return s;
}
