import { redirect } from 'next/navigation';
import { PageType } from '@/types/base';

export default function Home({ params }: PageType) {
  redirect(`/${params.locale}/projects`);
}
