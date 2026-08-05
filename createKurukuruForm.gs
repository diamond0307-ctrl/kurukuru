/**
 * 絵本出版イベント「くるくる」スポット応援隊 参加フォーム
 * 作成スクリプト
 *
 * 使い方：
 *   1. https://script.google.com を開く
 *   2. 「新しいプロジェクト」を作成
 *   3. このコードを全選択して貼り付け
 *   4. Cmd+S（または保存ボタン）でまず保存する
 *   5. 関数名が「createKurukuruForm」になっていることを確認
 *   6. 「▶ 実行」ボタンを押す（初回のみGoogleアカウントの許可が必要）
 *   7. 実行ログに表示されるURLからフォームを確認
 *   8. 顧客アカウントへ譲渡：フォーム内「︙」→「オーナーシップを譲渡」
 *
 * ページ分岐の設計（完全版）：
 *   Q1「当日参加のみ」         → page2a → page4（応援隊スキップ）
 *   Q1「スポット応援隊として参加」 → page3  → page4
 *   Q1「当日参加＋スポット応援隊」 → page2b → page3 → page4
 *   Q1「現時点では未定」         → page4
 *   Q9「当日受け取る」          → page5
 *   Q9「郵送希望」             → page4b → page5
 */
function createKurukuruForm() {

  // ── フォーム基本設定 ──────────────────────────────
  var form = FormApp.create('絵本出版イベント「くるくる」スポット応援隊 参加フォーム');

  form.setDescription(
    'この絵本「くるくる」は、\n' +
    'たくさんの人の応援や優しさに支えられて生まれました。\n\n' +
    '僕がこの絵本を通して伝えたいことは、\n' +
    '"目には見えない大切なもの"の存在です。\n\n' +
    '優しさ。\n感謝。\n人を想う気持ち。\n「ありがとう」を伝えること。\n\n' +
    '本当に大切なものほど、なぜか目には見えません。\n\n' +
    'この出版イベントは、そんな想いを届けるための時間です。\n\n' +
    '友達だから。知り合いだから。ではなく、\n' +
    '「これは多くの人に届けるべき内容だ」\n' +
    'そう感じてくださった方と、一緒につくりたいと思っています。\n\n' +
    '応援いただいた方には、当日サイン入り絵本をお渡しします。\n' +
    '（来られない方には郵送いたします）\n\n' +
    '皆さまと一緒に、"愛がある日本"を未来につないでいけたら嬉しいです。'
  );

  form.setConfirmationMessage(
    '本当にありがとうございます。\n\n' +
    'このイベントは、\n"誰かを想う気持ち"でできています。\n\n' +
    '皆さまと一緒に、\n優しさが循環する時間をつくれたら嬉しいです。\n\n' +
    '当日、お会いできることを楽しみにしています。\n\n' +
    '間田デザイン\n間田 淳大'
  );

  form.setShowLinkToRespondAgain(false);
  form.setCollectEmail(false);


  // ════════════════════════════════════════
  //  セクション①　参加方法
  // ════════════════════════════════════════

  form.addSectionHeaderItem()
    .setTitle('セクション①　参加方法')
    .setHelpText('まず、今回どのような形で関わってくださるかを教えてください。');

  var q1 = form.addMultipleChoiceItem();
  q1.setTitle('今回どの形で参加されますか？');
  q1.setRequired(true);
  // ※ Q1の選択肢とナビゲーションは下部のナビゲーション設定セクションで設定します


  // ════════════════════════════════════════
  //  セクション②-A　当日参加について（当日参加のみ の方用）
  //  → このページはセクション④（絵本お届け）に直行します
  // ════════════════════════════════════════

  var page2a = form.addPageBreakItem();
  page2a.setTitle('セクション②　当日参加について');
  page2a.setHelpText('当日イベントにご参加される方はご記入ください。');

  var q2a = form.addMultipleChoiceItem();
  q2a.setTitle('当日イベントに参加されますか？');
  q2a.setRequired(true);
  q2a.setChoices([
    q2a.createChoice('参加する'),
    q2a.createChoice('参加しない')
  ]);

  var q3a = form.addListItem();
  q3a.setTitle('参加人数');
  q3a.setRequired(false);
  q3a.setChoices([
    q3a.createChoice('1名'),
    q3a.createChoice('2名'),
    q3a.createChoice('3名'),
    q3a.createChoice('4名'),
    q3a.createChoice('5名以上')
  ]);
  // page2a.setGoToPage は下部ナビゲーション設定にて → page4 へ


  // ════════════════════════════════════════
  //  セクション②-B　当日参加について（当日参加＋スポット応援隊 の方用）
  //  → このページはセクション③（応援隊）に進みます
  // ════════════════════════════════════════

  var page2b = form.addPageBreakItem();
  page2b.setTitle('セクション②　当日参加について');
  page2b.setHelpText('当日イベントにご参加される方はご記入ください。');

  var q2b = form.addMultipleChoiceItem();
  q2b.setTitle('当日イベントに参加されますか？');
  q2b.setRequired(true);
  q2b.setChoices([
    q2b.createChoice('参加する'),
    q2b.createChoice('参加しない')
  ]);

  var q3b = form.addListItem();
  q3b.setTitle('参加人数');
  q3b.setRequired(false);
  q3b.setChoices([
    q3b.createChoice('1名'),
    q3b.createChoice('2名'),
    q3b.createChoice('3名'),
    q3b.createChoice('4名'),
    q3b.createChoice('5名以上')
  ]);
  // page2b.setGoToPage は下部ナビゲーション設定にて → page3 へ


  // ════════════════════════════════════════
  //  セクション③　スポット応援隊について
  //  （「スポット応援隊として参加」または「当日参加＋スポット応援隊」を選んだ方のみ表示）
  // ════════════════════════════════════════

  var page3 = form.addPageBreakItem();
  page3.setTitle('セクション③　スポット応援隊について');
  page3.setHelpText('スポット応援いただける方はこちらにご記入ください。');

  // Q4
  var q4 = form.addMultipleChoiceItem();
  q4.setTitle('スポット応援隊として応援いただけますか？');
  q4.setRequired(true);
  q4.setChoices([
    q4.createChoice('応援する'),
    q4.createChoice('検討中')
  ]);

  // Q5
  var q5 = form.addListItem();
  q5.setTitle('応援口数');
  q5.setRequired(false);
  q5.setChoices([
    q5.createChoice('1口（10,000円）'),
    q5.createChoice('2口（20,000円）'),
    q5.createChoice('3口（30,000円）'),
    q5.createChoice('その他')
  ]);

  // Q6
  var q6 = form.addTextItem();
  q6.setTitle('掲載したいお名前 / 会社名 / ロゴ名');
  q6.setRequired(false);
  q6.setHelpText('当日の衣装・会場等に掲載予定です。掲載不要の場合は空欄でOKです。');

  // Q7
  var q7 = form.addMultipleChoiceItem();
  q7.setTitle('ロゴ掲載を希望されますか？');
  q7.setRequired(false);
  q7.setChoices([
    q7.createChoice('希望する'),
    q7.createChoice('名前のみ希望'),
    q7.createChoice('不要')
  ]);

  // Q8（説明文のみ）
  form.addSectionHeaderItem()
    .setTitle('【ロゴデータの送付先】')
    .setHelpText('フォーム送信後、Instagram DM またはメールにてロゴデータをお送りください。');

  // page3.setGoToPage は下部ナビゲーション設定にて → page4 へ


  // ════════════════════════════════════════
  //  セクション④　サイン入り絵本のお届けについて
  // ════════════════════════════════════════

  var page4 = form.addPageBreakItem();
  page4.setTitle('セクション④　サイン入り絵本のお届けについて');

  // Q9
  var q9 = form.addMultipleChoiceItem();
  q9.setTitle('サイン入り絵本のお届けについて');
  q9.setRequired(true);
  // Q9の選択肢とナビゲーションは下部で設定


  // ════════════════════════════════════════
  //  郵送先入力ページ（郵送希望の方のみ）
  // ════════════════════════════════════════

  var page4b = form.addPageBreakItem();
  page4b.setTitle('お届け先情報のご記入');
  page4b.setHelpText('郵送させていただきますので、お届け先をご記入ください。');

  // Q10
  var q10 = form.addTextItem();
  q10.setTitle('お届け先氏名');
  q10.setRequired(true);

  // Q11
  var q11 = form.addTextItem();
  q11.setTitle('郵便番号');
  q11.setRequired(true);
  q11.setHelpText('例：123-4567');

  // Q12
  var q12 = form.addTextItem();
  q12.setTitle('住所（番地・マンション名・部屋番号まで）');
  q12.setRequired(true);

  // Q13
  var q13 = form.addTextItem();
  q13.setTitle('電話番号');
  q13.setRequired(true);
  q13.setHelpText('お届けの際にご連絡が必要な場合に使用します。');

  // page4b.setGoToPage は下部ナビゲーション設定にて → page5 へ


  // ════════════════════════════════════════
  //  セクション⑤　想い・メッセージ
  // ════════════════════════════════════════

  var page5 = form.addPageBreakItem();
  page5.setTitle('セクション⑤　想い・メッセージ');
  page5.setHelpText(
    'ここが一番大切なページです。\nあなたの言葉が、これからの活動の力になります。'
  );

  // Q14
  form.addParagraphTextItem()
    .setTitle('今回応援しようと思ってくださった理由を教えてください。')
    .setRequired(false)
    .setHelpText(
      'どんな想いでこのフォームに辿り着きましたか？\n' +
      'どんな言葉でも構いません。あなたの気持ちを聞かせてください。'
    );

  // 連絡先（仕様外だが運営上必要なため末尾に追加）
  form.addTextItem()
    .setTitle('お名前（フルネーム）')
    .setRequired(true);

  form.addTextItem()
    .setTitle('メールアドレス')
    .setRequired(true)
    .setHelpText('確認のご連絡・イベント詳細をお送りする際に使用します。');

  form.addTextItem()
    .setTitle('電話番号（任意）')
    .setRequired(false);


  // ════════════════════════════════════════
  //  ナビゲーション（分岐）設定
  //  ※ すべてのページとQ1/Q9のナビをここでまとめて設定
  // ════════════════════════════════════════

  // Q1 の分岐
  q1.setChoices([
    q1.createChoice('当日参加のみ',              page2a),  // ②-A → 応援隊スキップ → ④
    q1.createChoice('スポット応援隊として参加',   page3),   // ③ → ④
    q1.createChoice('当日参加＋スポット応援隊',   page2b),  // ②-B → ③ → ④
    q1.createChoice('現時点では未定',             page4)    // ④ へ直行
  ]);

  // page2a（当日参加のみ）→ セクション④へ（応援隊スキップ）
  page2a.setGoToPage(page4);

  // page2b（当日参加＋応援隊）→ セクション③へ
  page2b.setGoToPage(page3);

  // page3（スポット応援隊）→ セクション④へ
  page3.setGoToPage(page4);

  // Q9 の分岐（絵本お届け方法）
  q9.setChoices([
    q9.createChoice('当日受け取る', page5),   // セクション⑤へ
    q9.createChoice('郵送希望',     page4b)   // 郵送先入力へ
  ]);

  // page4b（郵送先入力）→ セクション⑤へ
  page4b.setGoToPage(page5);


  // ════════════════════════════════════════
  //  完了ログ出力
  // ════════════════════════════════════════
  Logger.log('✅ フォームが作成されました！');
  Logger.log('');
  Logger.log('▶ 編集URL（管理者用）: ' + form.getEditUrl());
  Logger.log('▶ 回答URL（参加者用）: ' + form.getPublishedUrl());
  Logger.log('');
  Logger.log('【顧客への譲渡手順】');
  Logger.log('  1. 上記の編集URLを開く');
  Logger.log('  2. 右上「︙」→「オーナーシップを譲渡」');
  Logger.log('  3. 顧客のGmailアドレスを入力して送信');
}
