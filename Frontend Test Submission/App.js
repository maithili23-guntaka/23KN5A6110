import { BrowserRouter, Routes, Route } from "react-router-dom";
import ShortenerForm from "./components/ShortenerForm";
import Statistics from "./components/Statistics";
import RedirectHandler from "./components/RedirectHandler";
import { LoggingProvider } from "./components/LoggingProvider";

function App() {
  return (
    <LoggingProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ShortenerForm />} />
          <Route path="/stats" element={<Statistics />} />
          <Route path="/:shortcode" element={<RedirectHandler />} />
        </Routes>
      </BrowserRouter>
    </LoggingProvider>
  );
}
export default App;
