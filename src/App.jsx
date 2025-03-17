import { useState, useEffect } from "react";
import Sala from "./pages/Sala";
import SignIn from "./pages/SignIn";
import { Account } from "appwrite";
import client from "./WriteConfig";

const App = ()=> {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const account = new Account(client);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const loggedInUser = await account.get();
        setUser(loggedInUser);
        console.log("Logged IN", loggedInUser);
      } catch (err) {
        console.log("NOT Logged IN", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  if (loading) {
    return <p>Carregando...</p>;
  }

  return <div>{user ? <Sala /> : <SignIn />}</div>;
}

export default App;
