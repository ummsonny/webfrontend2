import { useCreateTodo } from '@/hooks/todo'
import { useState } from 'react'

export default function TodoCreator() {
  const { isPending, mutate } = useCreateTodo()
  const [title, setTitle] = useState('')
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
        onClick={() => mutate({ title })}>
        Add Todo
      </button>
    </div>
  )
}
