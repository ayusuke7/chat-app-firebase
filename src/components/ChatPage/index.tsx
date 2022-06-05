import React, { useCallback, useEffect, useState } from "react";
import { Unsubscribe } from "firebase/database";
import { ChatService } from "../../services/ChatService";
import { formatDateTime } from "../../utils/Helpers";
import { IMessage } from "../../interfaces/message";
import { User } from "firebase/auth";

import firebaseUtil from "../../utils/FirebaseUtils";
import "./styles.css";

const chatService = new ChatService();

interface ChatProps {
  chatId: string;
  user: User | null | undefined;
  onLogout?: () => void;
}

const ChatPage: React.FC<ChatProps> = ({ chatId, user, onLogout }) => {
  let chatSubs: Unsubscribe;

  const [text, setText] = useState<string>("");
  const [messages, setMessages] = useState<IMessage[]>([]);

  const createChat = useCallback(async () => {
    const chat = await chatService.getChat(chatId);
    console.log(chat);

    if (!chat) {
      await chatService.createChat({
        chatId,
        email: `${user?.email}`,
        userName: `${user?.displayName}`,
      });
    }

    /* Listenner */
    chatService.onAddMessage(chatId, (message: IMessage) => {
      console.log(message);
      setMessages((prev) => prev.concat(message));
    });
  }, [chatId, user]);

  const sendMessage = async (e: any) => {
    if (text.length > 0) {
      try {
        const data: IMessage = {
          name: `${user?.displayName}`,
          type: user ? 1 : 2,
          text: text,
        };
        await chatService.sendMessage(chatId, data);
        setText("");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const logout = async (e: any) => {
    if (user) await firebaseUtil.signOut();

    if (chatSubs) chatSubs();

    if (onLogout) onLogout();
  };

  useEffect(() => {
    return () => {
      createChat();
    };
  }, [createChat]);

  return (
    <div className="chat-container">
      {/* <img src={`${user.photoURL}`} alt="foto" /> */}

      {user && (
        <div className="contact">
          <div className="pic">
            <img src={`${user?.photoURL}`} alt="" />
          </div>
          <div className="content">
            <div className="name">{user?.displayName}</div>
            <div className="seen">{user?.email}</div>
            <div className="seen">{user?.uid}</div>
          </div>
          <div className="exit">
            <button onClick={logout}>LOGOUT</button>
          </div>
        </div>
      )}

      <div className="messages">
        {messages.map((message, i) => {
          let css = "message";
          if (message.type === 2) {
            css += " receive";
          }

          return (
            <div key={`msg-${i + 1}`} className={css}>
              <div>
                <div className="text">{message.text}</div>
                <div className="time">
                  {/* <span>{message.name}</span> */}
                  <span>{formatDateTime(message.timestamp, true)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="input">
        <input
          type="text"
          name="message"
          placeholder="Digite o texto aqui..."
          onChange={({ target }) => {
            setText(target.value);
          }}
        />
        <button onClick={sendMessage}>ENVIAR</button>
      </div>
    </div>
  );
};

export { ChatPage };
