import { Context } from 'vm'

// types specific to function handlers

export interface Response {
  statusCode: number
  body?: any
}

export interface EventType {
  url: string
  timeout: number
}

export interface LamdbasType {
  context?: Context
  // callback: any
}
