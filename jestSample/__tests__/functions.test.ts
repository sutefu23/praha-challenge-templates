// todo: ここに単体テストを書いてみましょう！

import {
  sumOfArray,
  asyncSumOfArray,
  asyncSumOfArraySometimesZero,
  getFirstNameThrowIfLong,
} from "../functions";

import { DatabaseTestFailuerMock, DatabaseTestMock } from "../util";

import {
  sumOfArray as regacySumOfArray,
  asyncSumOfArray as regacyAsyncSumOfArray,
} from "../functions.org";
import { MockUserFecher } from "../api/mock/MockUserFecher";
import { NameApiService } from "../nameApiService";

describe("sumOfArrayで配列の合計が返ってくるテスト", (): void => {
  test("1,2だと3が返る", (): void => {
    expect(sumOfArray([1, 2])).toBe(3);
  });

  test("2,4,6だと12が返る", async (): Promise<void> => {
    expect(sumOfArray([2, 4, 6])).toBe(12);
  });

  test("オリジナル版は空の配列だとランタイムエラーが走る", (): void => {
    expect(regacySumOfArray([])).toBe(0);
  });

  test("修正後は空の配列だと0が返る", (): void => {
    expect(regacySumOfArray([])).toBe(0);
  });

  test("stringの配列だとビルドエラーが走る", (): void => {
    // そもそもビルドできないのでコメントアウト
    // expect(sumOfArray(["2", "あ"])).toBe(0);
  });
});

describe("asyncSumOfArrayで配列の合計が返ってくるテスト", (): void => {
  test("1,2だと3が返る", async (): Promise<void> => {
    await expect(asyncSumOfArray([1, 2])).resolves.toBe(3);
  });

  test("2,4,6だと12が返る", async (): Promise<void> => {
    await expect(asyncSumOfArray([2, 4, 6])).resolves.toBe(12);
  });

  test("オリジナル版は空の配列だとランタイムエラーが走る", async (): Promise<
    void
  > => {
    await expect(regacyAsyncSumOfArray([])).resolves.toBe(0);
  });

  test("修正後は空の配列だと0が返る", async (): Promise<void> => {
    await expect(regacyAsyncSumOfArray([])).resolves.toBe(0);
  });

  test("stringの配列だとビルドエラーが走る", async (): Promise<void> => {
    // そもそもビルドできないのでコメントアウト
    // await expect(asyncSumOfArray(["2", "あ"])).resolves.toBe(0);
  });
});

describe("asyncSumOfArraySometimesZeroで配列の合計と時々0が返ってくるテスト", (): void => {
  const testDatabase = new DatabaseTestMock();
  const testFailuerDatabase = new DatabaseTestFailuerMock();
  test("1,2だと3が返る", async (): Promise<void> => {
    await expect(
      asyncSumOfArraySometimesZero([1, 2], testDatabase)
    ).resolves.toBe(3);
  });

  test("2,4,6だと12が返る", async (): Promise<void> => {
    await expect(
      asyncSumOfArraySometimesZero([2, 4, 6], testDatabase)
    ).resolves.toBe(12);
  });

  test("失敗するとrejectで0が返る", async (): Promise<void> => {
    await expect(
      asyncSumOfArraySometimesZero([2, 4, 6], testFailuerDatabase)
    ).rejects.toBe(0);
  });
});
describe("getFirstNameThrowIfLongでFirstNameと規定値以上の時エラーが返ってくるテスト", (): void => {
  const mockUser = {
    id: 2,
    uid: "",
    name: "Tomohide Hirakawa",
    // eslint-disable-next-line @typescript-eslint/camelcase
    first_name: "Tomohide",
    // eslint-disable-next-line @typescript-eslint/camelcase
    last_name: "Hirakawa",
  };
  const testFecher = new MockUserFecher(mockUser);

  test("長さ制限20だと無事FirstNameが返ってくる", async (): Promise<void> => {
    await expect(getFirstNameThrowIfLong(20, testFecher)).resolves.toMatch(
      /^[A-Za-z]+$/
    );
  });

  test("長さ制限5だと制限に引っかかって`first_name too long`エラーが返ってくる", async (): Promise<
    void
  > => {
    await expect(getFirstNameThrowIfLong(5, testFecher)).rejects.toThrow(
      new Error("first_name too long")
    );
  });
});

describe("nameApiServiceのテスト", (): void => {
  const mockUser = {
    id: 1,
    uid: "",
    name: "Tomohide Hirakawa",
    // eslint-disable-next-line @typescript-eslint/camelcase
    first_name: "Tomohide",
    // eslint-disable-next-line @typescript-eslint/camelcase
    last_name: "Hirakawa",
  };
  const testFecher = new MockUserFecher(mockUser);
  const service = new NameApiService(testFecher);
  test("UserdataのMock取得テスト", async (): Promise<void> => {
    await expect(service.getUserData()).resolves.toStrictEqual(mockUser);
  });

  test("UserdataのMockのデータ構造にFirstNameが含まれているか", async (): Promise<
    void
  > => {
    await expect(service.getUserData()).resolves.toHaveProperty("first_name");
  });

  test("UserdataのMockのデータ構造はFirstNameがTomohideか", async (): Promise<
    void
  > => {
    await expect(service.getUserData()).resolves.toHaveProperty(
      "first_name",
      "Tomohide"
    );
  });

  test("getFirstNameでUserのfirst_nameが取れているか", async (): Promise<
    void
  > => {
    const user = await service.getUserData();
    await expect(service.getFirstName()).resolves.toEqual(user.first_name);
  });
});
