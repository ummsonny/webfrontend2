import { useOutlet } from 'react-router'
import Header from '@/components/Header'

export default function DefaultLayout() {
  const outlet = useOutlet()
  return (
    <>
      <Header />
      {outlet}
    </>
  )
}
