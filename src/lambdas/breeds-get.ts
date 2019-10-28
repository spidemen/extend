import { Response } from './types'

let fetch: any

export class FetchHandler {
  url: string

  context: any

  callback: any

  timeout: number

  constructor(url: string, timeout?: number, test?: boolean, context?: any, callback?: any) {
    this.url = url
    this.context = context
    this.callback = callback
    if (timeout === undefined) this.timeout = 2900
    // default lambda timeout 3000, 2900 for fetch request
    else this.timeout = timeout - 100

    // FIXME, there is some problems doing jest mock fetch, so juse use this way to do it
    // it is not good way to use require inside contractor, I will search other solutions later
    if (test !== undefined && test) {
      fetch = require('jest-fetch-mock')
    }
    // test environment
    else {
      fetch = require('node-fetch') // production
    }
  }

  public async fetchhandler(): Promise<Response> {
    // hanle API call and get data from server

    let statuscode = 499
    const res = new Set()
    if (this.context !== undefined) {
      this.context.callbackWaitsForEmptyEventLoop = false
    }
    await fetch(this.url, { method: 'GET', timeout: this.timeout })
      .then((resp: any) => {
        statuscode = resp.status
        if (!resp.ok) {
          res.add(resp.statusText)
        }
        return resp.json()
      })
      .then((body: any) => {
        if (body.status !== 'success') {
          //  console.log("error get data from " + this.url);
        } else {
          if (this.context !== undefined) {
            console.log('Remaining time: ', this.context.getRemainingTimeInMillis())
            if (this.context.getRemainingTimeInMillis() < 500) {
              this.callback({
                statuscode: 504,
                body: ['timeout error, server busy, please try again'],
              })
            }
          }
          this.handlebreed(body.message, res) // address json data
        }
      })
      .catch((err: any) => {
        console.error(err)
        res.clear()
        res.add(err)
      })

    return {
      statusCode: statuscode,
      body: Array.from(res.values()),
    }
  }

  static isJson(str: any): boolean {
    // check json type
    let tmp: any
    if (typeof str !== 'string') tmp = JSON.stringify(str)
    try {
      JSON.parse(tmp)
    } catch (e) {
      return false
    }
    return true
  }

  public handlebreed(message: any, res: any) {
    // handle how to concat breed and subbreeds
    if (typeof message !== 'object' || !FetchHandler.isJson(message)) {
      // console.log('wrong input type, not json ');
      return
    }
    for (const prop in message) {
      if (message.hasOwnProperty(prop)) {
        const arr = message[prop]
        if (arr.length > 0) {
          for (let i = 0; i < arr.length; i += 1) {
            if (FetchHandler.isJson(arr[i]) || typeof arr[i] === 'object') {
              // sub-sub breed  ex: sheep:[{dog:[cat,bird]},chook]
              const subres = new Set()
              this.handlebreed(arr[i], subres) // recursive for subbreed then add breed in the back
              for (const item of subres) {
                res.add(`${item} ${prop}`) // add space sparator
              }
            } else {
              res.add(`${arr[i]} ${prop}`)
            }
          }
        } else {
          res.add(prop)
        }
      }
    }
  }
}
