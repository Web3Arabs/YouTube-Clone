import '@/styles/globals.css'
import { LivepeerConfig, createReactClient, studioProvider } from '@livepeer/react'

export default function App({ Component, pageProps }) {
  const LivePeerClient = createReactClient({
    provider: studioProvider({ apiKey: "add-api-key-here" }),
  });

  return (
    <LivepeerConfig client={LivePeerClient}>
      <Component {...pageProps} />
    </LivepeerConfig>
  )
}
