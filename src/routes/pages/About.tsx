import { useUserStore } from '@/stores/user'

export default function About() {
  const user = useUserStore(state => state.user)
  const setFirstEmail = useUserStore(state => state.setFirstEmail)
  return (
    <>
      <h1>Welcome to the About Page</h1>
      <h2 onClick={() => setFirstEmail('test@gmail.com')}>
        {JSON.stringify(user)}
      </h2>
    </>
  )
}
