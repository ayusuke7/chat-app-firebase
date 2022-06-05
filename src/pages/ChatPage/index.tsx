/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Unsubscribe } from "firebase/database";
import { ChatService } from "../../ChatService";
import { IMessage } from "../../interfaces/message";
import { signOut } from "../../FirebaseUtil";
import { User } from "firebase/auth";

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

  const sendMessage = async (e: any) => {
    if (text.length > 0) {
      try {
        const data: IMessage = {
          timestamp: new Date().toJSON(),
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

  const startChat = async () => {
    chatSubs = chatService.onChangeMessage(chatId, (messages: IMessage[]) => {
      console.log(messages);
      setMessages([...messages]);
    });
  };

  const logout = async (e: any) => {
    if (user) await signOut();

    if (chatSubs) chatSubs();

    if (onLogout) onLogout();
  };

  const formatDate = (dateTime: string) => {
    const [date, time] = dateTime.split("T");
    //${date.split("-").reverse().slice(0, 2).join("/")}

    return `
    ${time.substring(0, 8)}
    `;
  };

  useEffect(() => {
    startChat();
  }, []);

  return (
    <div className="chat-container">
      {/* <img src={`${user.photoURL}`} alt="foto" /> */}

      <h4>ID: {chatId}</h4>

      {user && (
        <>
          <h4>NAME: {user.displayName}</h4>
          <h4>EMAIL: {user.email}</h4>
        </>
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
                  <span>{message.name}</span>
                  <span>{formatDate(message.timestamp)}</span>
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
          onChange={({ target }) => {
            setText(target.value);
          }}
        />
        <button onClick={sendMessage}>ENVIAR</button>
      </div>

      {user && (
        <div className="login">
          <button onClick={logout}>LOGOUT</button>
        </div>
      )}
    </div>
  );
};

export { ChatPage };
