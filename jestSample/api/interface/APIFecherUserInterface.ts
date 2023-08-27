import { User } from "../type/user";

export interface APIFecherUserInterface {
  get(): Promise<User>;
}
