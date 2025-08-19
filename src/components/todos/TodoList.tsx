import { userFetchTodos } from '@/hooks/todo'

export default function TodoList() {
  const { data: todos, isPending } = userFetchTodos()
  return (
    <>
      <ul>
        {todos?.map(todo => (
          <li key={todo.id}>
            <span>{todo.title}</span>
          </li>
        ))}
      </ul>
    </>
  )
}
