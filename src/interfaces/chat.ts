import { IMessage } from "./message";

export interface IChat {
  messages: IMessage[];
  chatId: string | null;
  userName: string;
  email: string;
  photo?: string;
  timestamp?: string;
}
