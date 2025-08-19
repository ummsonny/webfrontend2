import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export default function Delayed({ wait }: { wait?: number }) {
  const { data, isLoading } = useQuery({
    queryKey: ['delay'],
    queryFn: async () => {
      const { data } = await axios(`https://api.heropy.dev/v0/delay?t=${wait}`)
      return data
    }
  })
  return (
    <>
      <h1>Delayed!!</h1>
      <h2>{JSON.stringify(data)}</h2>
      <h3>{JSON.stringify(isLoading)}</h3>
    </>
  )
}
