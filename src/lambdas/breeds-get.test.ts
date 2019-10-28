import { FetchHandler } from './breeds-get'

import chai = require('chai')
const fetch = require('jest-fetch-mock')

const should = chai.should()

jest.setMock('node-fetch', fetch)

const url = 'https://dog.ceo/api/breeds/list/all'

describe('breeds-get FetchHandler', () => {
  const hanlderBreed = new FetchHandler(url, 3000, false) // set test enviroment
  // let  hanlderBreed = new FetchHandler(event.url,context,callback);
  it('should exist test', () => {
    // A good starting point
    should.exist(FetchHandler)
  })

  beforeEach(() => {
    fetch.resetMocks()
  })
  it('can mock fetch test ', async () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 'test' }))
    const response = await fetch(url)
    const result = await response.json()
    expect(result.status).toEqual('test')
  })

  it('wrong url test', async () => {
    const fetchhandlertmp = new FetchHandler(`${url} wrong`, 3000)
    fetch.mockResponseOnce(JSON.stringify({ status: 'fail', message: {} }), { status: 404 })
    const result = await fetchhandlertmp.fetchhandler()
    expect(result.statusCode).toEqual(404) // 404 not found
    expect(result.body.length).toEqual(1) // length 1 just store error message
  })

  it('server timeout test', async () => {
    fetch.resetMocks()
    const hanlderBreedtimeout = new FetchHandler(url, 300) // too short time, which cannot complete fetch API get

    fetch.mockResponse(
      () =>
        new Promise(resolve =>
          setTimeout(
            () =>
              resolve({
                body: JSON.stringify({ status: 'Success', message: {} }),
                status: 499,
              }),
            2000,
          ),
        ),
    ) // after 1 second,, then send response to clinet

    //  fetch.mockResponseOnce(JSON.stringify({ status: 'fail',message:{}}),{status: 499})

    const result = await hanlderBreedtimeout.fetchhandler()
    expect(result.statusCode).toEqual(200) // 499 fetch timeout
    expect(result.body.length).toEqual(0) // expect total breeds
  })

  it('empty breed test', async () => {
    fetch.mockResponseOnce(JSON.stringify({ status: 'success', message: {} }), { status: 200 })
    const result = await hanlderBreed.fetchhandler()
    expect(result.statusCode).toEqual(200)
    expect(result.body.length).toEqual(0)
  })

  it('concat single breed test', async () => {
    // test with local mock fetch
    fetch.mockResponseOnce(
      JSON.stringify({ status: 'success', message: { sheep: [], cat: [], dog: [] } }),
      { status: 200 },
    )
    const result = await hanlderBreed.fetchhandler()
    const expected = ['sheep', 'cat', 'dog']
    expect(result.body).toEqual(expected)
    expect(result.statusCode).toEqual(200)
  })

  it('concat subbreed test', async () => {
    // test with local mock fetch
    const input = {
      status: 'success',
      message: {
        sheep: ['lion', 'shark'],
        cat: [],
        dog: ['ox', 'wolf'],
      },
    }
    fetch.mockResponseOnce(JSON.stringify(input), { status: 200 })
    const result = await hanlderBreed.fetchhandler()
    const expected = ['lion sheep', 'shark sheep', 'cat', 'ox dog', 'wolf dog']
    expect(result.body).toEqual(expected)
    expect(result.statusCode).toEqual(200)
  })

  it('embedded subbreed test', async () => {
    // test with local mock fetch
    const input = {
      status: 'success',
      message: {
        sheep: [{ lion: ['dog', 'cat'] }, 'shark'],
        cat: [],
      },
    }
    fetch.mockResponseOnce(JSON.stringify(input), { status: 200 })
    const result = await hanlderBreed.fetchhandler()
    const expected = ['dog lion sheep', 'cat lion sheep', 'shark sheep', 'cat']
    expect(result.body).toEqual(expected)
    expect(result.statusCode).toEqual(200)
  })

  it('mulitple embedded subbreed test', async () => {
    // test with local mock fetch
    const input = {
      status: 'success',
      message: {
        sheep: [{ lion: [{ cat: ['wolf'] }, 'dog', 'cat'] }, 'shark'],
        cat: [],
      },
    }
    fetch.mockResponseOnce(JSON.stringify(input), { status: 200 })
    const result = await hanlderBreed.fetchhandler()
    const expected = [
      'wolf cat lion sheep',
      'dog lion sheep',
      'cat lion sheep',
      'shark sheep',
      'cat',
    ]
    expect(result.body).toEqual(expected)
    expect(result.statusCode).toEqual(200)
  })

  it('wrong  formate input test', async () => {
    // test with local mock fetch
    const input = { status: 'success', message: 'dog cat' }
    fetch.mockResponseOnce(JSON.stringify(input), { status: 200 })
    const result = await hanlderBreed.fetchhandler()
    const expected: string[] = []
    expect(result.body).toEqual(expected)
    expect(result.statusCode).toEqual(200)
  })

  // // test hanlderBreed class
  // const fetchhandler = jest.fn();
  // jest.mock('./breeds-get', () => {
  //     return jest.fn().mockImplementation(() => {
  //         return { fetchhanlders: FetchHandler };
  //     });
  // });

  // beforeEach(() => {
  //     // Clear all instances and calls to constructor and all methods:
  //     fetchhandler.mockClear();
  // });

  // it('check contructor create??', () => {
  //     const hanlde = new FetchHandler(url);
  //     // Ensure constructor created the object
  //     expect(fetchhandler).toBeTruthy();
  // });
})
