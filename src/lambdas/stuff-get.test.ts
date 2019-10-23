import { handler } from './stuff-get'

describe('stuff-get handler', () => {
  it('returns generic response', async () => {
    const response = await handler()
    expect(response).toMatchObject({
      statusCode: 200,
      body: 'hi!',
    })
  })
})
