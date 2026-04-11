import { Helmet } from "react-helmet-async";

const SITE_NAME = "Doju Health";
const BASE_URL = "https://dojuhealth.com";
const DEFAULT_IMAGE = `${BASE_URL}/favicon.jpg`;
const DEFAULT_DESCRIPTION =
  "Nigeria's trusted marketplace for clinical-grade medical equipment and health supplies. Verified sellers, FDA-compliant products, fast delivery across Africa.";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "product";
  noIndex?: boolean;
  structuredData?: object | object[];
}

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords,
  canonical,
  ogImage = DEFAULT_IMAGE,
  ogType = "website",
  noIndex = false,
  structuredData,
}: SEOProps) {
  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} - Medical Equipment Marketplace Nigeria`;
  const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : BASE_URL;

  const schemaItems = structuredData
    ? Array.isArray(structuredData)
      ? structuredData
      : [structuredData]
    : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta
        name="robots"
        content={noIndex ? "noindex, nofollow" : "index, follow"}
      />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter */}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured data */}
      {schemaItems.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
