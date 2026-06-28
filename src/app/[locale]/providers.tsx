'use client';

import * as React from 'react';
import { HeroUIProvider } from '@heroui/react';
import { ToastProvider } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from 'next-themes';
import TokenProvider from '@/utils/TokenProvider';

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps}>
        <ToastProvider />
        <TokenProvider>{children}</TokenProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
