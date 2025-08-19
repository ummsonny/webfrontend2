import { useParams } from 'react-router'
import type { MovieDetails } from '@/hooks/movie'
import { useMovie } from '@/hooks/movie'

const infos = ['Actors', 'Director', 'Writer', 'Production', 'Genre'] as const

export default function MovieDetails() {
  const { movieId } = useParams()
  const { data: movie, isFetching } = useMovie(movieId)

  return (
    <div className="mx-auto flex max-w-[1400px] gap-[30px]">
      {isFetching
        ? '로딩 중....'
        : movie && (
            <>
              <div>
                <img
                  src={movie.Poster.replace('SX300', 'SX1000')}
                  alt={movie.Title}
                  className="max-w-[700px]"
                />
              </div>
              <div>
                <h1 className="text-[70px] font-bold">{movie.Title}</h1>
                <p>{movie.Plot}</p>
                {infos.map(info => {
                  return (
                    <div key={info}>
                      <h3 className="mt-[20px] text-[20px] font-bold">
                        {info}
                      </h3>
                      <p>{movie[info]}</p>
                    </div>
                  )
                })}
              </div>
            </>
          )}
    </div>
  )
}
