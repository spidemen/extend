import { Context } from 'vm'
import { FetchHandler } from './breeds-get'

import { EventType, LamdbasType } from './types'

exports.fetchGet = async function(event: EventType, context: Context) {
  //  context.callbackWaitsForEmptyEventLoop = false
  const contextParam: LamdbasType = { context }
  const fetchhandler = new FetchHandler(event.url, event.timeout, contextParam)
  const response = await fetchhandler.fetchhandler()
  return response
}
export { handler as stuffGet } from './stuff-get'
