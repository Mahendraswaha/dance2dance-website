import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Dance2Dance';
const BASE_URL = 'https://dance2dance.no';
const DEFAULT_IMAGE = BASE_URL + '/logo-dance2dance.png';

const DEFAULT_META = {
  title: 'Dance2Dance — Movement, Wellbeing & Performance in Oslo',
  description: 'Dance2Dance offers transformative movement programs in Oslo — Be The Dance, Biostretch and Kroppsskole. Corporate wellness, workshops and individual sessions.',
  image: DEFAULT_IMAGE,
};

/**
 * SEOHead — drop this into any page to set title, description & Open Graph.
 *
 * @param {string}  title       Page-specific title (without site name suffix)
 * @param {string}  description Page-specific meta description
 * @param {string}  image       Absolute URL to the OG image
 * @param {string}  url         Canonical URL for this page
 * @param {string}  lang        Language override (default: 'en')
 */
const SEOHead = ({
  title,
  description,
  image,
  url,
  lang = 'en',
}) => {
  const metaTitle  = title       ? (title + ' — ' + SITE_NAME) : DEFAULT_META.title;
  const metaDesc   = description ?? DEFAULT_META.description;
  const metaImage  = image       ?? DEFAULT_META.image;
  const canonical  = url         ? (BASE_URL + url) : BASE_URL;

  return (
    <Helmet>
      <html lang={lang} />
      <title>{metaTitle}</title>
      <meta name="description" content={metaDesc} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph (Facebook, WhatsApp, LinkedIn) */}
      <meta property="og:type"        content="website" />
      <meta property="og:site_name"   content={SITE_NAME} />
      <meta property="og:title"       content={metaTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:image"       content={metaImage} />
      <meta property="og:url"         content={canonical} />

      {/* Twitter Card */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={metaTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image"       content={metaImage} />
    </Helmet>
  );
};

export default SEOHead;
