// ProtectedRoute.js
import { useEffect, useState } from "react";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
      setCarregando(false);
    });
    return unsub;
  }, []);

  if (carregando) return <p>Carregando...</p>;

  if (!usuario || usuario.email !== "paulotocadoguerreiro.26@gmail.com") {
    return <Navigate to="/" />;
  }

  return children;
}
