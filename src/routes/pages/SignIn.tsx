// React Project Protected Route (보호된 경로 설정)
// 로그인을 하지 않으면, 영화 검색 페이지로 접근 불가!
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

export default function SignIn() {
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirectTo')

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault()
    if (id && password) {
      const token = id + password
      localStorage.setItem('accessToken', token)

      // 로그인 성공 후, 메인 페이지로 이동
      navigate(redirectTo || '/')
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <h1>Sign In</h1>
      <label>
        Username:
        <input
          type="text"
          name="username"
          value={id}
          onChange={e => setId(e.target.value)}
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          name="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </label>
      <button type="submit">Sign In</button>
    </form>
  )
}
