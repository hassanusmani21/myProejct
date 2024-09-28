import { useState, useEffect } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Topbar from "./components/global/TopBar";
import CustomSidebar from "./components/global/SideBar";
import AllRoute from './router/allRoute.js';
import { ErrorBoundary } from 'react-error-boundary';
import './App.css';
import useToken from "./contextApi/useToken.js";

// Fallback UI for errors
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div role="alert" style={{ padding: "1em", color: "red" }}>
      <h2>Something went wrong:</h2>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try Again</button>
    </div>
  );
};

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const isLogin = location.pathname === '/login';
  const resetPath = location.pathname === '/reset';
  const savedToken = Cookies.get('access_token');
  const token = useToken();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        {/* Error Boundary wrapping the whole app */}
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <div className="app">
            <main className="content">
              {!isSidebar && savedToken && savedToken !== 'null' && !resetPath &&
                <CustomSidebar isSidebar={isSidebar} setIsSidebar={setIsSidebar} />
              }
              {!isLogin && !resetPath &&
                <Topbar isSidebar={isSidebar} setIsSidebar={setIsSidebar} />
              }
              <AllRoute isSidebar={isSidebar} />
            </main>
          </div>
        </ErrorBoundary>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;