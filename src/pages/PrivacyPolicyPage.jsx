import React from 'react';
import { useTranslation } from 'react-i18next';
import LegalPageTemplate from './LegalPageTemplate';

export default function PrivacyPolicyPage() {
  const { t } = useTranslation();
  
  const sections = t('legal.privacy.sections', { returnObjects: true }) || [];
  
  return (
    <LegalPageTemplate
      title={t('legal.privacy.title')}
      lastUpdated={t('legal.privacy.lastUpdated')}
      sections={Array.isArray(sections) ? sections : []}
    />
  );
}
