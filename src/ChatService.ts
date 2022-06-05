import {
  ref,
  get,
  set,
  push,
  child,
  onValue,
  onChildAdded,
  DatabaseReference,
  DataSnapshot,
  Unsubscribe,
  remove,
} from "firebase/database";
import { database } from "./FirebaseUtil";
import { IChat } from "./interfaces/chat";
import { IMessage } from "./interfaces/message";
import { v4 as uuid } from "uuid";

export class ChatService {
  public rootRef: DatabaseReference;

  constructor() {
    this.rootRef = ref(database, "chats");
  }

  async createChat(data: IMessage): Promise<string> {
    const chatId = uuid();
    const newChat = child(this.rootRef, chatId);
    await set(push(newChat), data);
    return chatId;
  }

  async removeChat(chatKey: string): Promise<void> {
    const chatRef = child(this.rootRef, chatKey);
    return remove(chatRef);
  }

  async getChats(): Promise<IChat[]> {
    const chats: IChat[] = [];
    const snapshot = await get(this.rootRef);

    if (snapshot.exists()) {
      snapshot.forEach((chat: DataSnapshot) => {
        const data = chat.val();
        const messages = Object.keys(data).map((k) => {
          const m = data[k] as IMessage;
          m.id = k;
          return m;
        });
        chats.push({ chatId: chat.key, messages });
      });
    }

    return chats;
  }

  async getMessages(chatKey: string): Promise<IMessage[]> {
    const chatRef = child(this.rootRef, chatKey);
    const snapshot = await get(chatRef);

    if (snapshot.exists()) {
      return snapshot.val();
    }

    return Promise.resolve([]);
  }

  async sendMessage(chatKey: string, data: IMessage): Promise<void> {
    const chat = child(this.rootRef, chatKey);
    const newMessage = push(chat);
    return set(newMessage, data);
  }

  onAddMessage(chatKey: string, onAdd: (data: IMessage) => void): Unsubscribe {
    const chatRef = child(this.rootRef, chatKey);
    const callback = (data: DataSnapshot) => {
      onAdd(data.val() as IMessage);
    };
    return onChildAdded(chatRef, callback);
  }

  onChangeMessage(
    chatKey: string,
    onChange: (data: IMessage[]) => void
  ): Unsubscribe {
    const chatRef = child(this.rootRef, chatKey);
    const callback = (data: DataSnapshot) => {
      const messages: IMessage[] = [];
      data.forEach((m) => {
        messages.push(m.val() as IMessage);
      });
      onChange(messages);
    };
    return onValue(chatRef, callback);
  }
}
