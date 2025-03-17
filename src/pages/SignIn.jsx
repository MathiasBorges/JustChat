import { useState } from "react";
import { Account, ID } from "appwrite";
import "../sign.css";
import client, {databases,DATABASE_ID, COLLECTION_ID_MESSAGES } from "../WriteConfig"; // Importa a configuração do Appwrite

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  const account = new Account(client);

  const handleLogin = async () => {
    try {
      await account.createEmailSession(email, senha);
      setMensagem("Login realizado com sucesso!");
      window.location.replace("/"); // Redireciona para a sala
    } catch (error) {
      setMensagem(`Erro ao acessar: ${error.message}`);
    }
  };

  const handleRegister = async () => {
    try {
      const user = await account.create(ID.unique(), email, senha);
      
      await databases.createDocument(DATABASE_ID, COLLECTION_ID_MESSAGES, ID.unique(), {
        id_user: user.$id,
        email: email,
        password:senha

      });

      await handleLogin(); // Faz login automaticamente após o cadastro
    } catch (error) {
      setMensagem(`Erro ao cadastrar: ${error.message}`);
    }
  };

  return (
    <div id="container">
      <h1>Acessar</h1>
      <p>Email</p>
      <input
        type="email"
        placeholder="Email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <p>Senha</p>
      <input
        type="password"
        placeholder="Password"
        id="senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />
      <button id="cad" onClick={handleLogin}>Acessar</button>
      <button id="cad" onClick={handleRegister}>Cadastrar</button>
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
};

export default SignIn;
