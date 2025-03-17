import React, { useState, useEffect } from "react";
import {
  databases,
  DATABASE_ID,
  COLLECTION_ID_MESSAGES,
  client,
} from "../WriteConfig";
import { ID, Query, Account } from "appwrite";
import "../sala.css";

function Sala() {
  const account = new Account(client);
  const [messages, setMessages] = useState([]);
  const [messagemCorpo, setMensagem] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function getUser() {
      try {
        const loggedUser = await account.get();
        setUser(loggedUser);
      } catch (error) {
        console.error("Erro ao obter usuário:", error);
      }
    }
    getUser();
    pegaMensagens();
  }, []);

  const quandoEnviar = async (event) => {
    event.preventDefault();
    if (!user) {
      console.error("Usuário não autenticado!");
      return;
    }

    let payload = {
      body: messagemCorpo,
      id_user: user.$id, // Agora o ID do usuário é salvo corretamente
      nome_user: user.email || "Anônimo",
    };

    try {
      let resposta = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID_MESSAGES,
        ID.unique(),
        payload
      );
      console.log("Documento criado:", resposta);
      setMessages((prevState) => [resposta, ...prevState]); // Adiciona a nova mensagem corretamente
      setMensagem("");
    } catch (error) {
      console.error("Erro ao criar documento:", error);
    }
  };

  async function logout() {
    await account.deleteSession("current");
    window.location.reload();
  }

  const pegaMensagens = async () => {
    try {
      const resposta = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID_MESSAGES,
        [Query.orderDesc("$createdAt")]
      );
      console.log("Resposta BD:", resposta);
      setMessages(resposta.documents);
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
    }
  };

  return (
    <div className="salaBox">
      <form onSubmit={quandoEnviar} id="mensagem-form">
        <textarea
          required
          placeholder="Apenas digite algo"
          value={messagemCorpo}
          onChange={(event) => setMensagem(event.target.value)}
        />
        <div className="btn-box">
          <input className="btn-send" type="submit" value={"Enviar"} />
          <input
            style={{ marginLeft: 10 }}
            className="btn-send"
            type="button"
            onClick={logout}
            value={"LogOut"}
          />
        </div>
      </form>

      {messages.map((message) => (
        <div key={message.$id} className="dadosBox">
          <div className="menssagemBox">
            <div className="header-mensagem">
              <h1>{message.nome_user}</h1>
              <small>{new Date(message.$createdAt).toLocaleString()}</small>
            </div>
            <div className="corpo-mensagem">
              <p>{message.body}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
export default Sala;
