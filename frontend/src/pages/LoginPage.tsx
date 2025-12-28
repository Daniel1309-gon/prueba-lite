import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormField } from "../components/molecules/FormField";
import { Button } from "../components/atoms/Button";
import { login } from "../api/authService";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate("/");
      window.location.reload();
    } catch (error) {
      alert("Credenciales inválidas");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Iniciar sesión
        </h2>
        <form onSubmit={handleSubmit}>
          <FormField
            label="Usuario / Correo"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <FormField
            label="Contraseña"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="mt-6">
            <Button type="submit">Ingresar</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
