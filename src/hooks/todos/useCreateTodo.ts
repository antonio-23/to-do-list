import { useState } from "react";
import axios from "axios";
import { useUser } from "@/src/context/UserContext";
// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;

interface TodoData {
  title: string;
}

interface UseCreateTodoReturn {
  createTodo: (data: TodoData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

export const useCreateTodo = (): UseCreateTodoReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { user } = useUser();

  const createTodo = async (data: TodoData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post(`${apiUrl}/todo/create`, data, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response.data.status === "success") {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Coś poszło nie tak");
    } finally {
      setIsLoading(false);
    }
  };

  return { createTodo, isLoading, error, success };
};
