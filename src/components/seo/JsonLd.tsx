type JsonLdProps = {
  data:
    | Record<string, unknown>
    | Array<Record<string, unknown> | null | undefined>
    | null
    | undefined;
};

export function JsonLd({ data }: JsonLdProps) {
  if (!data) return null;
  const raw = Array.isArray(data) ? data : [data];
  const items = raw.filter(
    (item): item is Record<string, unknown> =>
      item != null && typeof item === "object"
  );
  if (!items.length) return null;
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
