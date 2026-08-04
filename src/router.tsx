import { createBrowserRouter } from "react-router-dom";

import App from "./App";
import { catalogLoader } from "./loaders/catalog-loader";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        loader: catalogLoader,
    },
])