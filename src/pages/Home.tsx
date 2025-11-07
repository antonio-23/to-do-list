import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth-provider";
import { todoService, type Todo } from "@/lib/todos";
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

export default function Home() {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (user) {
      setTodos(todoService.getTodos(user.id));
    }
  }, [user]);

  const handleAddTodo = (title: string) => {
    if (user) {
      const newTodo = todoService.addTodo(user.id, title);
      setTodos([...todos, newTodo]);
    }
  };

  const handleToggleTodo = (id: string) => {
    if (user) {
      todoService.toggleTodo(user.id, id);
      setTodos(todoService.getTodos(user.id));
    }
  };

  const handleDeleteTodo = (id: string) => {
    if (user) {
      todoService.deleteTodo(user.id, id);
      setTodos(todoService.getTodos(user.id));
    }
  };

  const handleUpdateTodo = (id: string, title: string) => {
    if (user) {
      todoService.updateTodo(user.id, id, title);
      setTodos(todoService.getTodos(user.id));
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Ładowanie...</div>
      </div>
    );
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const stats = {
    total: todos.length,
    active: todos.filter((t) => !t.completed).length,
    completed: todos.filter((t) => t.completed).length,
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
            {filteredTodos.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {filter === "all" && "Brak zadań. Dodaj pierwsze zadanie!"}
                {filter === "active" && "Brak aktywnych zadań."}
                {filter === "completed" && "Brak ukończonych zadań."}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={handleToggleTodo}
                    onDelete={handleDeleteTodo}
                    onUpdate={handleUpdateTodo}
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
