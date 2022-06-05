import { useAuthState } from "react-firebase-hooks/auth";
import { auth, signIn, signOut } from "./FirebaseUtil";
import { ListChats } from "./pages/ListChats";
import { ChatPage } from "./pages/ChatPage";
import { useState } from "react";
import "./App.css";

export default function App() {
  const [isAdm, setIsAdm] = useState(false);
  const [chatId, setChatId] = useState("");

  const [user] = useAuthState(auth);

  const signAdmn = async () => {
    signIn().then(() => {
      setIsAdm(true);
    });
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
        <button onClick={signIn}>LOGIN CLIENT</button>
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
