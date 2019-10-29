import fetch from 'node-fetch'
import { Response } from './types'

export class FetchHandler {
  url: string

  // context: any

  // callback: any

  timeout: number

  constructor(url: string, timeouts?: number) {
    this.url = url
    // this.context = context
    // this.callback = callback
    if (timeouts === undefined) this.timeout = 2900
    // default lambda timeout 3000, 2900 for fetch request
    else this.timeout = timeouts - 100
  }

  public async fetchhandler(): Promise<Response> {
    // hanle API call and get data from server

    let statuscode = 499
    const res = new Set()
    // if (this.context !== undefined) {
    //   this.context.callbackWaitsForEmptyEventLoop = false
    // }
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
          // console.log("error get data from " + this.url+"  "+body.status);
        } else {
          // if (this.context !== undefined) {
          //   console.log('Remaining time: ', this.context.getRemainingTimeInMillis())
          //   if (this.context.getRemainingTimeInMillis() < 500) {
          //     this.callback({
          //       statuscode: 504,
          //       body: ['timeout error, server busy, please try again'],
          //     })
          //   }
          // }
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

  public handlebreed(message: JSON, res: any) {
    // handle how to concat breed and subbreeds
    if (typeof message !== 'object' || !FetchHandler.isJson(message)) {
      // console.log('wrong input type, not json ');
      return
    }
    const keys = Object.keys(message)
    const values: any = Object.values(message)
    for (let i = 0; i < keys.length; i += 1) {
      if (Array.isArray(values[i]) && values[i].length > 0) {
        const arr = values[i]
        for (let j = 0; j < arr.length; j += 1) {
          if (FetchHandler.isJson(arr[j]) || typeof arr[j] === 'object') {
            // sub-sub breed  ex: sheep:[{dog:[cat,bird]},chook]
            const subres = new Set()
            this.handlebreed(arr[j], subres) // recursive for subbreed then add breed in the back
            subres.forEach(function(item) {
              res.add(`${item} ${keys[i]}`) // add space sparator
            })
          } else {
            res.add(`${arr[j]} ${keys[i]}`)
          }
        }
      } else {
        res.add(keys[i])
      }
    }
  }
}
