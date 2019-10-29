import { FetchHandler } from './breeds-get'

import { EventType } from './types'

exports.fetchGet = async function(event: EventType) {
  //  context.callbackWaitsForEmptyEventLoop = false
  const fetchhandler = new FetchHandler(event.url, event.timeout)
  const response = await fetchhandler.fetchhandler()
  return response
}
export { handler as stuffGet } from './stuff-get'
