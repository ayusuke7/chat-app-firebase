import { IMessage } from "./message";

export interface IChat {
  chatId: string | null;
  messages?: IMessage[];
}
