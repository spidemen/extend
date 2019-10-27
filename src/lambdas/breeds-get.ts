const fetch = require('node-fetch');
import { Response } from './types'

export class FetchHandler {
    url: string;
    context: any;
    constructor(url: string, context?: any) {
        this.url = url;
        this.context = context;
    }

    public async fetchhandler(): Promise<Response> {   // hanle API call and get data from server

        let statusCode = 400;
        let res = new Set();
        if (this.context != undefined){
            this.context.callbackWaitsForEmptyEventLoop = false;
        }
        await fetch(this.url)
            .then((resp: any) => {
                statusCode = resp.status;
                if (!resp.ok) {
                    res.add(resp.statusText);
                }
                return resp.json();
            }).then((body: any) => {
                if (body.status != 'success') {
                    console.log("error get data from " + this.url);
                } else {
                    if (this.context != undefined){
                        console.log('Remaining time: ', this.context.getRemainingTimeInMillis());
                    }
                    this.handlebreed(body.message, res);  // addree json data
                }
            }).catch((err: any) => {
                console.error(err);
                res.clear();
                res.add(err);
            });

        return {
            statusCode: statusCode,
            body: Array.from(res.values())
        }
    }
    public handlebreed(message: any, res: any) {     // handle how to concat breed and subbreeds
        if (typeof message != 'object' || !this.isJson(message)) {
            console.log('wrong input type, not json ');
            return;
        }
        for (let prop in message) {
            if (message.hasOwnProperty(prop)) {
                let arr = message[prop];
                if (arr.length > 0) {
                    for (let i = 0; i < arr.length; i++) {
                        if (this.isJson(arr[i]) || typeof arr[i] == 'object') { // sub-sub breed  ex: sheep:[{dog:[cat,bird]},chook]
                            //   let subres: string[] = [];
                            let subres = new Set();
                            this.handlebreed(arr[i], subres);  // recursive for subbreed then add breed in the back 
                            for (let item of subres) {
                                res.add(item + " " + prop);   // add space sparator
                            }
                        } else {
                            res.add(arr[i] + " " + prop);
                        }
                    }
                } else {
                    res.add(prop);
                }
            }
        }
    }

    public isJson(str: any): boolean {  // check json type
        if (typeof str != 'string')
            str = JSON.stringify(str);
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

}
