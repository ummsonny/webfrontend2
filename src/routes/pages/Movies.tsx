import { useMovieStore } from '@/stores/movies'
import { Link } from 'react-router'

export default function Movies() {
  // 한 번에 1개씩만 훅 호출로 꺼내서 사용
  const fetchMovies = useMovieStore(state => state.fetchMovies)
  const movies = useMovieStore(state => state.movies)
  const isLoading = useMovieStore(state => state.isLoading)
  const searchText = useMovieStore(state => state.searchText)
  const setSearchText = useMovieStore(state => state.setSearchText)

  return (
    <>
      <div>
        <input
          type="text"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              fetchMovies()
            }
          }}
        />
        <button onClick={fetchMovies}>Search!</button>
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
