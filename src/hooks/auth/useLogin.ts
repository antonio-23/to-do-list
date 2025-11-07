import { useState } from "react";
import axios from "axios";
import { useUser } from "@/src/context/UserContext";
// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;

interface LoginData {
  email: string;
  password: string;
}

interface UseLoginReturn {
  login: (data: LoginData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

export const useLogin = (): UseLoginReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { setUser } = useUser();

  const login = async (data: LoginData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post(`${apiUrl}/user/login`, data);
      if (response.data.status === "success") {
        setSuccess(true);
        setUser({
          token: response.data.token,
          name: response.data.user.name,
          email: response.data.user.email,
          id: response.data.user.id,
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Coś poszło nie tak");
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error, success };
};
