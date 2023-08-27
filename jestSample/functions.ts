import { APIFecherUserInterface } from "./api/interface/APIFecherUserInterface";
import { NameApiService } from "./nameApiService";
import { DatabaseMockInterface } from "./util";

export const sumOfArray = (numbers: number[]): number => {
  return numbers.reduce((a: number, b: number): number => a + b, 0); //fixed reducdeには初期値が必要
};

export const asyncSumOfArray = (numbers: number[]): Promise<number> => {
  return new Promise((resolve): void => {
    resolve(sumOfArray(numbers));
  });
};

// 元々の関数の悪い点
// - 実装に依存しておりテストが出来ない。
// - 時折失敗することが明示できず、またテストも出来ない。

// 修正版
// - interfaceに依存させて外部から注入する。
// - TSは言語仕様上throwableかどうかを明示できないため、エラーを受け取り得ることを明示する
// 補足：方法として①JSDocを書く、②TSでエラー型を作る、③Errorをreturnする、などの方法がある。今回は①を採用
export const asyncSumOfArraySometimesZero = (
  numbers: number[],
  database: DatabaseMockInterface
): Promise<number> => {
  return new Promise((resolve, reject): void => {
    try {
      database.save(numbers); // fixed クラスに依存したい場合、実装ではなく抽象（インタフェース）に依存させる
      resolve(sumOfArray(numbers));
    } catch (error) {
      reject(0);
    }
  });
};

// 元々の関数の悪い点
// - 実装に依存しておりテストが出来ない。
// - APIからデータを取得する関数にロジック(文字数の制限、firstnameの取得)が書かれてしまっている

// 修正版
// - interfaceに依存させて外部から注入する。
// - API取得とUserデータを理解し操作するクラス、そしてfirstnameの長さをチェックする関数、とそれぞれの役割と責務を分けるべき
export const getFirstNameThrowIfLong = async (
  maxNameLength: number,
  fetcher: APIFecherUserInterface
): Promise<string> => {
  const nameApiService = new NameApiService(fetcher);
  const firstName = await nameApiService.getFirstName();

  if (firstName.length > maxNameLength) {
    throw new Error("first_name too long");
  }
  return firstName;
};
