import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

const WelcomePage = lazy(() => import("../pages/welcomePage/WelcomePage"));
const TimelinePage = lazy(() => import("../pages/timelinePage/TimelinePage"));
const EraPage = lazy(() => import("../pages/eraPage/EraPage"));
const AnimalPage = lazy(() => import("../pages/animalPage/AnimalPage"));
const MuseumPage = lazy(() => import("../pages/museumPage/MuseumPage2"));
const AuthPage = lazy(() => import("../auth/auth"));
const LoginPage = lazy(() => import("../pages/loginPage/loginPage"));
const RegisterPage = lazy(() => import("../pages/registerPage/registerPage"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));

export const PATHS = {
  root: "/",
  timeline: "/timeline",
  era: "/era",
  eraId: (eraId: string) => `/era/${eraId}`,
  animal: (name: string) => `/animal/${encodeURIComponent(name)}`,
  museum: "/museum",
  auth: "/auth",
  login: "/login",
  register: "/register",
  admin: "/admin",
} as const;

// Auth guard placeholder removed; wire your auth context here when ready.

function NotFound() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center gap-4 text-white bg-black">
      <h1 className="text-4xl font-semibold tracking-wide">404</h1>
      <p className="text-sm opacity-70">Page not found</p>
      <a href={PATHS.root} className="text-blue-400 hover:underline">
        Go Home
      </a>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense
      fallback={
        <div className="w-screen h-screen flex items-center justify-center bg-black text-white">
          Loading…
        </div>
      }
    >
      <Routes>
        <Route path={PATHS.root} element={<WelcomePage />} />
        <Route path={PATHS.auth} element={<AuthPage />} />
        <Route path={PATHS.login} element={<LoginPage />} />
        <Route path={PATHS.register} element={<RegisterPage />} />
        <Route
          path={PATHS.timeline}
          element={
            //<ProtectedRoute>*}
            <TimelinePage />
            //</ProtectedRoute>
          }
        />
        <Route path={PATHS.era} element={<EraPage />} />
        <Route path={`${PATHS.era}/:eraId`} element={<EraPage />} />
        <Route path="/animal/:name" element={<AnimalPage />} />
        <Route path={PATHS.museum} element={<MuseumPage />} />
  <Route path={PATHS.admin} element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
