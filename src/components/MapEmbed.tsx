interface MapEmbedProps {
  query: string;
  label: string;
}

export default function MapEmbed({ query, label }: MapEmbedProps) {
  const encoded = encodeURIComponent(query);
  const embedSrc = `https://maps.google.com/maps?q=${encoded}&output=embed&hl=ja&z=14`;
  const linkHref = `https://maps.google.com/maps?q=${encoded}`;

  return (
    <section className="rounded-2xl border border-stone-100 bg-white overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
        <h2 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-400">
          <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
            <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
          </svg>
          地図
        </h2>
        <a
          href={linkHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs font-medium text-green-700 hover:text-green-800"
        >
          Google マップで開く
          <svg viewBox="0 0 16 16" className="h-3 w-3 fill-current" aria-hidden="true">
            <path d="M6.22 8.72a.75.75 0 001.06 1.06l5.22-5.22v1.69a.75.75 0 001.5 0v-3.5a.75.75 0 00-.75-.75h-3.5a.75.75 0 000 1.5h1.69L6.22 8.72z" />
            <path d="M3.5 6.75c0-.69.56-1.25 1.25-1.25H7A.75.75 0 007 4H4.75A2.75 2.75 0 002 6.75v4.5A2.75 2.75 0 004.75 14h4.5A2.75 2.75 0 0012 11.25V9a.75.75 0 00-1.5 0v2.25c0 .69-.56 1.25-1.25 1.25h-4.5c-.69 0-1.25-.56-1.25-1.25v-4.5z" />
          </svg>
        </a>
      </div>

      {/* aspect-[4/3]: 幅に比例した高さで スマホ・PC 両対応 */}
      <div className="relative w-full aspect-[4/3]">
        <iframe
          src={embedSrc}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`${label}の地図`}
          aria-label={`${label}の地図`}
        />
      </div>
    </section>
  );
}
