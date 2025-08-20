import { useCreateTodo } from '@/hooks/todo'
import { useState } from 'react'

export default function TodoCreator() {
  const { isPending, mutate } = useCreateTodo() // mutate는 mutationFn을 실행하는 함수
  const [title, setTitle] = useState('')

  function handleCreate() {
    if (title.trim() === '') return // Prevent empty title submission
    mutate({ title }) // Call the mutation function with the new todo title
    setTitle('') // Clear the input field after submission
  }
  return (
    <div>
      <input
        disabled={isPending}
        value={title}
        onChange={e => setTitle(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            mutate({ title })
            console.log('완료!')
          }
        }}
      />
      <button
        disabled={isPending}
        onClick={() => handleCreate()}>
        Add Todo
      </button>
    </div>
  )
}
