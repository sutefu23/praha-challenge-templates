import { APIFecherUserInterface } from "./api/interface/APIFecherUserInterface";
import { User } from "./api/type/user";
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
