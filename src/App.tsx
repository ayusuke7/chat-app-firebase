import { useState } from "react";
import { ListChats } from "./components/ListChats";
import { ChatPage } from "./components/ChatPage";
import { useAuthState } from "react-firebase-hooks/auth";
import firebaseService from "./utils/FirebaseUtils";
import "./App.css";

export default function App() {
  const [isAdm, setIsAdm] = useState(false);
  const [chatId, setChatId] = useState("");

  const [user] = useAuthState(firebaseService.auth);

  const signAdmn = async () => {
    await firebaseService.signIn();
    setIsAdm(true);
  };

  const signUser = async () => {
    await firebaseService.signIn();
  };

  const render = () => {
    if (user && isAdm) {
      return chatId ? (
        <ChatPage
          chatId={chatId}
          user={user}
          onLogout={() => {
            setChatId("");
          }}
        />
      ) : (
        <ListChats
          onClick={(chat) => {
            setChatId(`${chat.chatId}`);
          }}
        />
      );
    }

    if (user && !isAdm) {
      return <ChatPage chatId={user?.uid} user={user} />;
    }

    return (
      <div className="buttons">
        <button onClick={signAdmn}>LOGIN ADMIN</button>
        <button onClick={signUser}>LOGIN CLIENT</button>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="title">
        <h1>Chat App</h1>
      </div>
      {render()}
    </div>
  );
}
