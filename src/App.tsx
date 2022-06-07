import { ChatRoom } from "./components/ChatRoom";
import { useAuthState } from "react-firebase-hooks/auth";
import firebaseService from "./utils/FirebaseUtils";
import "./App.css";

export default function App() {
  const [user] = useAuthState(firebaseService.auth);

  const signUser = async () => {
    await firebaseService.signIn();
  };

  return (
    <div className="container">
      <div className="title">
        <h1>Chat App</h1>
      </div>
      {user ? (
        <ChatRoom user={user} />
      ) : (
        <div className="buttons">
          <button onClick={signUser}>LOGIN GOOGLE</button>
        </div>
      )}
    </div>
  );
}
