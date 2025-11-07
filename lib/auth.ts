"use client"

export interface User {
  id: string
  email: string
  name: string
}

export interface AuthData {
  users: Array<{ email: string; password: string; name: string; id: string }>
  currentUser: User | null
}

export const authService = {
  register: (email: string, password: string, name: string): { success: boolean; error?: string } => {
    const authData = getAuthData()

    if (authData.users.find((u) => u.email === email)) {
      return { success: false, error: "Użytkownik z tym adresem email już istnieje" }
    }

    const newUser = {
      id: crypto.randomUUID(),
      email,
      password,
      name,
    }

    authData.users.push(newUser)
    localStorage.setItem("auth", JSON.stringify(authData))

    return { success: true }
  },

  login: (email: string, password: string): { success: boolean; error?: string; user?: User } => {
    const authData = getAuthData()
    const user = authData.users.find((u) => u.email === email && u.password === password)

    if (!user) {
      return { success: false, error: "Nieprawidłowy email lub hasło" }
    }

    authData.currentUser = { id: user.id, email: user.email, name: user.name }
    localStorage.setItem("auth", JSON.stringify(authData))

    return { success: true, user: authData.currentUser }
  },

  logout: () => {
    const authData = getAuthData()
    authData.currentUser = null
    localStorage.setItem("auth", JSON.stringify(authData))
  },

  getCurrentUser: (): User | null => {
    const authData = getAuthData()
    return authData.currentUser
  },
}

function getAuthData(): AuthData {
  if (typeof window === "undefined") {
    return { users: [], currentUser: null }
  }

  const data = localStorage.getItem("auth")
  if (!data) {
    return { users: [], currentUser: null }
  }

  try {
    return JSON.parse(data)
  } catch {
    return { users: [], currentUser: null }
  }
}
