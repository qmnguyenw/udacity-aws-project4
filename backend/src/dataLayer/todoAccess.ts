import * as AWS from "aws-sdk"
import { DocumentClient } from "aws-sdk/clients/dynamodb"
import * as AWSXRay from 'aws-xray-sdk'
import { TodoItem } from "../models/TodoItem"
import { TodoUpdate } from "../models/TodoUpdate"
import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('todosAccess-logger')

// TODO: Implement the dataLayer logic
export class TodoAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todoTable = process.env.TODOS_TABLE,
        private readonly s3Client = new XAWS.S3({ signatureVersion: 'v4' }),
        private readonly s3BucketName = process.env.S3_BUCKET_NAME,
        // private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION
    ) {
    
    }

    async getAllTodo(userId: string): Promise<TodoItem[]> {
        logger.info("Getting all todo")
        const params = {
            TableName: this.todoTable,
            KeyConditionExpression: "userId = :userId",
            ExpressionAttributeValues: {
                ":userId": userId
            }
        }
        const result = await this.docClient.query(params).promise()
        const items = result.Items
        logger.info("List all todos:", JSON.stringify(items))
        return items as TodoItem[]
    }

    async createTodo(todo: TodoItem): Promise<TodoItem> {
        logger.info("Creating new todo")
        logger.info(JSON.stringify(todo))
        const params = {
            TableName: this.todoTable,
            Item: todo,
        }
        const result = await this.docClient.put(params).promise()
        logger.info(result)
        return todo as TodoItem
    }

    async updateTodo1(todoUpdate: TodoUpdate, todoId: string, userId: string): Promise<TodoUpdate> {
        logger.info("Updating todo")
        logger.info(JSON.stringify(todoUpdate))
        const params = {
            TableName: this.todoTable,
            Key: {
                userId: userId,
                todoId: todoId
            },
            UpdateExpression: 'set #todoName = :todoName, #dueDate = :dueDate, #done = :done',
            ExpressionAttributeNames: {
                '#todoName': 'name',
                '#dueDate': 'dueDate',
                '#done': 'done'
            },
            ExpressionAttributeValues: {
                ':todoName': todoUpdate.name,
                ':dueDate': todoUpdate.dueDate,
                ':done': todoUpdate.done,
            },
            ReturnValues: "ALL_NEW"
        }
        const result = await this.docClient.update(params, function(err, res) {
            if (err) {
                console.log(err)
            } else {
                console.log(res)
            }
        }).promise()
        logger.info(result)
        const attributes = result.Attributes
        return attributes as TodoUpdate
    }

    async updateTodo(todoUpdate: TodoUpdate, todoId: string, userId: string): Promise<TodoUpdate> {
        logger.info('call TodosAccess.updateTodo')
        var params = {
            TableName: this.todoTable,
            Key: {
                userId: userId,
                todoId: todoId
            },
            UpdateExpression: 'set #dynobase_name = :name, dueDate = :dueDate, done = :done',
            ExpressionAttributeValues: {
                ':name': todoUpdate.name,
                ':dueDate': todoUpdate.dueDate,
                ':done': todoUpdate.done,
            },
            ExpressionAttributeNames: { "#dynobase_name": "name" }
        }

        await this.docClient.update(params, function (err, data) {
            if (err) console.log(err)
            else console.log(data)
        }).promise()
        logger.info('result: ' + todoUpdate)
        return todoUpdate
    }

    async deleteTodo(todoId: string, userId: string): Promise<string> {
        logger.info("Deleting todo")
        const params = {
            TableName: this.todoTable,
            Key: {
                userId: userId,
                todoId: todoId
            },
        }
        const result = await this.docClient.delete(params, function(err, res) {
            if (err) {
                console.log(err)
            } else {
                console.log(res)
            }
        }).promise()
        logger.info("Deleted!",result)
        return "Deleted!" as string
    }

    async generateUploadUrl(todoId: string): Promise<string> {
        logger.info("Generating URL")

        const url = this.s3Client.getSignedUrl('putObject', {
            Bucket: this.s3BucketName,
            Key: todoId,
            Expires: 1000,
        })
        logger.info(url)

        return url as string
    }

    async updateAttachmentUrl1(userId: string, todoId: string, uploadUrl: string): Promise<string> {
        logger.info("Updating attachment url with todo with userId"+ userId + "todoId" + todoId + "uploadUrl" + uploadUrl)
        const params =  {
            TableName: this.todoTable,
            Key: {
                userId: userId,
                todoId: todoId
            },
            UpdateExpression: 'set attachmentUrl = :attachmentUrl',
            ExpressionAttributeValues: {
                ':attachmentUrl': uploadUrl
            }
        }
        const result = await this.docClient.update(params, function(err, res) {
            if (err) {
                console.log(err)
            } else {
                console.log(res)
            }
        }).promise()
        logger.info(result)
        return uploadUrl
    }

    async updateAttachmentUrl(userId: string, todoId: string, uploadUrl: string): Promise<string> {
        logger.info('call TodosAccess.updateTodo'+ uploadUrl)
        var params = {
            TableName: this.todoTable,
            Key: {
                userId: userId,
                todoId: todoId
            },
            UpdateExpression: 'set attachmentUrl = :attachmentUrl',
            ExpressionAttributeValues: {
                ':attachmentUrl': uploadUrl.split("?")[0]
            }
        }

        await this.docClient.update(params, function (err, data) {
            if (err) console.log(err)
            else console.log(data)
        }).promise()
        logger.info('result: ' + uploadUrl)
        return uploadUrl
    }
}
