import * as uuid from 'uuid'

import { TodoItem } from "../models/TodoItem";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";
import { TodoUpdate } from "../models/TodoUpdate";
import { TodoAccess } from "../dataLayer/todoAccess";
// import { createLogger } from '../utils/logger'

// const logger = createLogger('TodosAccess')
const todoAccess = new TodoAccess()

export async function getAllTodo(userId: string): Promise<TodoItem[]> {
    return todoAccess.getAllTodo(userId)
}

export function createTodo(createTodoRequest: CreateTodoRequest, userId: string): Promise<TodoItem> {
    const todoId =  uuid.v4()
    const s3BucketName = process.env.S3_BUCKET_NAME
    
    return todoAccess.createTodo({
        userId: userId,
        todoId: todoId,
        attachmentUrl:  `https://${s3BucketName}.s3.amazonaws.com/${todoId}`, 
        createdAt: new Date().toISOString(),
        done: false,
        ...createTodoRequest,
    })
}

export function updateTodo(updateTodoRequest: UpdateTodoRequest, todoId: string, userId: string): Promise<TodoUpdate> {
    return todoAccess.updateTodo(updateTodoRequest, todoId, userId)
}

export function deleteTodo(todoId: string, userId: string): Promise<string> {
    return todoAccess.deleteTodo(todoId, userId)
}

export function generateUploadUrl(todoId: string): Promise<string> {
    return todoAccess.generateUploadUrl(todoId)
}