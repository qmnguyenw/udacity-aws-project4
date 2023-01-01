import * as uuid from 'uuid'
import { TodoAccess } from '../dataLayer/todoAccess'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'

// TODO: Implement businessLogic
const logger = createLogger('logger-todos')
const todoAccess = new TodoAccess()

export async function getAllTodo(userId: string): Promise<TodoItem[]> {
  logger.info('Calling getAllTodo from userId: ' + userId)
  return todoAccess.getAllTodo(userId)
}

export async function createTodo(userId: string, createTodoRequest: CreateTodoRequest): Promise<TodoItem> {
  const todoId = uuid.v4()
  const createdAt = new Date().toISOString()
  let newTodo: TodoItem = {
    userId: userId,
    todoId: todoId,
    createdAt: createdAt,
    done: false,
    ...createTodoRequest,
    attachmentUrl: ''
  }

  logger.info('Calling createTodo from userId: ' + userId + ' with todo ' + newTodo)
  return await todoAccess.createTodo(newTodo)
}

export async function updateTodo(userId: string, todoId: string, updateTodo: UpdateTodoRequest): Promise<TodoUpdate> {
  logger.info('Calling updateTodo from userId: ' + userId + ' with todoId: ' + todoId + ' with updateTodo: ' + updateTodo)
  return todoAccess.updateTodo(userId, todoId, updateTodo)
}

export async function deleteTodo(userId: string, todoId: string) {
  logger.info('Calling deleteTodo from userId: ' + userId + ' with todoId: ' + todoId)
  return todoAccess.deleteTodo(userId, todoId)
}

export async function updateAttachmentUrl(userId: string, todoId: string, attachmentUrl: string): Promise<string> {
  logger.info('Calling updateAcctachmentUrl for userId/todoId: ' + userId + '/' + todoId)
  return todoAccess.updateAttachmentUrl(userId, todoId, attachmentUrl)
}
