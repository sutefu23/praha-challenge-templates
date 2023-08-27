import axios from "axios";
import { APIFecherUserInterface } from "../interface/APIFecherUserInterface";
import { User } from "../type/user";
export class AxiosApiUserFetcher implements APIFecherUserInterface {
  private URL = "https://random-data-api.com/api/name/random_name";
  public async get(): Promise<User> {
    const { data } = await axios.get<User>(this.URL);
    return data;
  }
}
