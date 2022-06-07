import React, { useCallback, useEffect, useState } from "react";
import { Unsubscribe } from "firebase/database";
import { ChatService } from "../../services/ChatService";
import { formatDateTime } from "../../utils/Helpers";
import { IMessage } from "../../interfaces/message";
import { User } from "firebase/auth";
import { MdSend, MdExitToApp } from "react-icons/md";
import { IChat } from "../../interfaces/chat";

import firebaseUtil from "../../utils/FirebaseUtils";
import "./styles.css";

const chatService = new ChatService();

interface ChatProps {
  user: User | any;
  height?: number;
}

const ChatRoom: React.FC<ChatProps> = ({ user, height = 480 }) => {
  let chatSub: Unsubscribe;
  let chatsSub: Unsubscribe;

  const [chat, setChat] = useState<IChat>();
  const [chats, setChats] = useState<IChat[]>([]);
  const [text, setText] = useState<string>("");
  const [done, setDone] = useState<boolean>(false);

  const sendMessage = async () => {
    if (text.length > 0) {
      try {
        const data: IMessage = {
          text,
          name: `${user?.displayName}`,
          type: user?.uid === chat?.chatId ? 1 : 2,
        };
        await chatService.sendMessage(`${chat?.chatId}`, data);
        setText("");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const logout = async () => {
    if (user) await firebaseUtil.signOut();

    if (chatSub) chatSub();

    if (chatsSub) chatsSub();
  };

  const scrollToBottom = () => {
    const scroll = document.getElementById("scroll");
    scroll?.scrollIntoView({ behavior: "smooth" });
  };

  const createChat = useCallback(async () => {
    const isChat = await chatService.getChat(`${user?.uid}`);

    if (!isChat) {
      await chatService.createChat(user);
    }

    chatService.onChangeChat(`${user?.uid}`, (value?: IChat) => {
      setChat(value);
      if (!value) setDone(true);
    });
  }, [user]);

  const listChats = useCallback(() => {
    chatService.onChangeChats((data: IChat[]) => {
      setChats(data);
    });
  }, []);

  useEffect(() => {
    return () => {
      user?.email === process.env.REACT_APP_ADM_EMAIL
        ? listChats()
        : createChat();
    };
  }, [user, createChat, listChats]);

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages.length]);

  useEffect(() => {
    if (done) logout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  return (
    <div className="chat-container">
      <div className="chats">
        {chats.map((item, i) => {
          let sel = chat?.chatId === item.chatId;
          let css = "pic";

          if (sel) css += " select";

          return (
            <div
              key={`chat-${i + 1}`}
              className={css}
              onClick={() => {
                setChat(item);
              }}
            >
              {sel && (
                <span
                  onClick={() => {
                    chatService.removeChat(`${chat?.chatId}`);
                  }}
                >
                  x
                </span>
              )}
              <img src={`${item?.photo}`} alt="" />
            </div>
          );
        })}
      </div>
      <div style={{ width: "100%" }}>
        <div className="contact">
          <div className="pic">
            <img src={`${user?.photoURL}`} alt="" />
          </div>
          <div className="content">
            <div className="name">{user?.displayName}</div>
            <div className="seen">{user?.email}</div>
            <div className="seen">{user?.uid}</div>
          </div>
          <div
            className="exit button"
            onClick={() => {
              logout();
            }}
          >
            <MdExitToApp />
          </div>
        </div>

        <div
          className="messages"
          style={
            {
              "--height": `${height}px`,
            } as React.CSSProperties
          }
        >
          {chat?.messages?.map((message, i) => {
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
          <div id="scroll"></div>
        </div>

        {chat && (
          <div className="input">
            <input
              type="text"
              name="message"
              placeholder="Digite o texto aqui..."
              onChange={({ target }) => {
                setText(target.value);
              }}
            />
            <div
              className="button"
              onClick={() => {
                sendMessage();
              }}
            >
              <MdSend />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { ChatRoom };
