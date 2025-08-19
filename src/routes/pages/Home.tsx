import Delayed from '@/components/Delayed'
import UserNames from '@/components/UserNames'
export default function Home() {
  return (
    <>
      <h1>Home!!</h1>
      <Delayed wait={1000} />
      <UserNames />
    </>
  )
}
