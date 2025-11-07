import { useState } from "react";
import axios from "axios";
import { useUser } from "@/src/context/UserContext";
// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;

interface UseDeleteTodoReturn {
  deleteTodo: (id: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useDeleteTodo = (): UseDeleteTodoReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const deleteTodo = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`${apiUrl}/todo/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response.status !== 204) {
        throw new Error("Nie udało się usunąć zadania");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Coś poszło nie tak");
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteTodo, isLoading, error };
};
