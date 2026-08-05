/**
 * 絵本出版イベント「くるくる」
 * 入金確認済み → 領収書メール自動送信スクリプト
 *
 * ════════════════════════════════════════
 *  初回セットアップ手順
 * ════════════════════════════════════════
 *  1. スプレッドシートのメニュー「拡張機能」→「Apps Script」を開く
 *  2. このコードを貼り付けて Cmd+S で保存
 *  3. 下記「★ 列番号の設定」をスプレッドシートの実際の列番号に合わせて変更
 *  4. 関数名を「setupReceiptTrigger」に選択して「▶ 実行」を押す
 *  5. Googleアカウントの許可画面が出たら「許可する」をクリック
 *  6. 「✅ 領収書送信トリガーを設定しました」とログに出れば完了
 *
 * ════════════════════════════════════════
 *  動作説明
 * ════════════════════════════════════════
 *  スプレッドシートの77列目（BY列）に「済」と入力すると、
 *  同じ行のメールアドレス宛に領収書メールが自動送信されます。
 *  ※ 同じセルに再度「済」を入力しても、二重送信しません。
 *     （78列目に送信済みフラグを記録します）
 */


// ════════════════════════════════════════
//  ★ 列番号の設定（スプレッドシートの実際の列番号に合わせて変更）
// ════════════════════════════════════════

var CONFIG = {
  COL_PAID:       77,   // 「済」を手動入力する列（BYの場合は77）
  COL_SENT_FLAG:  78,   // 送信済みフラグを書き込む列（自動、COL_PAIDの隣）
  COL_NAME:       17,   // お名前（フルネーム）の列  ※要確認
  COL_EMAIL:      18,   // メールアドレスの列        ※要確認
  COL_PLAN:        8,   // 応援口数（プラン）の列    ※要確認
  SHEET_NAME:      '',  // 対象シート名（空白 = 最初のシートを自動選択）
};

// 金額マスタ（応援口数の選択肢 → 金額）
var AMOUNT_MAP = {
  '1口（10,000円）': 10000,
  '2口（20,000円）': 20000,
  '3口（30,000円）': 30000,
  '当日参加のみ':     1500,
};


// ════════════════════════════════════════
//  トリガー設定（初回のみ実行）
// ════════════════════════════════════════

function setupReceiptTrigger() {
  // 既存の重複トリガーを削除
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'onEditSendReceipt') {
      ScriptApp.deleteTrigger(triggers[i]);
      Logger.log('旧トリガーを削除しました');
    }
  }

  // スプレッドシートの編集トリガーを設定
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ScriptApp.newTrigger('onEditSendReceipt')
    .forSpreadsheet(ss)
    .onEdit()
    .create();

  Logger.log('✅ 領収書送信トリガーを設定しました');
  Logger.log('77列目に「済」と入力すると領収書メールが自動送信されます。');
}


// ════════════════════════════════════════
//  編集検知 → 領収書メール送信（自動実行）
// ════════════════════════════════════════

function onEditSendReceipt(e) {
  var range = e.range;
  var sheet = range.getSheet();

  // 対象シートのチェック
  if (CONFIG.SHEET_NAME && sheet.getName() !== CONFIG.SHEET_NAME) return;

  // 対象列（77列目）のチェック
  if (range.getColumn() !== CONFIG.COL_PAID) return;

  // 「済」かどうかのチェック
  var newValue = range.getValue();
  if (newValue !== '済') return;

  var row = range.getRow();

  // ヘッダー行はスキップ
  if (row <= 1) return;

  // 二重送信防止：送信済みフラグが入っていればスキップ
  var sentFlag = sheet.getRange(row, CONFIG.COL_SENT_FLAG).getValue();
  if (sentFlag === '送信済み') {
    Logger.log('⚠️ 行 ' + row + ' はすでに送信済みのためスキップしました。');
    return;
  }

  // データ取得
  var recipientName  = sheet.getRange(row, CONFIG.COL_NAME).getValue();
  var recipientEmail = sheet.getRange(row, CONFIG.COL_EMAIL).getValue();
  var planValue      = sheet.getRange(row, CONFIG.COL_PLAN).getValue();

  // メールアドレスがない場合はスキップ
  if (!recipientEmail) {
    Logger.log('⚠️ 行 ' + row + ': メールアドレスが空のためスキップしました。');
    return;
  }

  // 金額を取得（マスタから照合、なければプランの値をそのまま表示）
  var amount = AMOUNT_MAP[planValue];
  var amountText = amount
    ? '¥' + amount.toLocaleString()
    : planValue || '（金額不明）';

  // 発行日
  var today = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy年M月d日');

  // メール送信
  sendReceiptEmail(recipientEmail, recipientName, amountText, today);

  // 送信済みフラグを書き込む
  sheet.getRange(row, CONFIG.COL_SENT_FLAG).setValue('送信済み');
  Logger.log('✅ 領収書メール送信完了 → ' + recipientEmail + '（' + recipientName + '）');
}


// ════════════════════════════════════════
//  領収書メール本文
// ════════════════════════════════════════

function sendReceiptEmail(toEmail, toName, amountText, issuedDate) {

  var subject = '【領収書】絵本出版イベント「くるくる」スポット応援隊';

  var body =
    toName + ' 様\n\n' +

    'この度は、絵本出版イベント「くるくる」へのご支援を\n' +
    '誠にありがとうございます。\n\n' +

    '以下の通り、入金を確認いたしましたのでご連絡いたします。\n\n' +

    '━━━━━━━━━━━━━━━━━━━━━━━\n' +
    '　　　　　　　領　収　書\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━\n\n' +

    '  発行日　：' + issuedDate + '\n' +
    '  宛名　　：' + toName + ' 様\n' +
    '  金額　　：' + amountText + '\n' +
    '  但し書き：絵本出版イベント「くるくる」スポット応援隊として\n\n' +

    '━━━━━━━━━━━━━━━━━━━━━━━\n' +
    '  発行者\n' +
    '  間田デザイン　間田 淳大\n' +
    '  mail: atsuhiromada0327@gmail.com\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━\n\n' +

    'ご支援いただいた想いを大切に、\n' +
    'しっかりとイベントを作り上げてまいります。\n\n' +

    '当日、皆さまと一緒に素晴らしい時間を過ごせることを\n' +
    '心よりお待ちしております。\n\n' +

    '風のように、みんなの想いをひとつに。\n\n' +

    '間田デザイン\n' +
    '間田 淳大\n';

  GmailApp.sendEmail(
    toEmail,
    subject,
    body,
    {
      name:    '間田デザイン 間田 淳大',
      replyTo: 'atsuhiromada0327@gmail.com',
    }
  );
}
