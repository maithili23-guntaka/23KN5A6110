import { useEffect, useState } from "react";
import { getAll } from "../utils/storage";
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Button } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";

function Statistics() {
  const [entries, setEntries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data = Object.values(getAll().shortUrls || {});
    setEntries(data.reverse());
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4">Short URL Statistics</Typography>
      <Button sx={{ mb: 2 }} variant="contained" onClick={() => navigate("/")}>
        Go to URL Shortener
      </Button>
      {entries.length === 0 && <Typography>No URLs shortened yet.</Typography>}
      {entries.map(rec => (
        <Accordion key={rec.shortcode}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              {rec.shortcode} | {rec.originalUrl} | Clicks: {rec.clickCount}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box>
              <Typography>Created: {new Date(rec.createdAt).toLocaleString()}</Typography>
              <Typography>Expires: {new Date(rec.expiresAt).toLocaleString()}</Typography>
              <Typography>
                Short Link: <a href={`/${rec.shortcode}`} target="_blank" rel="noopener noreferrer">
                  {window.location.origin}/{rec.shortcode}
                </a>
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                Click Details:
              </Typography>
              {rec.clicks.length
                ? rec.clicks.map((cl, idx) => (
                  <Typography key={idx} sx={{ ml: 2 }}>
                    {new Date(cl.timestamp).toLocaleString()} | Source: {cl.source} | Location: {cl.location?.country || "Unknown"}
                  </Typography>
                )) : <Typography>No clicks yet</Typography>}
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
export default Statistics;
