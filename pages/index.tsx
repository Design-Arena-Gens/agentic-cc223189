import dynamic from 'next/dynamic'
import Head from 'next/head'

const WatchMechanism = dynamic(() => import('../components/WatchMechanism'), {
  ssr: false,
})

export default function Home() {
  return (
    <>
      <Head>
        <title>3D Mechanical Watch Mechanism</title>
        <meta name="description" content="Interactive 3D mechanical watch mechanism" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <WatchMechanism />
      </main>
    </>
  )
}
