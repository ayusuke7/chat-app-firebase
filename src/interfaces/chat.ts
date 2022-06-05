import { IMessage } from "./message";

export interface IChat {
  chatId: string | null;
  userName: string;
  email: string;
  asunto?: string;
  timestamp?: string;
  messages?: IMessage[];
}
