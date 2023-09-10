import { termDisplay, tubofuriBakuchi, saveUser } from "../assignment4";

describe("termDisplayのテスト", (): void => {
  beforeAll((): void => {
    jest.useFakeTimers("modern");
  });
  afterAll((): void => {
    jest.useRealTimers();
  });
  test("引数のdisplayFromとdisplayToを逆にするとError", (): void => {
    const displayFrom = new Date(2023, 12, 1);
    const displayTo = new Date(2023, 11, 1);
    expect((): string =>
      termDisplay(displayFrom, displayTo, "test")
    ).toThrowError("displayFromはdisplayToより未来にすることは出来ません。");
  });
  test("期間内のときに表示が正しく返ってくるか", (): void => {
    jest.setSystemTime(new Date(2023, 10, 15, 0, 0, 0, 0));
    const displayFrom = new Date(2023, 10, 1);
    const displayTo = new Date(2023, 11, 1);
    expect(termDisplay(displayFrom, displayTo, "test")).toBe(
      "<p>お知らせ:test</p>"
    );
  });
  test("期間外のときには「まだお知らせはありません」と出る", (): void => {
    jest.setSystemTime(new Date(2023, 9, 15, 0, 0, 0, 0));
    const displayFrom = new Date(2023, 10, 1);
    const displayTo = new Date(2023, 11, 1);
    expect(termDisplay(displayFrom, displayTo, "test")).toBe(
      "<p>まだお知らせはありません</p>"
    );
  });
  test("期間が1秒でも過ぎるとお知らせの表示はデフォルト表示に戻る", (): void => {
    const displayFrom = new Date(2023, 1, 1, 0, 0, 0);
    const displayTo = new Date(2023, 1, 1, 0, 0, 10);
    jest.setSystemTime(new Date(2023, 0, 31, 23, 59, 59)); //2023年1月31日23時59分59秒
    expect(termDisplay(displayFrom, displayTo, "testtest")).toBe(
      "<p>まだお知らせはありません</p>"
    );
    jest.setSystemTime(new Date(2023, 1, 1, 0, 0, 0)); //2023年2月1日0時0分0秒
    expect(termDisplay(displayFrom, displayTo, "testtest")).toBe(
      "<p>お知らせ:testtest</p>"
    );
    jest.setSystemTime(new Date(2023, 1, 1, 0, 0, 11)); //2023年2月1日0時0分11秒
    expect(termDisplay(displayFrom, displayTo, "test")).toBe(
      "<p>まだお知らせはありません</p>"
    );
  });
});

describe("saveUserのテスト", (): void => {
  const validName = "平川知秀";
  const invalidNameToolong =
    "平川大納言筑前上忠助（ひらかわだいなごんちくぜんのかみただすけ）";
  const validEmail = "hirakawa@yahoo.co.jp";
  const inValidEmailChar = "headteheya.co.jp";
  const invalidEmailTooLong =
    "longemailaddress1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwx1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwx1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwx1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@example.com";
  const validPassword = "aadibboga";
  const invalidPasswordTooShort = "aaa";
  const invalidPasswordTooLong = "aadibbogaaddieknegingagakdigh";

  test("ユーザー名が長すぎるエラー", (): void => {
    expect((): void => {
      saveUser(invalidNameToolong, validEmail, validPassword);
    }).toThrow("ユーザー名が長すぎる");
  });
  test("メールアドレスが長すぎるエラー", (): void => {
    expect((): void => {
      saveUser(validName, invalidEmailTooLong, validPassword);
    }).toThrow("メールアドレスが長すぎる");
  });
  test("パスワードが短すぎるエラー", (): void => {
    expect((): void => {
      saveUser(validName, validEmail, invalidPasswordTooShort);
    }).toThrow("パスワードが短すぎる");
  });
  test("パスワードが長すぎるエラー", (): void => {
    expect((): void => {
      saveUser(validName, validEmail, invalidPasswordTooLong);
    }).toThrow("パスワードが長すぎる");
  });

  test("メールアドレスが不正な文字列であるエラー", (): void => {
    expect((): void => {
      saveUser(validName, inValidEmailChar, validPassword);
    }).toThrow("メールアドレスが不正");
  });

  test("保存に失敗したエラー", (): void => {
    const randomFailSpy = jest
      .spyOn(global.Math, "random")
      .mockReturnValue(0.005);
    expect((): void => {
      saveUser(validName, validEmail, validPassword);
    }).toThrow("保存に失敗しました");
    randomFailSpy.mockRestore();
  });
  test("保存が成功して正しくコンソールに出力されるか", (): void => {
    const randomSuccessSpy = jest
      .spyOn(global.Math, "random")
      .mockReturnValue(0.01); //成功
    const consoleLogSpy = jest
      .spyOn(global.console, "log")
      .mockImplementation((log): string => log);
    saveUser(validName, validEmail, validPassword);

    expect(consoleLogSpy.mock.calls[0][0]).toBe(
      `ユーザーを保存しました。名前:${validName}, Email:${validEmail}, Pass:${validPassword}`
    );

    randomSuccessSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });
});

describe("tubofuriBakuchiのconsole出力テスト", (): void => {
  let consoleLogSpy: jest.SpyInstance;

  beforeEach((): void => {
    // console.logをスパイ。受け取った値を返すように
    consoleLogSpy = jest
      .spyOn(console, "log")
      .mockImplementation((log): string => log);
  });
  afterEach((): void => {
    // スパイをリセット
    jest.restoreAllMocks();
  });

  test("console.logが合計6回呼ばれるか", (): void => {
    tubofuriBakuchi("丁");
    expect(consoleLogSpy.mock.calls.length).toBe(6);
  });
  test("console.log1回目は「ようござんすね？」", (): void => {
    tubofuriBakuchi("丁");
    expect(consoleLogSpy.mock.calls[0][0]).toBe("ようござんすね？\n");
  });
  test("console.log2回目は「ようござんすか？」", (): void => {
    tubofuriBakuchi("丁");
    expect(consoleLogSpy.mock.calls[1][0]).toBe("ようござんすか？\n");
  });
  test("console.log3回目は「入ります。」", (): void => {
    tubofuriBakuchi("丁");
    expect(consoleLogSpy.mock.calls[2][0]).toBe("入ります。\n");
  });
  test("console.log4回目は「`${dice1}、${dice2}の${result}！\n`」", (): void => {
    tubofuriBakuchi("丁");
    expect(consoleLogSpy.mock.calls[3][0]).toMatch(/[1-6]、[1-6]の(丁|半)！\n/);
  });
  test("console.log5回目は「`あんさんの手：${userBet}\n`」", (): void => {
    tubofuriBakuchi("半");
    expect(consoleLogSpy.mock.calls[4][0]).toBe("あんさんの手：半\n");
  });
  test("console.log6回目は丁の時「`あんさんの勝ちや`」もしくは「あんさんの負けや」", (): void => {
    tubofuriBakuchi("丁");
    expect(consoleLogSpy.mock.calls[5][0]).toMatch(
      /(あんさんの勝ちや|あんさんの負けや)/
    );
  });
  test("console.log6回目は半の時「`わての負けや`」もしくは「わての勝ちや」", (): void => {
    tubofuriBakuchi("半");
    expect(consoleLogSpy.mock.calls[5][0]).toMatch(
      /(わての負けや|わての勝ちや)/
    );
  });

  test("丁半以外の値を引数に入れるとエラー", (): void => {
    expect((): void => tubofuriBakuchi("分かりません")).toThrow(
      "ナメとんかいワレ！"
    );
  });
});
describe("tubofuriBakuchiの出目を半に固定したときの出力テスト", (): void => {
  let consoleLogSpy: jest.SpyInstance;
  let oddDiceMock: jest.SpyInstance;
  beforeEach((): void => {
    // console.logをスパイ。受け取った値を返すように
    consoleLogSpy = jest
      .spyOn(console, "log")
      .mockImplementation((log): string => log);
    oddDiceMock = jest
      .spyOn(Math, "random")
      .mockReturnValueOnce(0.0) // 1に変換
      .mockReturnValueOnce(0.5); // 4に変換
  });
  afterEach((): void => {
    jest.restoreAllMocks();
  });
  test("console.log4回目は「`1、4の半！」", (): void => {
    tubofuriBakuchi("丁");
    expect(consoleLogSpy.mock.calls[3][0]).toBe("1、4の半！\n");
  });
  test("ユーザーが半の手で勝つとconsole.log6回目は「わての負けや」", (): void => {
    tubofuriBakuchi("半");
    expect(consoleLogSpy.mock.calls[5][0]).toBe("わての負けや");
  });
  test("ユーザーが丁の手で負けるとconsole.log6回目は「あんさんの負けや」", (): void => {
    tubofuriBakuchi("丁");
    expect(consoleLogSpy.mock.calls[5][0]).toBe("あんさんの負けや");
  });
});
describe("tubofuriBakuchiの出目を丁ああに固定したときの出力テスト", (): void => {
  let consoleLogSpy: jest.SpyInstance;
  let evenDiceMock: jest.SpyInstance;
  beforeEach((): void => {
    // console.logをスパイ。受け取った値を返すように
    consoleLogSpy = jest
      .spyOn(console, "log")
      .mockImplementation((log): string => log);
    evenDiceMock = jest
      .spyOn(Math, "random")
      .mockReturnValueOnce(0.2) // 2に変換
      .mockReturnValueOnce(0.3); // 2に変換
  });
  afterEach((): void => {
    jest.restoreAllMocks();
  });
  test("console.log4回目は「`2、2の丁！」", (): void => {
    tubofuriBakuchi("半");
    expect(consoleLogSpy.mock.calls[3][0]).toBe("2、2の丁！\n");
  });
  test("ユーザーが丁の手で勝つとconsole.log6回目は「あんさんの勝ちや」", (): void => {
    tubofuriBakuchi("丁");
    expect(consoleLogSpy.mock.calls[5][0]).toBe("あんさんの勝ちや");
  });
  test("ユーザーが半の手で負けるとconsole.log6回目は「わての勝ちや」", (): void => {
    tubofuriBakuchi("半");
    expect(consoleLogSpy.mock.calls[5][0]).toBe("わての勝ちや");
  });
});
