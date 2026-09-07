import { useState, useCallback } from "react";
import { useAuth } from "./useAuth";
import { validate } from "../components/LoginForm"

interface FieldErrors {
  email?: string;
  password?: string;
}

interface UseLoginReturn {
  email: string;
  password: string;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  fieldErrors: FieldErrors;
  formError: string | null;
  loading: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export function useLogin(): UseLoginReturn {
  const { login, isLoading, error } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const errors = validate(email, password);
      setFieldErrors(errors);
      if (errors.email || errors.password) return;

      await login(email, password);
    },
    [email, password, login]
  );

  return {
    email,
    password,
    setEmail,
    setPassword,
    fieldErrors,
    formError: error,
    loading: isLoading,
    handleSubmit,
  };
}