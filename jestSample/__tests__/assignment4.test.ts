import { saveUser, termDisplay, tubofuriBakuchi } from "../assignment4";

function createString(length: number): string {
  return new Array(length + 1).join('a');
}

describe('# assignment4 unit test \n', () => {
  describe('## termDisplay() \n', () => {
    beforeEach(() => {
      jest.useFakeTimers('modern');
      jest.setSystemTime(new Date('2020-01-01'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('- `displayFrom < today < displayTo`の場合、"<p>お知らせ:**</p>"が返ってくる \n', () => {
      let result = termDisplay(new Date('2019-12-31'), new Date('2020-01-02'), 'test content');
      expect(result).toBe('<p>お知らせ:test content</p>')
    })

    test('- `displayFrom < displayTo < today`の場合、"<p>まだお知らせはありません</p>"が返ってくる \n', () => {
      let result = termDisplay(new Date('2019-12-30'), new Date('2019-12-31'), 'test content');
      expect(result).toBe('<p>まだお知らせはありません</p>')
    })

    test('- `displayTo < displayFrom < today`の場合、`Error("displayFromはdisplayToより未来にすることは出来ません。")`がthrowされる \n', () => {
      expect(() => {
        termDisplay(new Date('2019-12-31'), new Date('2019-12-30'), 'test content');
      }).toThrow(new Error('displayFromはdisplayToより未来にすることは出来ません。'))
    })

    test('- `displayFrom == today == displayTo`の場合、"<p>お知らせ:**</p>"が返ってくる \n', () => {
      let result = termDisplay(new Date('2020-01-01'), new Date('2020-01-01'), 'test content');
      expect(result).toBe('<p>お知らせ:test content</p>')
    })
  })

  describe('## saveUser() \n', () => {

    test('- nameの文字数が20文字より長い場合、`Error("ユーザー名が長すぎる")`がthrowされる \n', () => {
      expect(() => {
        saveUser(createString(21), '', '');
      }).toThrow(new Error("ユーザー名が長すぎる"))
    })

    describe('### nameの文字数が20文字以下の場合 \n', () => {
      test('- emailの文字数が100文字より長い場合、`Error("メールアドレスが長すぎる")`がthrowされる \n', () => {
        expect(() => {
          saveUser(createString(5), createString(101), '');
        }).toThrow(new Error("メールアドレスが長すぎる"))
      })

      describe('#### emailの文字数が100文字以下の場合 \n', () => {
        test('- passwordの文字数が5文字より短い場合、`Error("パスワードが短すぎる")`がthrowされる \n', () => {
          expect(() => {
            saveUser(createString(5), createString(5), createString(4));
          }).toThrow(new Error("パスワードが短すぎる"))
        })

        describe('##### passwordの文字数が5文字以上の場合 \n', () => {
          test('- emailが正規表現の`.+@.+\..+`にマッチしない場合、`Error("メールアドレスが不正")`がthrowされる \n', () => {
            expect(() => {
              saveUser(createString(5), 'mail_address', createString(5));
            }).toThrow(new Error("メールアドレスが不正"))
          })

          describe('###### emailが正規表現の`.+@.+\..+`にマッチする場合 \n', () => {
            test('- `Math.random()`の結果が0.1より小さい場合、`Error("保存に失敗しました")`がthrowされる \n', () => {
              // 準備
              const originalRandom = Math.random;
              Math.random = jest.fn(() => 0.001);
              // 実行 確認
              expect(() => {
                saveUser(createString(5), 'mail@mail.com', createString(5));
              }).toThrow(new Error("保存に失敗しました"))

              Math.random = originalRandom;
            })

            test('- `Math.random()`の結果が0.1以上の場合、console log"ユーザーを保存しました。名前:${name}, Email:${email}, Pass:${password}"が出力される \n', () => {
              // 準備
              const originalRandom = Math.random;
              const originalConsoleLog = console.log;
              Math.random = jest.fn(() => 0.5);
              console.log = jest.fn();
              // 実行 確認
              saveUser('name', 'mail@mail.com', 'password');
              // 確認
              expect(console.log).toHaveBeenCalledWith('ユーザーを保存しました。名前:name, Email:mail@mail.com, Pass:password')

              Math.random = originalRandom;
              console.log = originalConsoleLog
            })
          })

        })
      })
    })
  })

  describe('## tubofuriBakuchi() \n', () => {
    let mockMathRandom: jest.SpyInstance;
    let consoleLogMock: jest.SpyInstance;

    beforeEach(() => {
      // モック化
      mockMathRandom = jest.spyOn(Math, 'random');
      consoleLogMock = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
      // モックのリセット
      mockMathRandom.mockRestore();
      consoleLogMock.mockRestore();
    });

    test('- 関数をcallすると博打の準備を呼びかけるconsole logが表示される \n', () => {
      // 準備
      mockMathRandom.mockReturnValueOnce(0.1).mockReturnValueOnce(0.1);
      // 実行
      tubofuriBakuchi('丁');
      // 確認
      expect(consoleLogMock).toHaveBeenCalledWith('ようござんすね？\n');
      expect(consoleLogMock).toHaveBeenCalledWith('ようござんすか？\n');
      expect(consoleLogMock).toHaveBeenCalledWith('入ります。\n');
    })

    describe("### userBetが'丁'の場合 \n", () => {
      test('サイコロの結果が丁の場合、console logで"あんさんの勝ちや"と表示される', () => {
        // 準備
        mockMathRandom.mockReturnValueOnce(0.1).mockReturnValueOnce(0.1);
        // 実行
        tubofuriBakuchi('丁');
        // 確認 
        expect(consoleLogMock).toHaveBeenCalledWith('あんさんの勝ちや');
      })

      test('サイコロの結果が半の場合、console logで"あんさんの負けや"と表示される', () => {
        // 準備
        mockMathRandom.mockReturnValueOnce(0.1).mockReturnValueOnce(0.2);
        // 実行
        tubofuriBakuchi('丁');
        // 確認 
        expect(consoleLogMock).toHaveBeenCalledWith('あんさんの負けや');
      })
    })

    describe("### userBetが'半'の場合 \n", () => {
      test('サイコロの結果が丁の場合、console logで"わての勝ちや"と表示される', () => {
        // 準備
        mockMathRandom.mockReturnValueOnce(0.1).mockReturnValueOnce(0.1);
        // 実行
        tubofuriBakuchi('半');
        // 確認 
        expect(consoleLogMock).toHaveBeenCalledWith('わての勝ちや');
      })

      test('サイコロの結果が半の場合、console logで"わてのの負けや"と表示される', () => {
        // 準備
        mockMathRandom.mockReturnValueOnce(0.1).mockReturnValueOnce(0.2);
        // 実行
        tubofuriBakuchi('半');
        // 確認 
        expect(consoleLogMock).toHaveBeenCalledWith('わてのの負けや');
      })
    })

    test("userBetが'丁'でも'半'でもない場合、Error(\"ナメとんかいワレ！\")がthrowされる", () => {
        // 準備
        mockMathRandom.mockReturnValueOnce(0.1).mockReturnValueOnce(0.1);
        // 実行 確認 
        expect(() => {
          tubofuriBakuchi('凸');
        }).toThrow(new Error("ナメとんかいワレ！"))
    })
  })
});