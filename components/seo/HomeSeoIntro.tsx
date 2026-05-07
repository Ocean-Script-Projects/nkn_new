'use client';

import { useTranslations } from '@/lib/i18n';
import SeoIntro from '@/components/seo/SeoIntro';

export default function HomeSeoIntro() {
  const t = useTranslations('homePage');
  return <SeoIntro text={String(t('seoText'))} />;
}

