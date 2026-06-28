'use client';

import { useEffect } from 'react';
import { Button } from '@heroui/react';
import { AlertTriangle } from 'lucide-react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#f5f6f8] flex items-center justify-center px-6">
      <div className="bg-white border border-gray-200 rounded-2xl p-10 max-w-md w-full text-center shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={22} className="text-red-500" />
        </div>
        <h2 className="text-base font-semibold text-gray-900 mb-1">Something went wrong</h2>
        <p className="text-sm text-gray-500 mb-6">
          An unexpected error occurred. Try refreshing the page.
        </p>
        <Button size="sm" color="primary" onPress={reset}>
          Try again
        </Button>
      </div>
    </div>
  );
}
