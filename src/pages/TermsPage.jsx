import React from 'react';
import { useTranslation } from 'react-i18next';
import LegalPageTemplate from './LegalPageTemplate';

export default function TermsPage() {
  const { t } = useTranslation();
  
  // Safely fallback to empty array if translations aren't loaded yet
  const sections = t('legal.terms.sections', { returnObjects: true }) || [];
  
  return (
    <LegalPageTemplate
      title={t('legal.terms.title')}
      lastUpdated={t('legal.terms.lastUpdated')}
      sections={Array.isArray(sections) ? sections : []}
    />
  );
}
