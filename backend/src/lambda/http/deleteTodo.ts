import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Processing Event ', event)
    // TODO: Remove a TODO item by id
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)
    await deleteTodo(userId, todoId)
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: "Deleted!"
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
