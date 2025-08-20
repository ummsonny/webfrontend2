import {
  useQuery,
  queryOptions,
  useQueryClient,
  useInfiniteQuery,
  useInfiniteQuery
} from '@tanstack/react-query'
import axios from 'axios'
import { last, uniqBy } from 'lodash-es'
import { combine } from 'zustand/middleware'
import { create } from 'zustand'
import { aw } from 'node_modules/react-router/dist/development/context-DohQKLID.d.mts'

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

export function useInfiniteMovies() {
  const searchText = useMovieStore(state => state.searchText)
  return useInfiniteQuery({
    queryKey: ['movies', searchText],
    queryFn: async ({ pageParam }) => {
      if (searchText.length < 3) return
      await new Promise(resolve => setTimeout(resolve, 1000)) // 1초 딜레이
      const { data } = await axios<MoviesResponse>(
        `https://omdbapi.com?apikey=7035c60c&s=${searchText}&page=${pageParam}`
      )
      return data
    },

    //lastPage는 마지막 페이지의 데이터. queryFn의 반환 데이터
    //pages는 모든 페이지의 데이터 배열
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage) return null
      const { totalResults } = lastPage
      const total = Number.parseInt(totalResults, 10)
      const maxPage = Math.ceil(total / 10)
      const currentPage = pages.length // 현재 페이지는 pages 배열의 길이

      if (lastPage.Response === 'True' && currentPage < maxPage) {
        return currentPage + 1
      }

      return null
    },
    initialPageParam: 1,
    enabled: !!searchText, // searchText가 비어있지 않을 때만 쿼리 실행
    staleTime: 1000 * 60 * 60, // 1시간 동안 데이터가 신선하다고 간주
    select: data => {
      return {
        ...data,
        pages: data.pages.map(page => {
          if (!page) return page
          return {
            ...page,
            Search: uniqBy(page.Search, 'imdbID')
          }
        })
      }
    }
  })
}
