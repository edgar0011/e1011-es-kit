import { createSelector } from 'reselect'


type TPost = {
  id: number
  title: string
}

type TState = {
  posts: {
    data: TPost[]
  }
  user: {
    name: string
    address: string
    city: string
  }
  logMessages: string[]
}
describe('Select syntax', () => {
  let state: TState

  const userSelector = (state: TState): TState['user'] => state.user
  const postsSelector = (state: TState): TState['posts'] => {
    console.log('postsSelector called')
    return state.posts
  }

  // const postsSelector = createSelector(
  //   (state: TState) => state,
  //   (state: TState) => {
  //     console.log('postsSelector called')
  //     return state.posts
  //   },
  // )

  const postsDataSelector = createSelector(
    postsSelector,
    (posts: TState['posts']) => {
      console.log('postsDataSelector called')
      return posts.data
    },
  )

  const postSelector = createSelector(
    postsDataSelector,
    (state: TState, postId: TPost['id']) => postId,
    (postsData: TState['posts']['data'], postId: TPost['id']) => postsData.find(({ id }: TPost) => id === postId),
  )

  beforeEach(() => {
    state = {
      posts: {
        data: [
          {
            id: 0,
            title: 'post1',
          },
          {
            id: 1,
            title: 'post2',
          },
          {
            id: 2,
            title: 'post3',
          },
        ],
      },
      user: {
        name: 'John Doe',
        address: 'Long Lane 11',
        city: 'Redneck City',
      },
      logMessages: [
        'log message1',
        'log message2',
        'log message3',
      ],
    }
  })

  it('should select, simple', () => {
    const userNameSelector = createSelector(userSelector, (user) => user.name)

    expect(userNameSelector(state)).toEqual(state.user.name)
  })

  it('should select with external variable/argument', () => {
    expect(postSelector(state, 1)).toEqual(state.posts.data[1])

    // state.posts.data = [...state.posts.data, { id: 3, title: 'post4' }] // not recaluclated
    state = {
      ...state,
      posts: {
        ...state.posts,
        data: [...state.posts.data, { id: 3, title: 'post4' }],
      },
    } // recalculated

    expect(postsDataSelector(state).length).toEqual(4)

    expect(postSelector(state, 0)).toEqual(state.posts.data[0])
    expect(postSelector(state, 2)).toEqual(state.posts.data[2])
  })
})


