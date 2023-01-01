import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import 'source-map-support/register'
import { updateAttachmentUrl } from '../../businessLogic/todos'
import { AttachmentUtils } from '../../fileStorage/attachmentUtils'
import { getUserId } from '../utils'

const attachmentUtils = new AttachmentUtils()

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Processing Event ', event)
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)
    let uploadUrl = await attachmentUtils.createAttachmentPresignedUrl(todoId)
    const attachmentUrl = await attachmentUtils.getAttachmentUrl(todoId)
    await updateAttachmentUrl(userId, todoId, attachmentUrl)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        uploadUrl
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
