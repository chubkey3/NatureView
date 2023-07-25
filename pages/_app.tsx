import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import NavBar from '../components/NavBar'
import Header from '../components/Header'
import { Poppins } from 'next/font/google'

const font = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
})

const config = {
  fonts: {
    heading: font.style.fontFamily,
    body: font.style.fontFamily,
    mono: font.style.fontFamily
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={extendTheme( config )}>
      <Header/>
      <Component {...pageProps} />
      <NavBar />
    </ChakraProvider>
  )
}

export default MyApp
