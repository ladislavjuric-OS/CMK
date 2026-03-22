import { CONTACT_EMAIL, LINKEDIN_URL, SITE_URL } from "@/lib/site";

const DESCRIPTION =
  "Crowdfunding Momentum Kit: free readiness checker, Campaign Intelligence Report ($499), materials, and Momentum consulting — built from real campaign execution.";

export default function JsonLd() {
  const graph = [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "The Architect — Crowdfunding Momentum Kit",
      legalName: "Elitegrowth d.o.o.",
      url: SITE_URL,
      email: CONTACT_EMAIL,
      sameAs: [LINKEDIN_URL],
      description: DESCRIPTION,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "The Architect — Crowdfunding Momentum Kit",
      url: SITE_URL,
      description: DESCRIPTION,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en",
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }) }}
    />
  );
}
