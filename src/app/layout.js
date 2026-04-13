import "./globals.css";
import AuthProvider from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import ThemeApplier from "@/components/ThemeApplier";
// import { ThemeProvider } from "@/context/ThemeContext";

export const metadata = {
  title: "Guptkhabre | Latest News, Trending Stories & Local Services Directory",
  description:
    "Get latest breaking news, trending updates, hidden stories, viral news, and local services near you. Find verified contacts for web developers, plumbers, electricians, repair services, and more. One platform for news + local service discovery in your area.",
      icons: {
    icon: "/logo.png",
  },
  keywords: [
    "news",
    "latest news",
    "breaking news",
    "trending news",
    "viral news",
    "hidden news",
    "local services",
    "near me services",
    "web developer contact",
    "plumber near me",
    "electrician near me",
    "repair services",
    "freelancer contact",
    "India news",
    "local business directory",
    "service provider contact number",
    "emergency services near me"
  ],
  authors: [{ name: "Guptkhabre" }],
  creator: "Guptkhabre",
  publisher: "Guptkhabre",
  applicationName: "Guptkhabre",
  metadataBase: new URL("https://www.guptkhabre.com"), // replace with your real domain

  openGraph: {
    title: "Guptkhabre | Trending News & Local Services Near You",
    description:
      "Discover breaking news, viral updates, hidden stories, and trusted local service providers like plumbers, web developers, electricians, and more.",
    url: "https://www.guptkhabre.com",
    siteName: "Guptkhabre",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "../public/logo.png", // create a good SEO banner image
        width: 1200,
        height: 630,
        alt: "Guptkhabre News and Local Services"
      }
    ]
  },

  twitter: {
    card: "summary_large_image",
    title: "Guptkhabre | Trending News & Local Services",
    description:
      "Latest news, trending updates, hidden stories, and verified local service contacts in one place.",
    images: ["/og-image.jpg"]
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1
    }
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          <ThemeProvider>
            {/* Applies data-theme + bg/color to <html> reactively */}
            <ThemeApplier />
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}