export { handler as stuffGet } from './stuff-get'
//export { fetchhandler as fetchGet } from './breeds-get'
import {FetchHandler} from './breeds-get';

exports.fetchGet =   async function(event:any,context:any,callback:any) {
    context.callbackWaitsForEmptyEventLoop = false;
    let fetchhandler = new FetchHandler(event.url,event.timeout,context,callback);
    let response=await fetchhandler.fetchhandler();
    return response;
 
} 
