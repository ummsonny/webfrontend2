import { useMovieStore } from '@/stores/movies'
import type { MoviesResponse } from '@/stores/movies'
import { Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useState } from 'react'
import { uniqBy } from 'lodash-es'

export default function Movies() {
  // 한 번에 1개씩만 훅 호출로 꺼내서 사용
  const searchText = useMovieStore(state => state.searchText)
  const setSearchText = useMovieStore(state => state.setSearchText)
  const [inputText, setInputText] = useState(searchText)

  // useQuery를 사용하여 서버에서 데이터를 가져오는 부분
  const { data: movies = [], isFetching } = useQuery({
    queryKey: ['movies', searchText],
    queryFn: async () => {
      const { data } = await axios<MoviesResponse>(
        `https://omdbapi.com?apikey=7035c60c&s=${searchText}`
      )
      return data.Search
    },
    enabled: !!searchText, // searchText가 비어있지 않을 때만 쿼리 실행
    staleTime: 1000 * 5, // 5초 동안 캐시된 데이터 사용
    select: movies => {
      return uniqBy(movies, 'imdbID') // 중복된 imdbID를 가진 영화는 하나만 반환
    }
  })

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
