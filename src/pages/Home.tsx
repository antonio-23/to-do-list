import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TodoItem } from "@/components/todo-item";
import { AddTodoForm } from "@/components/add-todo-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogOut, CheckCircle2, Circle } from "lucide-react";
import { useUser } from "../context/UserContext";
import { useCreateTodo } from "../hooks/todos/useCreateTodo";
import { useGetTodos } from "../hooks/todos/useGetTodos";
import { useToggleTodo } from "../hooks/todos/useToggleTodo";
import { useDeleteTodo } from "../hooks/todos/useDelteteTodos";

export default function Home() {
  const navigate = useNavigate();
  const { user, clearUser } = useUser();
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const { createTodo, error } = useCreateTodo();
  const { todos, refetch } = useGetTodos();
  const { toggleTodo } = useToggleTodo();
  const { deleteTodo } = useDeleteTodo();

  useEffect(() => {
    if (!user.token) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleAddTodo = async (title: string) => {
    if (user) {
      try {
        await createTodo({ title });
        refetch();
      } catch (err) {
        console.error("Błąd podczas tworzenia zadania:", error);
      }
    }
  };

  const handleToggleTodo = async (id: string) => {
    if (user) {
      try {
        await toggleTodo(id);
        refetch();
      } catch (err) {
        console.error("Błąd podczas przełączania stanu zadania:", error);
      }
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteTodo(id);
      refetch();
    } catch (err) {
      console.error("Błąd podczas usuwania zadania:", error);
    }
  };

  const handleLogout = () => {
    clearUser();
    navigate("/login");
  };

  if (!user.token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Ładowanie...</div>
      </div>
    );
  }

  const stats = {
    total: todos.length,
    active: todos.filter((t: any) => t.state === "active").length,
    completed: todos.filter((t: any) => t.state !== "active").length,
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="container max-w-4xl mx-auto p-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Moje Zadania</h1>
            <p className="text-muted-foreground mt-1">Witaj, {user.name}!</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Wyloguj
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Wszystkie</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-1">
                <Circle className="h-3 w-3" />
                Aktywne
              </CardDescription>
              <CardTitle className="text-3xl">{stats.active}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Ukończone
              </CardDescription>
              <CardTitle className="text-3xl">{stats.completed}</CardTitle>
            </CardHeader>
          </Card>
        </div>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Dodaj zadanie</CardTitle>
          </CardHeader>
          <CardContent>
            <AddTodoForm onAdd={handleAddTodo} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Lista zadań</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("all")}
                >
                  Wszystkie
                </Button>
                <Button
                  variant={filter === "active" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("active")}
                >
                  Aktywne
                </Button>
                <Button
                  variant={filter === "completed" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("completed")}
                >
                  Ukończone
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {todos.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {filter === "all" && "Brak zadań. Dodaj pierwsze zadanie!"}
                {filter === "active" && "Brak aktywnych zadań."}
                {filter === "completed" && "Brak ukończonych zadań."}
              </div>
            ) : (
              <div className="space-y-2">
                {filter === "all" &&
                  todos.map((todo, i) => (
                    <TodoItem
                      key={i}
                      todo={todo}
                      onToggle={() => handleToggleTodo((todo as any)._id)}
                      onDelete={() => handleDeleteTodo((todo as any)._id)}
                    />
                  ))}
                {filter === "active" &&
                  todos
                    .filter((todo: any) => todo.state === "active")
                    .map((todo, i) => (
                      <TodoItem
                        key={i}
                        todo={todo}
                        onToggle={() => handleToggleTodo((todo as any)._id)}
                        onDelete={() => handleDeleteTodo((todo as any)._id)}
                      />
                    ))}
                {filter === "completed" &&
                  todos
                    .filter((todo: any) => todo.state !== "active")
                    .map((todo, i) => (
                      <TodoItem
                        key={i}
                        todo={todo}
                        onToggle={() => handleToggleTodo((todo as any)._id)}
                        onDelete={() => handleDeleteTodo((todo as any)._id)}
                      />
                    ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
