import { useState } from "react";
import axios from "axios";
import { useUser } from "@/src/context/UserContext";
// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;

interface UseToggleTodoReturn {
  toggleTodo: (id: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useToggleTodo = (): UseToggleTodoReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const toggleTodo = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.put(
        `${apiUrl}/todo/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response.data.status !== "success") {
        throw new Error("Nie udało się przełączyć stanu zadania");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Coś poszło nie tak");
    } finally {
      setIsLoading(false);
    }
  };

  return { toggleTodo, isLoading, error };
};
