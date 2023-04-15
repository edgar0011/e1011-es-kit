// import { delay } from '../../helpers/other'

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

describe('Simple Tiny Store', () => {
  it('should have state', () => {
    type PostsDataStore = DataState<PostsData>

    const store: StoreWithActions<PostsDataStore> = createDataStore('postsData1')

    console.log('store', store)
    console.log('store.getState()', store.getState())

    const Listener: Listener<PostsDataStore>
      = (state: Partial<PostsDataStore>) => console.log('PostData1 store listener', state)

    store.subscribe(Listener)

    expect(store).toBeDefined()
    expect(store.getState().dataId).toEqual('postsData1')
    expect(store.getState().isLoading).toEqual(false)
  })

  it('should load data into state', async () => {
    type PostsDataStore = DataState<PostsData>

    const store: StoreWithActions<PostsDataStore> = createDataStore('postsData1')

    console.log('store', store)
    console.log('store.getState()', store.getState())

    const Listener: Listener<PostsDataStore>
      = (state: Partial<PostsDataStore>) => console.log('PostData1 store listener', state)

    store.subscribe(Listener)

    expect(store).toBeDefined()
    expect(store.getState().dataId).toEqual('postsData1')
    expect(store.getState().isLoading).toEqual(false)

    await store.actions.load((async() => {
      await delay(2000)
      return fetch('https://jsonplaceholder.typicode.com/posts').then((res) => res.json())
    })())


    const data = store.getState().data as Post[]

    expect(data).toBeDefined()
    expect(data?.[0]?.body).toBeDefined()
  })
})




