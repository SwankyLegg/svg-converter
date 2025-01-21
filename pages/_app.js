import '../styles/globals.css'
import { GoogleAnalytics } from '@next/third-parties/google'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <GoogleAnalytics
        gaId="G-MB3576X9DB"
        debugMode={process.env.NODE_ENV === 'development'}
      />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp 