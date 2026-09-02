import Link from 'next/link';

type Crumb = {
  href: string;
  label: string;
};

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    // The navigation is `fixed`, so it takes no space in the flow: this strip is
    // the first element on the page and has to clear the bar itself.
    <nav
      aria-label="Breadcrumb"
      className="px-4 pb-1 pt-20 sm:px-6 sm:pt-24 md:px-12 lg:pt-28"
    >
      <ol className="max-w-7xl mx-auto flex flex-wrap items-center gap-2 text-sm text-black/60">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={`${item.href}-${idx}`} className="flex items-center gap-2">
              {idx > 0 ? <span className="text-black/30">/</span> : null}
              {isLast ? (
                <span aria-current="page" className="text-black/80">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-black transition-colors">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

