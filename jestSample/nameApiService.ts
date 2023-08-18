import axios from "axios";

export interface User {
  id: number;
  uid: string;
  name: string;
  first_name: string;
  last_name: string;
  //その他は省略
}

export interface APIFecherUserInterface {
  get(): Promise<User>;
}

export class AxiosApiUserFetcher implements APIFecherUserInterface {
  private URL = "https://random-data-api.com/api/name/random_name";
  public async get(): Promise<User> {
    const { data } = await axios.get<User>(this.URL);
    return data;
  }
}

export class MockApiFecher implements APIFecherUserInterface {
  private mock: User;
  public constructor(mockUser: User) {
    this.mock = mockUser;
  }
  public async get(): Promise<User> {
    return this.mock;
  }
}
// fixed
// - インタフェースに依存させる
// - APIのデータ取得とUserデータを理解してそれを返すサービスとにそれぞれ分ける
// - → それによりUserデータのテストも可能になり、オリジナル版のようにdata.first_name as stringなどとしてキャストしなくて良くなる
export class NameApiService {
  private fetcher: APIFecherUserInterface;
  public constructor(apiFecher: APIFecherUserInterface) {
    this.fetcher = apiFecher;
  }

  public async getUserData(): Promise<User> {
    return this.fetcher.get();
  }

  public async getFirstName(): Promise<string> {
    const user = await this.getUserData();
    const firstName = user.first_name;

    return firstName;
  }
}
