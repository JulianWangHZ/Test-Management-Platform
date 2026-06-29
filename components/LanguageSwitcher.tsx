'use client';

import { usePathname } from 'next/navigation';
import { Link } from '@/src/i18n/routing';
import { routing } from '@/src/i18n/routing';

type Props = {
  locale: string;
  variant?: 'light' | 'dark';
};

const LOCALES = [
  { code: 'en', label: 'EN' },
  { code: 'zh-TW', label: '中' },
] as const;

function stripLocale(pathname: string): string {
  for (const locale of routing.locales) {
    if (pathname.startsWith(`/${locale}/`)) return pathname.slice(`/${locale}`.length);
    if (pathname === `/${locale}`) return '/';
  }
  return pathname;
}

export default function LanguageSwitcher({ locale, variant = 'light' }: Props) {
  const fullPathname = usePathname();
  const pathname = stripLocale(fullPathname);

  const activeClass = variant === 'dark' ? 'text-white font-semibold' : 'text-gray-900 font-semibold';
  const inactiveClass = variant === 'dark'
    ? 'text-white/35 hover:text-white/70'
    : 'text-gray-400 hover:text-gray-600';
  const dividerClass = variant === 'dark' ? 'text-white/20' : 'text-gray-300';

  return (
    <div className="flex items-center gap-1">
      {LOCALES.map(({ code, label }, i) => (
        <span key={code} className="flex items-center gap-1">
          {i > 0 && <span className={`text-xs ${dividerClass}`}>|</span>}
          <Link
            href={pathname}
            locale={code}
            className={`text-xs transition-colors ${locale === code ? activeClass : inactiveClass}`}
          >
            {label}
          </Link>
        </span>
      ))}
    </div>
  );
}
