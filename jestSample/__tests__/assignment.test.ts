import { termDisplay, tubofuriBakuchi, saveUser } from "../assignment4";


describe("termDisplay()", () => {

    // Date()で固定の日付が返るようにする
    const mockDate: Date = new Date("2023/08/31");
    beforeEach(() => {
        jest.useFakeTimers("modern").setSystemTime(mockDate.getTime());
    });
    
    afterEach(() => {
        jest.useRealTimers();
    });

    test('表示開始日時が表示終了日時より、後の場合例外がThrowされる', () => {
        const displayFrom: Date = new Date("2023/10/01");
        const displayTo : Date = new Date("2023/09/01");
        const noticeContent: string = "いいお知らせです";

        expect(() => termDisplay(displayFrom, displayTo, noticeContent))
                .toThrowError("displayFromはdisplayToより未来にすることは出来ません。");
    });

    test.each`
         from       |       to        | noticeContent  |          expected
    ${"2023/08/30"} | ${"2023/09/01"} | ${"テストです"}  | ${"<p>お知らせ:テストです</p>"}   
    ${"2023/08/31"} | ${"2023/09/01"} | ${"テストです"}  | ${"<p>お知らせ:テストです</p>"}
    ${"2023/08/30"} | ${"2023/08/31"} | ${"テストです"}  | ${"<p>お知らせ:テストです</p>"}
    ${"2023/08/31"} | ${"2023/08/31"} | ${"テストです"}  | ${"<p>お知らせ:テストです</p>"}
    ${"2023/09/01"} | ${"2023/09/01"} | ${"テストです"}  | ${"<p>まだお知らせはありません</p>"}
    ${"2023/08/29"} | ${"2023/08/30"} | ${"テストです"}  | ${"<p>まだお知らせはありません</p>"} 
    `('表示開始日時:$from、表示終了日時:$to、お知らせ:$noticeContentの場合、$expectedが返る', ({from, to, noticeContent, expected}) => {
        const displayFrom: Date = new Date(from);
        const displayTo: Date = new Date(to);

        const actual: string = termDisplay(displayFrom, displayTo, noticeContent);
        console.log(actual);

        expect(actual).toBe(expected);
    });
})

describe("saveUser()", () => {
    const originalConsoleLog = console.log;
    beforeAll(() => {
        console.log = jest.fn();
    });

    afterAll(() => {
        console.log = originalConsoleLog;
    });

    describe("保存が失敗しないケース", () => {
        const originalMathRandom = Math.random;

        beforeEach(() => {
            Math.random = jest.fn(() => 1.0);
        });

        afterEach(() => {
            Math.random = originalMathRandom;
        });

        test("すべての入力値が正常範囲内であれば標準出力にメッセージが表示される", () => {
            // 20文字
            const name: string = "あいうえおかきくけこさしすせそたちつてと";
            // 100文字
            const email: string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzABCDEFGHIJ@example.com";
            // 20文字
            const password: string = "TestCorrectPassword1";

            saveUser(name, email, password);

            expect(console.log).toHaveBeenCalledWith("ユーザーを保存しました。名前:あいうえおかきくけこさしすせそたちつてと, Email:abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzABCDEFGHIJ@example.com, Pass:TestCorrectPassword1");
        });

        test("ユーザー名が20文字より長い場合、例外がスローされる", () => {
            const name: string = "あいうえおかきくけこさしすせそたちつてとな";
            const email: string = "sample@example.com";
            const password: string = "TestPassword";
            
            expect(() => saveUser(name, email, password)).toThrowError("ユーザー名が長すぎる");
        });

        test("メールアドレスが100文字より長い場合、例外がスローされる", () => {
            const name: string = "あいうえお";
            const email: string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzABCDEFGHIJK@example.com";
            const password: string = "TestPassword";
            
            expect(() => saveUser(name, email, password)).toThrowError("メールアドレスが長すぎる");
        });

        test("パスワードが5文字より短い場合、例外がスローされる", () => {
            const name: string = "あいうえお";
            const email: string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzABCDEFGHIJ@example.com";
            const password: string = "Test";
            
            expect(() => saveUser(name, email, password)).toThrowError("パスワードが短すぎる");
        });

        test("パスワードが20文字より長い場合、例外がスローされる", () => {
            const name: string = "あいうえお";
            const email: string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzABCDEFGHIJ@example.com";
            const password: string = "TooLongTestPassword12";
            
            expect(() => saveUser(name, email, password)).toThrowError("パスワードが長すぎる");
        });
        test("メールアドレスが不正な形式の場合、例外がスローされる", () => {
            const name: string = "あいうえお";
            const email: string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUV";
            const password: string = "TestPassword";
            
            expect(() => saveUser(name, email, password)).toThrowError("メールアドレスが不正");
        });
    })

    describe("保存が失敗するケース", () => {
        const originalMathRandom = Math.random;

        beforeEach(() => {
            Math.random = jest.fn(() => 0.001);
        });

        afterEach(() => {
            Math.random = originalMathRandom;
        });

        test("すべての入力値が正常範囲内であっても例外がスローされる", () => {
            // 20文字
            const name: string = "あいうえおかきくけこさしすせそたちつてと";
            // 100文字
            const email: string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzABCDEFGHIJ@example.com";
            // 20文字
            const password: string = "TestCollectPassword1";

            expect(() => saveUser(name, email, password)).toThrowError("保存に失敗しました");
        });
    });
});

describe("tubofuriBakuchi()", () => {
    const originalConsoleLog = console.log;
    let consoleLogs: string[];

    beforeAll(() => {
        console.log = jest.fn((...args: []) => {
            consoleLogs.push(args.join(' '))
        });
    });

    afterAll(() => {
        console.log = originalConsoleLog;
    });

    beforeEach(() => {
        consoleLogs = [];
    });

    describe("サイコロの出目が丁になる",() => {
        test("丁を入力した場合、わてが勝利する", () => {
            const mockMathRandom = jest.spyOn(Math,"random").mockReturnValue(0.1);
            const userBet: string = "丁";
            const expected: string[] = [
                "ようござんすね？\n",
                "ようござんすか？\n",
                "入ります。\n",
                "1、1の丁！\n",
                "あんさんの手：丁\n",
                "あんさんの勝ちや"
            ]
            tubofuriBakuchi(userBet);

            expect(consoleLogs).toEqual(expected);
            mockMathRandom.mockRestore();
        });

        test("半を入力した場合、わてが敗北する",() => {
            const mockMathRandom = jest.spyOn(Math,"random").mockReturnValue(0.1);
            const userBet: string = "半";
            const expected: string[] = [
                "ようござんすね？\n",
                "ようござんすか？\n",
                "入ります。\n",
                "1、1の丁！\n",
                "あんさんの手：半\n",
                "わての勝ちや"
            ]
            tubofuriBakuchi(userBet);

            expect(consoleLogs).toEqual(expected);
            mockMathRandom.mockRestore();
        });
    });

    describe('サイコロの出目が半になる', () => {

        test("丁を入力した場合、わてが敗北する", () => {
            const mockMathRandom = jest.spyOn(Math,"random").mockReturnValueOnce(0.1).mockReturnValueOnce(0.2);
            const userBet: string = "丁";
            const expected: string[] = [
                "ようござんすね？\n",
                "ようござんすか？\n",
                "入ります。\n",
                "1、2の半！\n",
                "あんさんの手：丁\n",
                "あんさんの負けや"
            ]
            tubofuriBakuchi(userBet);

            expect(consoleLogs).toEqual(expected);
            mockMathRandom.mockRestore();
        });

        test("半を入力した場合、わてが勝利する",() => {
            const mockMathRandom = jest.spyOn(Math,"random").mockReturnValueOnce(0.1).mockReturnValueOnce(0.2);
            const userBet: string = "半";
            const expected: string[] = [
                "ようござんすね？\n",
                "ようござんすか？\n",
                "入ります。\n",
                "1、2の半！\n",
                "あんさんの手：半\n",
                "わてのの負けや"
            ]
            tubofuriBakuchi(userBet);

            expect(consoleLogs).toEqual(expected);
            mockMathRandom.mockRestore();
        });
    });

    test("丁／半以外の手を入力した場合、怒られると共に例外がスローされる", () => {
        const mockMathRandom = jest.spyOn(Math,"random").mockReturnValue(0.1);
        const userBet: string = "えい！";
        expect(() => tubofuriBakuchi(userBet)).toThrowError("ナメとんかいワレ！");
    })
})