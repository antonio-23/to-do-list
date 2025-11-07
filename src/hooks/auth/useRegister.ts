import { useState } from "react";
import axios from "axios";
import { useUser } from "@/src/context/UserContext";
// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL;

interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  lastName: string;
}

interface UseRegisterReturn {
  register: (data: RegisterData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

export const useRegister = (): UseRegisterReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useUser();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post(`${apiUrl}/user/signup`, data);
      setUser({
        token: response?.data?.token || "",
        id: response?.data?.user?._id || "",
        name: response?.data?.user?.name || "",
        email: response?.data?.user?.email,
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

  return { register, isLoading, error, success };
};
