import axios from 'axios'
import { useMutation, useQuery } from '@tanstack/react-query'

export interface Todo {
  id: string
  order: number
  title: string
  done: boolean
  createdAt: string
  updatedAt: string
}

const api = axios.create({
  baseURL: 'https://asia-northeast3-heropy-api.cloudfunctions.net/api',
  headers: {
    'Content-Type': 'application/json',
    apikey: 'KDT8_bcAWVpD8',
    username: 'KDT8_ParkYoungWoong'
  }
})
export function useCreateTodo() {
  return useMutation({
    mutationFn: async (data: { title: string }) => {
      await api.post('', data)
    },
    onMutate: async () => {
      // Optimistic update can be done here if needed
    },
    onSuccess: async () => {}, //try
    onError: async () => {}, //catch
    onSettled: async () => {} //finally
  })
}

export function userFetchTodos() {
  //return useQuery<Todo[]>로 사용해도 괜춘. 근데 api.get<Todo[]>('/')로 사용하면 타입이 더 명확해짐
  return useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const { data } = await api.get<Todo[]>('/')
      return data
    }
  })
}
