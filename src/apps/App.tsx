import { Container, createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import Header from '../components/layouts/Header'
import { useState } from 'react'
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useAppDispatch } from './store';
import { useEffect } from 'react';
import { fetchCurrentUser } from '../slices/accountSlice';
import agent from '../services/agent';
import { getCartFromLocalStorage } from '../util/util';
import { setCart } from '../slices/cartSlice';
import Spinner from '../components/layouts/Spinner';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const paletteType = darkMode ? 'dark' : 'light';
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cart = getCartFromLocalStorage();
    dispatch(fetchCurrentUser());
    if (cart) {
      agent.Cart.get()
        .then(cart => dispatch(setCart(cart)))
        .catch(error => console.log(error))
        .finally(() => setLoading(false))
    } else {
      setLoading(false);
    }
  }, [dispatch])
  const theme = createTheme({
    palette: {
      mode: paletteType,
      // background:{
      //   default: '#eaeaea'
      // }
    }
  })

  function handleThemeChange() {
    setDarkMode(!darkMode);
  }

  if (loading) return <Spinner message="Getting Basket ..." />
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
      <Header darkMode={darkMode} handleThemeChange={handleThemeChange} />
      <Container sx={{ paddingTop: "1px" }}>
        <Outlet />
      </Container>
    </ThemeProvider>
  )
}

export default App
