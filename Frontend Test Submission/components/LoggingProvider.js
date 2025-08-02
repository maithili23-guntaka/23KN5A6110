import React, { createContext, useContext, useState, useCallback } from 'react';

const LoggingContext = createContext();

export const useLogger = () => useContext(LoggingContext);

export const LoggingProvider = ({ children }) => {
  const [logs, setLogs] = useState([]);

  const log = useCallback((entry) => {
    const logEntry = { timestamp: Date.now(), ...entry };
    setLogs((prev) => [...prev, logEntry]);
    
  }, []);

  return (
    <LoggingContext.Provider value={{ log, logs }}>
      {children}
    </LoggingContext.Provider>
  );
};
