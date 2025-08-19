import { useQuery } from '@tanstack/react-query'

type Users = User[]
interface User {
  id: number
  name: string
  age: number
}
export default function UserNames() {
  const { data } = useQuery<Users, Error, string[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await fetch(`https://api.heropy.dev/v0/users`)
      const { users } = await res.json()
      return users
    },
    staleTime: 1000 * 10,
    select: data => data.map(user => user.name)
  })
  return (
    <>
      <h1>Delayed!!</h1>
      <h2>{JSON.stringify(data)}</h2>
      <ul>{data?.map((user, i) => <li key={i}>{user}</li>)}</ul>
    </>
  )
}
