import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getAllTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils';
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Processing Event ', event)
    // TODO: Get all TODO items for a current user
    const userId = getUserId(event)
    const todos = await getAllTodo(userId)

    return {
      statusCode: 200,
      // headers: {
      //   'Access-Control-Allow-Origin': '*'
      // },
      body: JSON.stringify({
        items: todos
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)