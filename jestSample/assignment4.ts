/**
 * クイズ１
 * 指定した表示期間お知らせを表示するHTMLを返す関数
 * @export
 * @param {Date} displayFrom 表示開始日時
 * @param {Date} displayTo 表示終了日時
 * @param {string} noticeContent お知らせ内容
 * @return {string} お知らせのHTML
 */

export function termDisplay(
  displayFrom: Date,
  displayTo: Date,
  noticeContent: string
): string {
  if (displayFrom > displayTo) {
    throw new Error("displayFromはdisplayToより未来にすることは出来ません。");
  }

  const now = new Date();
  console.log(now);
  console.log(new Date("2023/1/1"));
  console.log(new Date("2023/12/1"));
  if (displayFrom <= now && displayTo >= now) {
    return `<p>お知らせ:${noticeContent}</p>`;
  }
  return `<p>まだお知らせはありません</p>`;
}

/////////////////
/**
 * クイズ２
 * フォームからのユーザーデータを保存するコントローラー
 * @export
 * @param {string} name ユーザー名
 * @param {string} email メールアドレス
 * @param {string} password パスワード
 * @return {*}  {void}
 * @throws {Error} パスワードが短すぎる
 * @throws {Error} パスワードが長すぎる
 * @throws {Error} メールアドレスが不正
 * @throws {Error} ユーザー名が長すぎる
 * @throws {Error} メールアドレスが長すぎる
 * @throws {Error} 保存に失敗しました
 */
export function saveUser(name: string, email: string, password: string): void {
  if (name.length > 20) {
    throw new Error("ユーザー名が長すぎる");
  }
  if (email.length > 100) {
    throw new Error("メールアドレスが長すぎる");
  }
  if (password.length < 5) {
    throw new Error("パスワードが短すぎる");
  }
  if (password.length > 20) {
    throw new Error("パスワードが長すぎる");
  }
  if (!email.match(/.+@.+\..+/)) {
    throw new Error("メールアドレスが不正");
  }

  if (Math.random() < 0.01) {
    // 1%の確率で失敗
    throw new Error("保存に失敗しました");
  }
  console.log(
    `ユーザーを保存しました。名前:${name}, Email:${email}, Pass:${password}`
  );
}
/////////////////
/**
 * クイズ３
 * 壺振り博打ができる関数
 * @export
 * @param {string} userBet 丁か半か
 * @return {*}  {void}
 * @throws {Error} ナメとんかいワレ！
 */
export function tubofuriBakuchi(userBet: string): void {
  console.log("ようござんすね？\n");
  console.log("ようござんすか？\n");
  console.log("入ります。\n");

  const dice1 = Math.floor(Math.random() * 6) + 1;
  const dice2 = Math.floor(Math.random() * 6) + 1;

  const result = (dice1 + dice2) % 2 === 0 ? "丁" : "半";
  console.log(`${dice1}、${dice2}の${result}！\n`);
  console.log(`あんさんの手：${userBet}\n`);
  switch (userBet) {
    case "丁":
      if (result === "丁") {
        console.log("あんさんの勝ちや");
      } else {
        console.log("あんさんの負けや");
      }
      break;
    case "半":
      if (result === "半") {
        console.log("わてのの負けや");
      } else {
        console.log("わての勝ちや");
      }
      break;
    default:
      throw new Error("ナメとんかいワレ！");
  }
}
