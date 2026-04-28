import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { Toaster } from "./components/ui/sonner";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AuthProvider } from "./contexts/AuthContext";

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <div>
          <RouterProvider router={router} />
          <Toaster />
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
}