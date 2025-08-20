import { useUpdateTodo, useDeleteTodo } from '@/hooks/todo'
import type { Todo } from '@/hooks/todo'
import { set } from 'lodash-es'
import { useMemo, useState, useEffect } from 'react'

export default function TodoItem({ todo }: { todo: Todo }) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(todo.title)
  const [isDone, setIsDone] = useState(todo.done)

  const { isPending: isPendingForUpdate, mutateAsync: mutateAsyncForUpdate } =
    useUpdateTodo()
  const { isPending: isPendingForDelete, mutateAsync: mutateAsyncForDelete } =
    useDeleteTodo()

  const isLoading = useMemo(() => {
    isPendingForUpdate || isPendingForDelete
  }, [isPendingForUpdate, isPendingForDelete])

  function onEditMode() {
    setIsEditing(true)
  }

  function offEditMode() {
    setIsEditing(false)
    setTitle(todo.title) // Reset title to original when exiting edit mode
  }

  function handleSave() {
    if (title === todo.title) return
    mutateAsyncForUpdate({ ...todo, title: title })
    offEditMode()
  }

  function handleDelete() {
    mutateAsyncForDelete(todo.id)
    offEditMode()
  }

  return (
    <li className="flex items-center gap-2">
      {isEditing ? (
        <>
          <input
            className="grow-1 rounded border-1 border-gray-300 p-1"
            disabled={isPendingForUpdate}
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <button
            disabled={isPendingForUpdate}
            onClick={offEditMode}>
            취소
          </button>
          <button
            disabled={isPendingForUpdate}
            onClick={handleSave}>
            저장
          </button>
          <button
            disabled={isPendingForUpdate}
            onClick={handleDelete}>
            삭제
          </button>
        </>
      ) : (
        <>
          <input
            type="checkbox"
            checked={isDone}
            onChange={e => {
              const done = e.target.checked
              setIsDone(done)
              mutateAsyncForUpdate({ ...todo, done: done })
            }}
          />
          <div className="grow-1">{todo.title}</div>
          <button onClick={onEditMode}>수정</button>
        </>
      )}
    </li>
  )
}
