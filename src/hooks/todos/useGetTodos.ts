import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@/src/context/UserContext";
// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;

interface Todo {
  id: string;
  title: string;
  assignetUser: string;
}

interface UseGetTodosReturn {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useGetTodos = (): UseGetTodosReturn => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  const fetchTodos = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${apiUrl}/todo`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response.data.status === "success") {
        setTodos(response.data.content);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Coś poszło nie tak");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return { todos, isLoading, error, refetch: fetchTodos };
};
