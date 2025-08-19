import { useState } from 'react'
import { Link } from 'react-router'
import { useMovieStore, useMovies } from '@/hooks/movie'

export default function Movies() {
  const searchText = useMovieStore(state => state.searchText)
  const setSearchText = useMovieStore(state => state.setSearchText)
  // 한 번에 1개씩만 훅 호출로 꺼내서 사용
  const [inputText, setInputText] = useState(searchText)
  // useQuery를 사용하여 서버에서 데이터를 가져오는 부분
  const { data: movies = [], isFetching, fetchQuery } = useMovies()

  function fetchMovies() {
    setSearchText(inputText)
    fetchQuery()
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
        {movies.map(movie => {
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
      </ul>
    </>
  )
}
