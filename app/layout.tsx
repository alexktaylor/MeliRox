import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import LeadTracker from "./components/LeadTracker";

const GA_ID = "G-Q6SCNZTWTZ";

const SITE = "https://melirox.com";
const DESCRIPTION =
  "Meli Rox es cantautora, violinista eléctrica y artista en vivo en Medellín. Música en vivo para bodas, fiestas de 15, eventos corporativos, conciertos y experiencias personalizadas en Colombia.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Meli Rox — Cantautora y Violinista Eléctrica en Medellín",
    template: "%s | Meli Rox",
  },
  description: DESCRIPTION,
  applicationName: "Meli Rox",
  keywords: [
    "Meli Rox",
    "violinista Medellín",
    "violinista eléctrica",
    "cantante para eventos Medellín",
    "música en vivo bodas Medellín",
    "violinista para bodas Colombia",
    "música para fiesta de 15 años",
    "artista para eventos corporativos",
    "cantautora colombiana",
    "contratar violinista Medellín",
    "música en vivo eventos Colombia",
  ],
  authors: [{ name: "Meli Rox" }],
  creator: "Meli Rox",
  publisher: "Meli Rox",
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png", sizes: "192x192" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: { url: "/apple-icon.png", sizes: "180x180" },
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: SITE,
    siteName: "Meli Rox",
    title: "Meli Rox — Voz, violín y energía que transforma",
    description: DESCRIPTION,
    images: [
      { url: "/og.jpg", width: 1200, height: 630, alt: "Meli Rox — cantautora y violinista eléctrica en vivo" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Meli Rox — Cantautora y Violinista Eléctrica",
    description: DESCRIPTION,
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  category: "music",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["MusicGroup", "PerformingGroup"],
      "@id": `${SITE}/#artist`,
      name: "Meli Rox",
      url: SITE,
      image: `${SITE}/og.jpg`,
      logo: `${SITE}/uploads/MRFavicon.png`,
      description:
        "Cantautora, violinista eléctrica y artista en vivo de Medellín, Colombia. Música original y presentaciones en vivo que unen la elegancia clásica con la energía contemporánea.",
      genre: ["Pop", "Electronic", "Afro House", "Crossover", "Live music"],
      foundingLocation: { "@type": "Place", name: "Medellín, Colombia" },
      sameAs: [
        "https://www.instagram.com/meliroxoficial/",
        "https://open.spotify.com/artist/0Me2xPijWmN9C9P2Vs5IGP",
        "https://www.youtube.com/@meliroxmusic",
      ],
    },
    {
      "@type": ["LocalBusiness", "EntertainmentBusiness"],
      "@id": `${SITE}/#business`,
      name: "Meli Rox — Música en vivo para eventos",
      url: SITE,
      image: `${SITE}/og.jpg`,
      logo: `${SITE}/uploads/MRFavicon.png`,
      description:
        "Cantante y violinista eléctrica para bodas, fiestas de 15, eventos corporativos, conciertos y experiencias personalizadas en Medellín y toda Colombia.",
      telephone: "+573045502154",
      email: "meliroxmusic@gmail.com",
      priceRange: "$$",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Medellín",
        addressRegion: "Antioquia",
        addressCountry: "CO",
      },
      areaServed: [
        { "@type": "City", name: "Medellín" },
        { "@type": "State", name: "Antioquia" },
        { "@type": "Country", name: "Colombia" },
      ],
      founder: { "@id": `${SITE}/#artist` },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+573045502154",
        contactType: "bookings",
        availableLanguage: ["Spanish", "English"],
      },
      sameAs: [
        "https://www.instagram.com/meliroxoficial/",
        "https://open.spotify.com/artist/0Me2xPijWmN9C9P2Vs5IGP",
        "https://www.youtube.com/@meliroxmusic",
      ],
      makesOffer: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Música en vivo para bodas", description: "Voz y violín eléctrico para ceremonia, cóctel y recepción, con repertorio personalizado." } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Música para fiestas de 15 años", description: "Entrada especial, alas LED y canción personalizada para quinceañeras." } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Eventos corporativos", description: "Activaciones de marca, galas, lanzamientos y premiaciones con producción de alto impacto." } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Eventos privados", description: "Cumpleaños, aniversarios, propuestas y cenas exclusivas — experiencia íntima y a la medida." } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Conciertos y festivales", description: "Violín eléctrico, voz y electrónica en vivo — Afro House, colaboraciones con DJs y festivales." } },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      url: SITE,
      name: "Meli Rox",
      inLanguage: "es-CO",
      publisher: { "@id": `${SITE}/#business` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Manrope:wght@200;300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>
        {children}
        <LeadTracker />
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="ga-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
        </Script>
      </body>
    </html>
  );
}
