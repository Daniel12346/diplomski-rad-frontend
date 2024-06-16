import * as React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import * as ReactDOM from "react-dom/client";
import App from "./App";
import { RecoilRoot } from "recoil";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminScreen from "./screens/AdminScreen";
import MainScreen from "./screens/MainScreen";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "admin",
        element: <AdminScreen />,
      },
      {
        path: "",
        element: <MainScreen />,
      },
    ],
  },
]);
const rootElement = document.getElementById("root");
ReactDOM.createRoot(rootElement as any).render(
  <React.StrictMode>
    <RecoilRoot>
      <ChakraProvider>
        <RouterProvider router={router}></RouterProvider>
      </ChakraProvider>
    </RecoilRoot>
  </React.StrictMode>
);
