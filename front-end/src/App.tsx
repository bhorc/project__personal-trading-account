import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { dark, light } from './config/ThemePalette';
import { ColorModeContext } from './config/ColorModeContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { routes as appRoutes } from './routes';
import { CssBaseline } from '@mui/material';

export default function ToggleColorMode() {
  const [mode, setMode] = React.useState<'light' | 'dark'>('dark');
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        typography: {
          fontFamily: 'Montserrat',
        },
        palette: {
          mode,
          ...(mode === 'light' ? light : dark),
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            {appRoutes.map((route) => (
              route.enabled && (
                <Route
                  key={route.title}
                  path={route.path}
                  element={<route.component />}
                />
              )
            ))}
          </Routes>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
