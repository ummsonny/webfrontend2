import { useState, Fragment, useRef, useEffect } from 'react'
import { Link } from 'react-router'
import { useMovieStore, useInfiniteMovies } from '@/hooks/movie'

export default function Movies() {
  const searchText = useMovieStore(state => state.searchText)
  const setSearchText = useMovieStore(state => state.setSearchText)
  // 한 번에 1개씩만 훅 호출로 꺼내서 사용
  const [inputText, setInputText] = useState(searchText)
  const observerRef = useRef<HTMLDivElement>(null)
  const { data, isFetching, fetchNextPage } = useInfiniteMovies()

  useEffect(() => {
    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        // 마지막 페이지가 아니면 다음 페이지를 가져옴
        fetchNextPage()
      }
    })
    if (observerRef.current) {
      io.observe(observerRef.current)
    }
    return () => {
      io.disconnect()
    }
  }, [])

  function fetchMovies() {
    setSearchText(inputText)
  }

  return (
    <>
      <div>
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              fetchMovies()
            }
          }}
        />
        <button
          onClick={() => {
            fetchMovies()
          }}>
          Search!
        </button>
      </div>
      <ul>
        {data?.pages.map((page, index) => {
          return (
            <Fragment key={index}>
              {page?.Search.map(movie => {
                return (
                  <li key={movie.imdbID}>
                    <Link to={`/movies/${movie.imdbID}`}>
                      <h3>
                        {movie.Title} ({movie.Year})
                      </h3>
                    </Link>
                  </li>
                )
              })}
            </Fragment>
          )
        })}
      </ul>

      <div
        ref={observerRef}
        className={`${isFetching ? 'hidden' : 'block'} h-[20px]`}></div>
    </>
  )
}
