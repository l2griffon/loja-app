// Login.js
import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const adminEmail = "paulotocadoguerreiro.26@gmail.com";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user.email !== adminEmail) {
        setErro("Acesso negado: não autorizado.");
        return;
      }
      navigate("/dashboard");
    } catch (error) {
      setErro("Erro ao fazer login: " + error.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login do Administrador</h2>
      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />
      <button onClick={handleLogin}>Entrar</button>
      {erro && <p style={{ color: "red" }}>{erro}</p>}
    </div>
  );
}
