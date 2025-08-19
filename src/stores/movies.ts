import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import axios from 'axios'
import { uniqBy } from 'lodash-es'

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

export interface Rating {
  Source: string
  Value: string
}

// create-combine이 TS에서의 zustanc 기본 사용법.
export const useMovieStore = create(
  combine(
    {
      movies: [] as Movie[], // 타입 추론이 안 되기 때문에 as를 통해 별도로 타입 단언해야함.
      searchText: '',
      isLoading: false,
      currentMovie: null as MovieDetails | null
    },
    (set, get) => {
      return {
        setSearchText: (searchText: string) => {
          set({ searchText: searchText })
        },
        fetchMovies: async () => {
          set({ isLoading: true })
          const searchText = get().searchText
          const { data } = await axios<MoviesResponse>(
            `https://omdbapi.com?apikey=7035c60c&s=${searchText}`
          )
          set({
            movies: uniqBy(data.Search, 'imdbID'),
            isLoading: false
          })
          console.log('movies', data.Search)
        },
        fetchMovie: async (movieId?: string) => {
          set({ isLoading: true })
          const { data } = await axios<MovieDetails>(
            `https://omdbapi.com?apikey=7035c60c&i=${movieId}`
          )
          set({
            currentMovie: data,
            isLoading: false
          })
        }
      }
    }
  )
)
