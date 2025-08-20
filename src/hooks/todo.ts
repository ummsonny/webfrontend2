import axios from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export interface Todo {
  id: string
  order: number
  title: string
  done: boolean
  createdAt: string
  updatedAt: string
}

const api = axios.create({
  baseURL: 'https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos',
  headers: {
    'content-type': 'application/json',
    apikey: 'KDT8_bcAWVpD8',
    username: 'KDT8_ParkYoungWoong'
  }
})
export function useCreateTodo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { title: string }) => {
      // await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate network delay
      await api.post('/', data)
    },
    onMutate: async data => {
      // mutationFn과 같은 인자를 받음
      // Optimistic update can be done here if needed
      const todos = queryClient.getQueryData<Todo[]>(['todos']) // Get current todos from cache
      if (todos) {
        queryClient.setQueryData(
          ['todos'],
          [{ ...data, id: Math.random().toString(), done: '' }, ...todos]
        ) // Add new todo to the front
      }
      return { todos }
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] }) // Re-fetch todos after mutation
    }, //try

    // data: mutationFn, onMutate와 같은 인자를 받음
    // context: onMutate에서 반환한 값
    onError: async (_error, _data, context) => {
      if (context && context.todos) {
        queryClient.setQueryData(['todos'], context.todos) // Rollback to previous todos
      }
    }, //catch
    onSettled: async () => {} //finally
  })
}

export function useFetchTodos() {
  //return useQuery<Todo[]>로 사용해도 괜춘. 근데 api.get<Todo[]>('/')로 사용하면 타입이 더 명확해짐
  return useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const { data } = await api.get<Todo[]>('/')
      return data
    }
  })
}

export function useUpdateTodo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (todo: Todo) => {
      // await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate network delay
      await api.put(`/${todo.id}`, todo)
    },
    onMutate: async todo => {
      // Optimistic update
      const todos = queryClient.getQueryData<Todo[]>(['todos'])
      if (todos) {
        const newTodos = todos.map(t => {
          return t.id === todo.id ? todo : t
        })
        queryClient.setQueryData(['todos'], newTodos)
      }
      return { todos } // Return the previous todos for rollback in case of error
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
    onError: async (_error, _data, context) => {
      if (context && context.todos) {
        queryClient.setQueryData(['todos'], context.todos)
      }
    }
  })
}

export function useDeleteTodo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (todoId: string) => {
      await api.delete(`/${todoId}`)
    },
    onMutate: async todoId => {
      const todos = queryClient.getQueryData<Todo[]>(['todos'])
      if (todos) {
        const newTodos = todos.filter(todo => todo.id !== todoId)
        queryClient.setQueryData(['todos'], newTodos)
      }
      return { todos } // Return the previous todos for rollback in case of error
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
    onError: async (_error, _data, context) => {
      if (context && context.todos) {
        queryClient.setQueryData(['todos'], context.todos)
      }
    }
  })
}
