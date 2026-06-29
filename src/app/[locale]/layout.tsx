import '@/styles/globals.css';
import clsx from 'clsx';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Providers } from './providers';
import { LocaleCodeType } from '@/types/locale';
import { fontSans } from '@/config/fonts';

export async function generateMetadata() {
  return {
    title: 'Agentic QA',
    description: 'Agentic QA Test Case Management Platform',
    icons: {
      icon: { url: '/favicon/icon.svg', type: 'image/svg+xml' },
    },
    robots: { index: false, follow: true },
  };
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: LocaleCodeType };
}) {
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={clsx('bg-white font-sans antialiased', fontSans.variable)}>
        <NextIntlClientProvider messages={messages}>
          <Providers themeProps={{ attribute: 'class', defaultTheme: 'light' }}>
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
