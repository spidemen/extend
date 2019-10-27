export { handler as stuffGet } from './stuff-get'
//export { fetchhandler as fetchGet } from './breeds-get'
import {FetchHandler} from './breeds-get';

exports.fetchGet =  function(event:any,context:any) {
    let fetchhandler = new FetchHandler(event.url,context);
    return fetchhandler.fetchhandler();
} 