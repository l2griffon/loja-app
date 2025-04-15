import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import UploaderDeProdutos from './UploaderDeProdutos';
import JsonImporter from './JsonImporter';
import AdminOrdersScreen from './AdminOrdersScreen';

const firebaseConfig = {
  apiKey: "AIzaSyBrgudRlkc_O3elevloX1G6lPzw0hPL0HU",
  authDomain: "essencial-fa6a9.firebaseapp.com",
  projectId: "essencial-fa6a9",
  storageBucket: "essencial-fa6a9.firebasestorage.app",
  messagingSenderId: "988385275932",
  appId: "1:988385275932:web:4429fb5e327f34eb5f6fd9",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const ADMIN_EMAIL = "paulotocadoguerreiro.26@gmail.com";

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, senha);
      if (res.user.email === ADMIN_EMAIL) {
        setUser(res.user);
      } else {
        await signOut(auth);
        alert('Você não tem permissão para acessar essa funcionalidade.');
      }
    } catch (error) {
      console.error(error);
      alert('Erro no login. Verifique o email e senha.');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setEmail('');
    setSenha('');
  };

  if (!user) {
    return (
      <div style={{ padding: 30 }}>
        <h2>🔐 Login de Administrador</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br /><br />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        /><br /><br />
        <button onClick={handleLogin}>Entrar</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>📦 Painel de Administração</h1>
      <p>Logado como: {user.email} <button onClick={handleLogout}>Sair</button></p>

      <UploaderDeProdutos user={user} />
      <hr style={{ margin: '40px 0' }} />
      <JsonImporter />
      <hr style={{ margin: '40px 0' }} />
      <AdminOrdersScreen />
    </div>
  );
}

export default App;
