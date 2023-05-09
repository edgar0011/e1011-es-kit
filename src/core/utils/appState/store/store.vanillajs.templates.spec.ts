// import { delay } from '../../helpers/other'

import { isEmpty } from 'ramda'

import { delay } from '../../helpers/other'

import { Listener, StoreWithActions } from './store.vanillajs'
import { DataState, createDataStore } from './store.vanillajs.templates'


type Post = {
  uuserId: string
  id: string
  title: string
  body: string
}

type PostsData = Post[]
type PostsDataState = DataState<PostsData>

describe('Simple Tiny Store', () => {
  it('should have state', () => {
    const store = createDataStore<PostsData>('postsData1')

    console.log('store', store)
    console.log('store.getState()', store.getState())

    const Listener: Listener<PostsDataState>
      = (state: Partial<PostsDataState>) => console.log('PostData1 store listener', state)

    store.subscribe(Listener)

    expect(store).toBeDefined()
    expect(store.getState().dataId).toEqual('postsData1')
    expect(store.getState().isLoading).toEqual(false)
  })

  it('should load data into state', async () => {
    const store = createDataStore<PostsData>('postsData2', {
      init: async() => store.actions.load((async() => {
        await delay(1000)
        const data = await fetch('https://jsonplaceholder.typicode.com/posts').then((res) => res.json())

        if (!data || isEmpty(data)) {
          throw new Error('NO Data')
        }
        return data
      })()) }) as StoreWithActions<DataState<PostsData>>

    console.log('store', store)
    console.log('store.getState()', store.getState())

    const Listener: Listener<PostsDataState>
      = (state: Partial<PostsDataState>) => console.log('PostData2 store listener', state)

    store.subscribe(Listener)

    expect(store).toBeDefined()
    expect(store.getState().dataId).toEqual('postsData2')
    expect(store.getState().isLoading).toEqual(false)

    // const loadPromise = store.actions.load((async() => {
    //   await delay(1000)
    //   return fetch('https://jsonplaceholder.typicode.com/posts').then((res) => res.json())
    // })())
    const loadPromise = store.actions.init()

    console.log('loadPromise', loadPromise)

    expect(store.getState().isLoading).toEqual(true)

    const what = await loadPromise

    console.log('what ', what)

    const data = store.getState().data as Post[]

    expect(data).toBeDefined()
    expect(data?.[0]?.body).toBeDefined()
  })
})




