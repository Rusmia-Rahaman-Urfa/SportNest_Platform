import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContext";
import App from "./App";
import "./styles/index.css";

const qc = new QueryClient({ defaultOptions:{ queries:{ staleTime:1000*60*2, retry:1 } } });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={qc}>
        <ThemeProvider>
          <App/>
          <Toaster position="top-right" toastOptions={{
            style:{ background:"var(--card)", color:"var(--text)", border:"1px solid var(--border)", borderRadius:"10px", fontFamily:"Space Grotesk,sans-serif", fontSize:"14px" },
            success:{ iconTheme:{ primary:"#E8FF00", secondary:"#0a0a0a" } },
          }}/>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
