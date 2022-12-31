import * as uuid from 'uuid'

import { TodoAccess } from "../dataLayer/todoAccess"
import { TodoItem } from "../models/TodoItem"
import { TodoUpdate } from "../models/TodoUpdate"
import { CreateTodoRequest } from "../requests/CreateTodoRequest"
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest"
import { createLogger } from '../utils/logger'

const logger = createLogger('todosBusinessLogic-logger')
const todoAccess = new TodoAccess()

export async function getAllTodo(userId: string): Promise<TodoItem[]> {
    logger.info("Calling getAllTodo from user", userId)
    return todoAccess.getAllTodo(userId)
}

export function createTodo(createTodoRequest: CreateTodoRequest, userId: string): Promise<TodoItem> {
    const todoId =  uuid.v4()
    // const s3BucketName = process.env.S3_BUCKET_NAME
    
    let newTodo: TodoItem = {
        userId: userId,
        todoId: todoId,
        // attachmentUrl: `https://${s3BucketName}.s3.amazonaws.com/${todoId}`, 
        createdAt: new Date().toISOString(),
        done: false,
        ...createTodoRequest,
        attachmentUrl:  '',
    }

    logger.info('Calling createTodo from', userId, 'with todo', JSON.stringify(newTodo))
    return todoAccess.createTodo(newTodo)
}

export function updateTodo(updateTodoRequest: UpdateTodoRequest, todoId: string, userId: string): Promise<TodoUpdate> {
    logger.info('Calling updateTodo from', userId, 'with todo', todoId)
    return todoAccess.updateTodo(updateTodoRequest, todoId, userId)
}

export function deleteTodo(todoId: string, userId: string): Promise<string> {
    logger.info('Calling updateTodo from', userId, 'with todo', todoId)
    return todoAccess.deleteTodo(todoId, userId)
}

export function updateAttachmentUrl(todoId: string, userId: string, attachmentUrl: string): Promise<string> {
    logger.info('Calling updateTodo with todo', todoId, 'userId', userId, 'attachmentUrl', attachmentUrl)
    return todoAccess.updateAttachmentUrl(todoId, userId, attachmentUrl)
}