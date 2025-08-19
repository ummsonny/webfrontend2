import { create } from 'zustand'
import {
  combine,
  subscribeWithSelector,
  persist,
  devtools,
  createJSONStorage
} from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export const useUserStore = create(
  devtools(
    persist(
      subscribeWithSelector(
        immer(
          combine(
            {
              user: {
                name: 'Neo',
                age: 30,
                address: {
                  city: 'Seoul',
                  emails: ['neo@heopy.dev', 'tesecon@gmail.com']
                }
              },
              birthYear: 0
            },
            set => {
              return {
                setFirstEmail: (email: string) => {
                  set(state => {
                    state.user.address.emails[0] = email
                  })
                }
              }
            }
          )
        )
      ),
      {
        name: 'userStore',
        storage: createJSONStorage(() => sessionStorage)
      }
    )
  )
)

useUserStore.subscribe(
  state => state.user.age,
  age => {
    useUserStore.setState({
      birthYear: new Date().getFullYear() - age
    })
  }
)
