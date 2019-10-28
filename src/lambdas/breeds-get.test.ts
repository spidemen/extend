import { FetchHandler } from './breeds-get'
const chai = require('chai')
const should = chai.should()
//const fetch=require('node-fetch');
const fetch = require('jest-fetch-mock');
jest.setMock('node-fetch', fetch);

let url = 'https://dog.ceo/api/breeds/list/all';
describe('breeds-get FetchHandler', () => {

    let hanlderBreed = new FetchHandler(url, 3000, false);  // set test enviroment
    // let  hanlderBreed = new FetchHandler(event.url,context,callback);
    it('should exist test', () => { // A good starting point
        should.exist(FetchHandler)
    })

    beforeEach(() => {
        fetch.resetMocks()
    })
    it('can mock fetch test ', async () => {
        fetch.mockResponseOnce(JSON.stringify({ status: 'test' }))
        const response = await fetch(url);
        const result = await response.json();
        expect(result.status).toEqual("test");
    });

    it('wrong url test', async () => {
        let fetchhandlertmp = new FetchHandler(url + "wrong", 3000);
        fetch.mockResponseOnce(JSON.stringify({ status: 'fail', message: {} }), { status: 404 })
        const result = await fetchhandlertmp.fetchhandler();
        expect(result.statusCode).toEqual(404);  // 404 not found
        expect(result.body.length).toEqual(1);   // length 1 just store error message 
    });


    it('server timeout test', async () => {
        fetch.resetMocks()
        let result: any;
        let hanlderBreedtimeout = new FetchHandler(url, 300);  // too short time, which cannot complete fetch API get  

        fetch.mockResponse(
            () => new Promise(resolve => setTimeout(() => resolve({
                body: JSON.stringify({ status: 'Success', message: {} }),
                status: 499,
                timeout: 300,
                delay: 300,
            }), 2000))
        )   // after 1 second,, then send response to clinet

        //  fetch.mockResponseOnce(JSON.stringify({ status: 'fail',message:{}}),{status: 499}) 

        try {
            result = await hanlderBreedtimeout.fetchhandler();
            expect(result.statusCode).toEqual(200);  // 499 fetch timeout
            expect(result.body.length).toEqual(0);   // expect total breeds
        } catch (e) {
            throw e
        }

    });

    it('empty breed test', async () => {
        fetch.mockResponseOnce(JSON.stringify({ status: 'success', message: {} }), { status: 200 })
        let result = await hanlderBreed.fetchhandler();
        expect(result.statusCode).toEqual(200);
        expect(result.body.length).toEqual(0);
    });

    it('concat single breed test', async () => {    // test with local mock fetch
        fetch.mockResponseOnce(JSON.stringify({ status: 'success', message: { sheep: [], cat: [], dog: [] } }), { status: 200 })
        let result = await hanlderBreed.fetchhandler();
        let expected = ['sheep', 'cat', 'dog'];
        expect(result.body).toEqual(expected);
        expect(result.statusCode).toEqual(200);
    });

    it('concat subbreed test', async () => {    // test with local mock fetch
        let input = {
            status: 'success',
            message: {
                sheep: ['lion', 'shark'], cat: [], dog: ['ox', 'wolf']
            }
        };
        fetch.mockResponseOnce(JSON.stringify(input), { status: 200 });
        let result = await hanlderBreed.fetchhandler();
        let expected = ['lion sheep', 'shark sheep', 'cat', 'ox dog', 'wolf dog'];
        expect(result.body).toEqual(expected);
        expect(result.statusCode).toEqual(200);
    });

    it('embedded subbreed test', async () => {    // test with local mock fetch
        let input = {
            status: 'success',
            message: {
                sheep: [{ lion: ['dog', 'cat'] }, 'shark'], cat: []
            }
        };
        fetch.mockResponseOnce(JSON.stringify(input), { status: 200 });
        let result = await hanlderBreed.fetchhandler();
        let expected = ['dog lion sheep', 'cat lion sheep', 'shark sheep', 'cat'];
        expect(result.body).toEqual(expected);
        expect(result.statusCode).toEqual(200);
    });

    it('mulitple embedded subbreed test', async () => {    // test with local mock fetch
        let input = {
            status: 'success',
            message: {
                sheep: [
                    { lion: [{ cat: ['wolf'] }, 'dog', 'cat'] },
                    'shark'
                ],
                cat: []
            }
        };
        fetch.mockResponseOnce(JSON.stringify(input), { status: 200 });
        let result = await hanlderBreed.fetchhandler();
        let expected = ['wolf cat lion sheep', 'dog lion sheep', 'cat lion sheep', 'shark sheep', 'cat'];
        expect(result.body).toEqual(expected);
        expect(result.statusCode).toEqual(200);
    });

    it('wrong  formate input test', async () => {    // test with local mock fetch
        let input = { status: 'success', message: 'dog cat' };
        fetch.mockResponseOnce(JSON.stringify(input), { status: 200 });
        let result = await hanlderBreed.fetchhandler();
        let expected: string[] = [];
        expect(result.body).toEqual(expected);
        expect(result.statusCode).toEqual(200);
    });

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
