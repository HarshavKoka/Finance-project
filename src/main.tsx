
import ReactDOM from "react-dom/client";
import { BrowserRouter} from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query"
import "./index.css";
import { queryClient } from "./assets/queryClient"
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <BrowserRouter>
    
    <QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>


  </BrowserRouter>
);
