import { useQuery, queryOptions, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { uniqBy } from 'lodash-es'
import { combine } from 'zustand/middleware'
import { create } from 'zustand'

export interface MoviesResponse {
  Search: Movie[]
  totalResults: string
  Response: string
}

export interface Movie {
  Title: string
  Year: string
  imdbID: string
  Type: string
  Poster: string
}

export interface Rating {
  Source: string
  Value: string
}

export interface MovieDetails {
  Title: string
  Year: string
  Rated: string
  Released: string
  Runtime: string
  Genre: string
  Director: string
  Writer: string
  Actors: string
  Plot: string
  Language: string
  Country: string
  Awards: string
  Poster: string
  Ratings: Rating[]
  Metascore: string
  imdbRating: string
  imdbVotes: string
  imdbID: string
  Type: string
  DVD: string
  BoxOffice: string
  Production: string
  Website: string
  Response: string
}

export const useMovieStore = create(
  combine(
    {
      searchText: ''
    },
    set => ({
      setSearchText: (text: string) => set({ searchText: text })
    })
  )
)

export function useMovies() {
  const queryClient = useQueryClient()
  const searchText = useMovieStore(state => state.searchText)
  const options = queryOptions({
    queryKey: ['movies', searchText],
    queryFn: async () => {
      if (searchText.length < 3) return []
      const { data } = await axios<MoviesResponse>(
        `https://omdbapi.com?apikey=7035c60c&s=${searchText}`
      )
      return data.Search
    },
    enabled: !!searchText, // searchText가 비어있지 않을 때만 쿼리 실행
    staleTime: 1000 * 60 * 60, // 1시간 동안 데이터가 신선하다고 간주
    select: movies => {
      return uniqBy(movies, 'imdbID') // 중복된 imdbID를 가진 영화는 하나만 반환
    }
  })

  // useQuery를 사용하여 서버에서 데이터를 가져오는 부분
  const result = useQuery(options)

  return {
    ...result,
    fetchQuery: () => {
      queryClient.fetchQuery(options)
    }
  }
}

export function useMovie(movieId?: string) {
  return useQuery({
    queryKey: ['movie', movieId],
    queryFn: async () => {
      if (!movieId) return
      const { data } = await axios<MovieDetails>(
        `https://omdbapi.com?apikey=7035c60c&i=${movieId}`
      )
      return data
    },
    staleTime: 1000 * 60 * 60 // 1시간 동안 데이터가 신선하다고 간주
  })
}
