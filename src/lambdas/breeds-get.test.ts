import { FetchHandler } from './breeds-get'
const chai = require('chai')
const should = chai.should()
const fetchMock = require('fetch-mock');
const fetch = require('node-fetch');

let url = 'https://dog.ceo/api/breeds/list/all';
describe('breeds-get fetchhandler', () => {

    let hanlderBreed = new FetchHandler(url);
    let res = new Set();
    it('should exist test', () => { // A good starting point
        should.exist(FetchHandler)
    })
    it('can fetch test ', async () => {
        fetchMock.get(url, { status: "success" });
        const response = await fetch(url);
        const result = await response.json();
        expect(result.status).toEqual("success");
    });

    it('wrong url test', async () => {
        let fetchhandler = new FetchHandler(url + "wrong");
        const result = await fetchhandler.fetchhandler();
        expect(result.statusCode).toEqual(404);  // 404 not found
        expect(result.body.length).toEqual(1);   // length 1 just store error message 
    });

    it('API call size data test', async () => {
        const result = await hanlderBreed.fetchhandler();
        expect(result.statusCode).toEqual(200);  // 200 success
        expect(result.body.length).toEqual(135);   // expect total breeds
    });

    it('lambda timeout test', async () => {
        let result: any;
        for (let i = 0; i < 5; i++) {
            result = hanlderBreed.fetchhandler();
        }
        setTimeout(() => {  // FIXME: not working , not execute inside code
            //  console.log(result.statusCode);
            expect(result.statusCode).toEqual(undefined);  // 404 not found timeout success
            //  expect(result.body.length).toEqual(1);   // expect total breeds
        }, 3000);
    });
    it('concat breed test', () => {  // local test without internet connection
        //  ex: {A:[],B,[]}-->[A,B]
        let input = { sheep: [], cat: [], dog: [] };
        res.clear();
        let expected = ['sheep', 'cat', 'dog'];
        hanlderBreed.handlebreed(input, res);
        expect(Array.from(res.values())).toEqual(expected);
    });

    it('concat subbreed test', () => { // local test without internet connection
        //  ex: {A:[],B,[]}-->[A,B]
        let input = { sheep: ['lion', 'shark'], cat: [], dog: ['ox', 'wolf'] };
        res.clear();
        let expected = ['lion sheep', 'shark sheep', 'cat', 'ox dog', 'wolf dog'];
        hanlderBreed.handlebreed(input, res);
        expect(Array.from(res.values())).toEqual(expected);
    });

    // it('duplicate breed test',  () => { // local test without internet connection  //JSON object no duplicate 
    //     //  ex: {A:[],B,[]}-->[A,B]
    //     let input = { sheep: ['lion', 'shark'], cat: ['dog'],cat:[dog]};
    //     res.clear();
    //     let expected = ['lion sheep', 'shark sheep', 'cat'];
    //     hanlderBreed.handlebreed(input, res);
    //     expect(Array.from(res.values())).toEqual(expected);  
    // });


    it('embedded subbreed test 1', () => { // local test without internet connection
        //  ex: {A:[],B,[]}-->[A,B]
        let input = { sheep: [{ lion: ['dog', 'cat'] }, 'shark'], cat: [] };
        res.clear();
        let expected = ['dog lion sheep', 'cat lion sheep', 'shark sheep', 'cat'];
        hanlderBreed.handlebreed(input, res);
        expect(Array.from(res.values())).toEqual(expected);
    });

    it('mulitple embedded subbreed test 2 ', () => { // local test without internet connection
        //  ex: {A:[],B,[]}-->[A,B]
        let input = { sheep: [{ lion: [{ cat: ['wolf'] }, 'dog', 'cat'] }, 'shark'], cat: [] };
        res.clear();
        let expected = ['wolf cat lion sheep', 'dog lion sheep', 'cat lion sheep', 'shark sheep', 'cat'];
        hanlderBreed.handlebreed(input, res);
        expect(Array.from(res.values())).toEqual(expected);
    });

    it('empty input test', () => { // local test without internet connection
        let input = {};
        res.clear();
        let expected: string[] = [];
        hanlderBreed.handlebreed(input, res);
        expect(Array.from(res.values())).toEqual(expected);
    });

    it('wrong  formate input test', () => { // local test without internet connection
        let input = 'sheep cat';
        res.clear();
        let expected: string[] = [];
        hanlderBreed.handlebreed(input, res);
        expect(Array.from(res.values())).toEqual(expected);
    });

})
