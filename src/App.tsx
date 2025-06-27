import { Container, CssBaseline } from '@mui/material'
import Catalog from './pages/Catalog'
import Header from './components/layouts/Header'
import { useState } from 'react'

function App() {
  const [darkMode, setDarkMode] = useState(false);

  function handleThemeChange() {
    setDarkMode(!darkMode);
  }
  return (
    <>
      <CssBaseline/>
      <Header darkMode={darkMode} handleThemeChange={handleThemeChange} />
      <Container>
        <Catalog /> 
      </Container>
    </>
  )
}

export default App
