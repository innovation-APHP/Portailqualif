import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { Toaster } from "./components/ui/sonner";
import { ErrorBoundary } from "./components/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <div>
        <RouterProvider router={router} />
        <Toaster />
      </div>
    </ErrorBoundary>
  );
}