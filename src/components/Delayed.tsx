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

    // isFetching은 항상, isLoading은 처음 한번만 가져올때 true가 된다.(isPending은 잘 안씀)
    //     <>
    //   <div>isFetching: {JSON.stringify(isFetching)}</div>
    //   <div>isPending: {JSON.stringify(isPending)}</div>
    //   <div>isLoading: {JSON.stringify(isLoading)}</div>
    //   <div>{data?.time}</div>
    // </>
  )
}
