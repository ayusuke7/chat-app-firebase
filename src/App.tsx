import { ChatRoom } from "./components/ChatRoom";
import { FormLogin } from "./components/FormLogin";
import { useAuthState } from "react-firebase-hooks/auth";
import firebaseService from "./services/FirebaseService";

export default function App() {
  const [user] = useAuthState(firebaseService.auth);

  return (
    <div className="app-container">
      {user ? <ChatRoom user={user} /> : <FormLogin />}
    </div>
  );
}
