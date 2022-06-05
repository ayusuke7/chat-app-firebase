import { useEffect, useState } from "react";
import { ChatService } from "../../services/ChatService";
import { IChat } from "../../interfaces/chat";

import "./styles.css";

const chatService = new ChatService();

export interface ListChatsProps {
  onClick?: (chat: IChat) => void;
}

const ListChats: React.FC<ListChatsProps> = ({ onClick }) => {
  const [chats, setChats] = useState<IChat[]>([]);

  const getAllChats = async () => {
    const chats = await chatService.getChats();
    setChats(chats);
  };

  const removeChat = (chatId: string) => {
    chatService.removeChat(chatId).then(() => {
      const tmp = chats;
      const i = chats.findIndex((f) => f.chatId === chatId);
      tmp.splice(i, 1);
      setChats(tmp);
    });
  };

  useEffect(() => {
    getAllChats();
  }, []);

  return (
    <div className="chats">
      {chats.map((item) => {
        return (
          <div className="item" key={item.chatId}>
            <button
              className="chat"
              onClick={() => {
                if (onClick) onClick(item);
              }}
            >
              {item.chatId}
            </button>
            <button
              onClick={() => {
                removeChat(`${item.chatId}`);
              }}
              className="remove"
            >
              X
            </button>
          </div>
        );
      })}
    </div>
  );
};

export { ListChats };
