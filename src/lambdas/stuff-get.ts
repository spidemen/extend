import { Response } from './types'

export async function handler(): Promise<Response> {
  return {
    statusCode: 200,
    body: `Hi!`,
  }
}
