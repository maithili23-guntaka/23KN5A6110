import { useState } from "react";
import { TextField, Button, Box, Typography, Snackbar } from "@mui/material";
import { isValidUrl, isAlphanumeric } from "../utils/validation";
import { getAll, saveShortUrl } from "../utils/storage";
import { generateRandomShortCode } from "../utils/shortCode";
import { useLogger } from "./LoggingProvider";
import { useNavigate } from "react-router-dom";

function ShortenerForm() {
  const [inputs, setInputs] = useState([
    { url: "", validity: "", shortcode: "" },
    { url: "", validity: "", shortcode: "" },
    { url: "", validity: "", shortcode: "" },
    { url: "", validity: "", shortcode: "" },
    { url: "", validity: "", shortcode: "" },
  ]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const { log } = useLogger();
  const navigate = useNavigate();

  const handleInputChange = (idx, field, value) => {
    setInputs(prev => prev.map((row, i) => i === idx ? { ...row, [field]: value } : row));
  };

  const handleShorten = () => {
    const output = [];
    for (let row of inputs.filter(r => r.url)) {
      if (!isValidUrl(row.url)) {
        setError(`Invalid URL: ${row.url}`); return;
      }
      const validity = row.validity ? parseInt(row.validity) : 30;
      if (isNaN(validity) || validity <= 0) {
        setError(`Invalid validity for ${row.url}`); return;
      }
      let code = row.shortcode || generateRandomShortCode();
      if (row.shortcode && (!isAlphanumeric(row.shortcode) || row.shortcode.length > 15)) {
        setError("Custom code must be alphanumeric and <= 15 chars.");
        return;
      }
      if (getAll().shortUrls[code]) {
        setError(`Shortcode collision for "${code}"`);
        return;
      }
      const now = Date.now();
      const newRecord = {
        shortcode: code,
        originalUrl: row.url,
        createdAt: now,
        expiresAt: now + validity * 60 * 1000,
        clickCount: 0,
        clicks: []
      };
      saveShortUrl(code, newRecord);
      output.push({
        originalUrl: row.url,
        shortUrl: `${window.location.origin}/${code}`,
        expiresAt: new Date(newRecord.expiresAt).toLocaleString()
      });
      log({ action: "CREATE_SHORT_URL", data: newRecord });
    }
    setResults(output);
    setError("");
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4">React URL Shortener</Typography>
      <Box sx={{ my: 2 }}>
        <Button variant="contained" onClick={() => navigate('/stats')}>
          View Statistics
        </Button>
      </Box>
      {/* 5 input rows */}
      {inputs.map((row, idx) => (
        <Box key={idx} sx={{ my: 1, display: "flex", gap: 1 }}>
          <TextField label="Original URL" value={row.url}
            onChange={e => handleInputChange(idx, "url", e.target.value)} fullWidth />
          <TextField label="Validity (mins, optional)" type="number" value={row.validity}
            onChange={e => handleInputChange(idx, "validity", e.target.value)} />
          <TextField label="Custom Shortcode (optional)" value={row.shortcode}
            onChange={e => handleInputChange(idx, "shortcode", e.target.value)} />
        </Box>
      ))}
      <Button variant="contained" onClick={handleShorten}>Shorten</Button>
      <Snackbar open={!!error} message={error} autoHideDuration={4000}
                onClose={() => setError("")}/>
      {results.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Shortened URLs</Typography>
          {results.map((res, idx) => (
            <Box key={idx} sx={{ my: 1 }}>
              <Typography>
                Original: {res.originalUrl}<br/>
                Short Link: <a href={res.shortUrl} target="_blank" rel="noopener noreferrer">{res.shortUrl}</a><br/>
                Expires at: {res.expiresAt}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
export default ShortenerForm;
