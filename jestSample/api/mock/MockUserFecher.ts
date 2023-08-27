import { APIFecherUserInterface } from "../interface/APIFecherUserInterface";
import { User } from "../type/user";

export class MockUserFecher implements APIFecherUserInterface {
  private mock: User;
  public constructor(mockUser: User) {
    this.mock = mockUser;
  }
  public async get(): Promise<User> {
    return this.mock;
  }
}
