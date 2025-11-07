"use client"

export interface Todo {
  id: string
  userId: string
  title: string
  completed: boolean
  createdAt: string
}

export const todoService = {
  getTodos: (userId: string): Todo[] => {
    if (typeof window === "undefined") return []

    const data = localStorage.getItem(`todos_${userId}`)
    if (!data) return []

    try {
      return JSON.parse(data)
    } catch {
      return []
    }
  },

  addTodo: (userId: string, title: string): Todo => {
    const todos = todoService.getTodos(userId)
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      userId,
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    }

    todos.push(newTodo)
    localStorage.setItem(`todos_${userId}`, JSON.stringify(todos))
    return newTodo
  },

  toggleTodo: (userId: string, todoId: string): void => {
    const todos = todoService.getTodos(userId)
    const todo = todos.find((t) => t.id === todoId)

    if (todo) {
      todo.completed = !todo.completed
      localStorage.setItem(`todos_${userId}`, JSON.stringify(todos))
    }
  },

  deleteTodo: (userId: string, todoId: string): void => {
    const todos = todoService.getTodos(userId)
    const filteredTodos = todos.filter((t) => t.id !== todoId)
    localStorage.setItem(`todos_${userId}`, JSON.stringify(filteredTodos))
  },

  updateTodo: (userId: string, todoId: string, title: string): void => {
    const todos = todoService.getTodos(userId)
    const todo = todos.find((t) => t.id === todoId)

    if (todo) {
      todo.title = title
      localStorage.setItem(`todos_${userId}`, JSON.stringify(todos))
    }
  },
}
