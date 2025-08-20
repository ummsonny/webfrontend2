import { useFetchTodos } from '@/hooks/todo'
import TodoItem from '@/components/todos/TodoItem'

export default function TodoList() {
  const { data: todos, isPending } = useFetchTodos()
  return (
    <>
      <ul>
        {todos?.map(todo => {
          return (
            <TodoItem
              key={todo.id}
              todo={todo}
            />
          )
        })}
      </ul>
    </>
  )
}
