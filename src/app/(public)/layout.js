import Navbar from "@/components/common/Navbar";
import ThemeApplier from "@/components/ThemeApplier";

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen">
      
      {/* APPLY THEME GLOBALLY */}
      <ThemeApplier />

      {/* NAVBAR */}
      <Navbar />

      {/* CONTENT */}
      <main className="pt-20 mx-auto px-4">
        {children}
      </main>

    </div>
  );
}