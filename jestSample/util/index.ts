const getRandomInt = (max: number): number => {
  return Math.floor(Math.random() * Math.floor(max));
};

// add interface
export interface DatabaseMockInterface {
  /**
   * 数字の配列を受け取りDBに保存する。
   * @param {number[]} param - 数字の配列
   * @throws {Error("fail!")} 失敗時Errorを返す
   */
  save(_: number[]): void;
}

export class DatabaseMock implements DatabaseMockInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public save(_: number[]): void {
    // memo: 課題のために、あえて時々saveが失敗するようにしている
    if (getRandomInt(10) < 2) {
      throw new Error("fail!");
    }
  }
}

// add interface implements
export class DatabaseTestMock implements DatabaseMockInterface {
  public save(_: number[]): void {}
}

// add テスト用のError("fail");を返す関数
export class DatabaseTestFailuerMock implements DatabaseMockInterface {
  public save(_: number[]): void {
    throw Error("fail");
  }
}
