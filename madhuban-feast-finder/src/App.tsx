import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { SignIn, SignUp, SignedIn, SignedOut } from "@clerk/clerk-react";

import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import Menu from "./pages/Menu";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

/* 🌿 Clerk Theme — Madhuban Style */
const clerkAppearance = {
  layout: {
    socialButtonsPlacement: "top",
    socialButtonsVariant: "blockButton",
  },
  variables: {
    colorPrimary: "#22c55e", // green-500
    colorBackground: "#020617", // slate-950
    colorInputBackground: "#020617",
    colorText: "#e5e7eb",
    colorTextSecondary: "#9ca3af",
    borderRadius: "0.75rem",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  elements: {
    card: "bg-slate-900 border border-green-500/20 shadow-2xl",
    headerTitle: "text-green-400",
    headerSubtitle: "text-gray-400",
    formButtonPrimary:
      "bg-green-500 hover:bg-green-600 text-black font-semibold",
    socialButtonsBlockButton:
      "border border-green-500/30 hover:bg-green-500/10 text-gray-200",
    formFieldInput:
      "bg-slate-950 border border-green-500/20 focus:border-green-500",
    footerActionLink: "text-green-400 hover:text-green-500",
  },
};

/* ✨ Centered Auth Layout */
const AuthLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-950 via-slate-900 to-green-900 px-4">
    {children}
  </div>
);

const AuthGate = ({ children }: { children: React.ReactNode }) => (
  <>
    <SignedIn>{children}</SignedIn>
    <SignedOut>
      <Navigate to="/sign-in" replace />
    </SignedOut>
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <Routes>
        {/* MAIN APP */}
        <Route
          path="/"
          element={
            <AuthGate>
              <Layout />
            </AuthGate>
          }
        >
          <Route index element={<Index />} />
          <Route path="menu" element={<Menu />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="cart" element={<Cart />} />
        </Route>

        {/* AUTH ROUTES (THEMED) */}
        <Route
          path="/sign-in/*"
          element={
            <AuthLayout>
              <SignedIn>
                <Navigate to="/" replace />
              </SignedIn>
              <SignedOut>
                <SignIn appearance={clerkAppearance} />
              </SignedOut>
            </AuthLayout>
          }
        />

        <Route
          path="/sign-up/*"
          element={
            <AuthLayout>
              <SignedIn>
                <Navigate to="/" replace />
              </SignedIn>
              <SignedOut>
                <SignUp appearance={clerkAppearance} />
              </SignedOut>
            </AuthLayout>
          }
        />

        {/* CATCH ALL */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
