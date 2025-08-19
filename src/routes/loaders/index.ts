import { redirect } from 'react-router'

export function requireAuth({ request }: { request: Request }) {
  console.log(request)
  const token = localStorage.getItem('accessToken')
  if (token) {
    return true
  }
  const url = new URL(request.url)
  const redirectTo = url.pathname + url.search
  return redirect(`/signin?redirectTo=${encodeURIComponent(redirectTo)}`)
}

export function guestOnly() {
  const token = localStorage.getItem('accessToken')
  if (token) {
    return redirect('/')
  }
  return true
}
