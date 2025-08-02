import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { findByShortcode, saveShortUrl } from "../utils/storage";
import { useLogger } from "./LoggingProvider";

function RedirectHandler() {
  const { shortcode } = useParams();
  const { log } = useLogger();

  useEffect(() => {
    const record = findByShortcode(shortcode);
    if (!record || Date.now() > record.expiresAt) {
      log({ action: "REDIRECT_FAIL", data: { shortcode } });
      alert("This short URL does not exist or has expired.");
      window.location.replace("/");
    } else {
      // Simulate location for click (Geo IP not available client-side)
      const newClick = {
        timestamp: Date.now(),
        source: "Redirection",
        location: { country: "IN", city: "Hyderabad" }
      };
      record.clicks.push(newClick);
      record.clickCount += 1;
      saveShortUrl(shortcode, record);
      log({ action: "REDIRECT_SUCCESS", data: { shortcode, ...newClick } });
      window.location.href = record.originalUrl;
    }
  }, [shortcode, log]);
  return null;
}
export default RedirectHandler;
