import { FetchHandler } from './breeds-get'

exports.fetchGet = async function(event: any, context: any, callback: any) {
  //  context.callbackWaitsForEmptyEventLoop = false
  const fetchhandler = new FetchHandler(event.url, event.timeout, false, context, callback)
  const response = await fetchhandler.fetchhandler()
  return response
}
export { handler as stuffGet } from './stuff-get'
