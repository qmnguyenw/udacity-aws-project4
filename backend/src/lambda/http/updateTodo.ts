import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateTodo } from '../../businessLogic/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Processing Event ', event)
    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

    const todoItem = await updateTodo(userId, todoId, updatedTodo)

    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        todoItem
      })
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
