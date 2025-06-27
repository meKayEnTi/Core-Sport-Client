import { Container, createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import Header from './components/layouts/Header'
import { useState } from 'react'
import { Outlet } from 'react-router-dom';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const paleteType = darkMode ? 'dark' : 'light';

  const theme = createTheme({
    palette: {
      mode: paleteType,
    }
  })

  function handleThemeChange() {
    setDarkMode(!darkMode);
  }
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Header darkMode={darkMode} handleThemeChange={handleThemeChange} />
      <Container sx={{ paddingTop: "1px" }}>
        <Outlet />
      </Container>
    </ThemeProvider>
  )
}

export default App
