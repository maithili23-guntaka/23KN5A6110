
export function logEvent(message, metadata = {}) {
  const log = {
    message,
    metadata,
    timestamp: new Date().toISOString()
  };


  const logs = JSON.parse(localStorage.getItem("logs") || "[]");
  logs.push(log);
  localStorage.setItem("logs", JSON.stringify(logs));
}