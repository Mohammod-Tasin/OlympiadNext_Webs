import Link from "next/link";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/guidelines", label: "Guidelines" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-olympiad-900 text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-bold">OlympiadNext</h3>
          <p className="mt-2 text-sm text-olympiad-50">
            Empowering students through competitive academic olympiads.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-olympiad-50">Quick Links</h4>
          <ul className="mt-3 flex flex-col gap-2">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-white/80 transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-olympiad-50">Contact</h4>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-white/80">
            <li>support@olympiadnext.com</li>
            <li>+1 (555) 123-4567</li>
            <li>123 Olympiad Ave, Learning City</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/60 sm:px-6">
        &copy; {year} OlympiadNext. All rights reserved.
      </div>
    </footer>
  );
}
