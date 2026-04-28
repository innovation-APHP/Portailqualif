import { createBrowserRouter } from "react-router-dom";
import { TestPage } from "./components/TestPage";
import { NotFound } from "./components/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <TestPage />,
  },
  {
    path: "*",
    element: <NotFound />
  }
]);
