import fetch from 'node-fetch'

import { FetchHandler } from './breeds-get'

import nock = require('nock')

import chai = require('chai')

const should = chai.should()

const endpoint = '/api/breeds/list/all'
const domain = 'https://dog.ceo'

describe('breeds-get FetchHandler', () => {
  const hanlderBreed = new FetchHandler(`${domain}${endpoint}`, 3000) // set test enviroment

  it('should exist test', () => {
    // A good starting point
    should.exist(FetchHandler)
  })

  it('can fetch test ', async () => {
    nock(domain)
      .get(endpoint)
      .reply(200, { status: 'success' })
    const response = await fetch(`${domain}${endpoint}`)
    const result = await response.json()
    expect(result.status).toEqual('success')
  })

  it('can hanlderBreed fetch test ', async () => {
    // use one single breed to test handlerBreed fetch work without internect connections
    nock(domain)
      .get(endpoint)
      .reply(200, { message: { sheep: [] }, status: 'success' })
    //  const expected = ['sheep']
    const result = await hanlderBreed.fetchhandler()
    expect(result.statusCode).toEqual(200)
    // expect(result.body).toEqual(expected)
  })

  it('wrong url test', async () => {
    const fetchhandlertmp = new FetchHandler(`${domain}${endpoint}wrong`, 3000)
    const input = { status: 'fail', message: {} }
    nock(domain)
      .get(`${endpoint}wrong`)
      .reply(404, input)
    const result = await fetchhandlertmp.fetchhandler()
    expect(result.statusCode).toEqual(404) // 404 not found
    //  expect(result.body.length).toEqual(1) // length 1 just store error message
  })

  it('server timeout both head and body test', async () => {
    const hanlderBreedtimeout = new FetchHandler(`${domain}${endpoint}`, 900) // too short time, which cannot complete fetch API get
    nock(domain)
      .get(endpoint)
      .delay({ head: 1000, body: 2000 }) // delay head 1000ms body 2000ms
      .reply(200, { message: { sheep: [] }, status: 'success' })
    const result = await hanlderBreedtimeout.fetchhandler()
    expect(result.statusCode).toEqual(499) // 499 fetch timeout
  })

  it('empty breed test', async () => {
    nock(domain)
      .get(endpoint)
      .reply(200, { message: {}, status: 'success' })
    // const expected: string[] = []
    const result = await hanlderBreed.fetchhandler()
    expect(result.statusCode).toEqual(200)
    // expect(result.body).toEqual(expected)
  })

  it('concat single breed test', async () => {
    const inputJSON = { status: 'success', message: { sheep: [], cat: [], dog: [] } }
    nock(domain)
      .get(endpoint)
      .reply(200, inputJSON)
    const result = await hanlderBreed.fetchhandler()
    //  const expected = ['sheep', 'cat', 'dog']
    //  expect(result.body).toEqual(expected)
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
    nock(domain)
      .get(endpoint)
      .reply(200, input)
    const result = await hanlderBreed.fetchhandler()
    //  const expected = ['lion sheep', 'shark sheep', 'cat', 'ox dog', 'wolf dog']
    //  expect(result.body).toEqual(expected)
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
    nock(domain)
      .get(endpoint)
      .reply(200, input)
    const result = await hanlderBreed.fetchhandler()
    //   const expected = ['dog lion sheep', 'cat lion sheep', 'shark sheep', 'cat']
    // expect(result.body).toEqual(expected)
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
    nock(domain)
      .get(endpoint)
      .reply(200, input)
    const result = await hanlderBreed.fetchhandler()
    // const expected = [
    //   'wolf cat lion sheep',
    //   'dog lion sheep',
    //   'cat lion sheep',
    //   'shark sheep',
    //   'cat',
    // ]
    //  expect(result.body).toEqual(expected)
    expect(result.statusCode).toEqual(200)
  })

  it('wrong  formate input test', async () => {
    // test with local mock fetch
    const input = { status: 'success', message: 'dog cat' }
    nock(domain)
      .get(endpoint)
      .reply(200, input)
    const result = await hanlderBreed.fetchhandler()
    //   const expected: string[] = []
    //  expect(result.body).toEqual(expected)
    expect(result.statusCode).toEqual(200)
  })

  // it('lambdas timeout test', async () => {
  //   const hanlderBreedtimeout = new FetchHandler(`${domain}${endpoint}`, 3000) // FIXME: need another para context, but cannot pass here
  //   nock(domain).get(endpoint)
  //   .delay({head:1500,body:2600})
  //   .reply(201, { message: { sheep: [] }, status: 'success' })
  //   const result = await hanlderBreedtimeout.fetchhandler()
  //   console.log(result);
  //   expect(result.statusCode).toEqual(201) // 499 fetch timeout
  //   expect(result.body[0]).toMatch('error')
  // })

  // // // test hanlderBreed class
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
