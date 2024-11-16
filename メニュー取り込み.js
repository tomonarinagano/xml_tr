/* 

1.pushbutton関数がメインの処理。
2.fetch()関数を呼びだして、HTML全体を取得
3.2で取得したHTMLに対して、menuparse()関数でHTMLをパースし、該当のテキストを取得（メニュータイトル・料金・概要）
4.pushbutton関数上で、シートに貼りつけ

 */

//ホットペッパーグルメ、minimo、ぐるなび　のメニューも取りたい

// https://www.hotpepper.jp/
// https://www.gnavi.co.jp/
// https://minimodel.jp/

function pushBtnTabelog() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sitename = "食べログ";
  const sheet = ss.getSheetByName(sitename);
  const type = ss.getRange("B2").getValue();
  const url = ss.getRange("A2").getValue();

  let obj = {};

  if (type !== "コースメニュー") {
    obj = {
      info_start: '<div class="rstdtl-menu-lst__info">',
      info_end: "</div></div>",
      menu_title_start: '<p class="rstdtl-menu-lst__menu-title">',
      menu_title_end: "</p>",
      includes_price: "rstdtl-menu-lst__price",
      price_start: '<p class="rstdtl-menu-lst__price">',
      price_end: "</p>",
      includes_ex: "rstdtl-menu-lst__ex",
      ex_start: '<p class="rstdtl-menu-lst__ex">',
      ex_end: "</p>",
    };
  } else {
    obj = {
      info_start: '<div class="rstdtl-course-list__data">',
      info_end: "</div></div></div>",
      menu_title_start: '<span class="rstdtl-course-list__course-title-text">',
      menu_title_end: "</span>",
      includes_price: "rstdtl-course-list__price-num",
      price_start: '<span class="rstdtl-course-list__price-num">',
      price_end: "</span>",
      includes_ex: "rstdtl-course-list__desc",
      ex_start: '<p class="rstdtl-course-list__desc">',
      ex_end: "</p>",
    };
  }

  const html = fetchHTML(url);

  const menus = menuparser(sitename, obj, html);

  /* let range = sheet.getRange(5, 1, sheet.getLastRow(), sheet.getLastColumn());
  range.clearContent(); */

  sheet.getRange("A5:C").clearContent();

  if (menus.length > 0) {
    sheet.getRange(5, 1, menus.length, menus[0].length).setValues(menus);
  }
}

function pushBtnHotpepperBeauty() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sitename = "hotpepper beauty";
  const sheet = ss.getSheetByName(sitename);
  const url = ss.getRange("A2").getValue();

  const obj = {
    info_start: '<div class="pT10 pB10 pL10 pR15">',
    info_end: "</div></td>",
    menu_title_start: '<p class="fl couponMenuName fs14 w423 mR10">',
    menu_title_end: "</p>",
    includes_price: "fs16 fgGray",
    price_start: '<span class="fs16 fgGray">',
    price_end: "</span>",
    includes_ex: "mT10 fgGray fs11 wbba",
    ex_start: '<p class="mT10 fgGray fs11 wbba">',
    ex_end: "</p>",
  };
  const html = fetchHTML(url);

  const menus = menuparser(sitename, obj, html);

  console.log(menus);

  // let range = sheet.getRange(5, 1, sheet.getLastRow(), sheet.getLastColumn());
  // range.clearContent();

  if (menus.length > 0) {
    sheet.getRange(5, 1, menus.length, menus[0].length).setValues(menus);
  }
}

function pushBtnHotpepperGurume() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sitename = "hotpepper グルメ";
  const sheet = ss.getSheetByName(sitename);
  const url = ss.getRange("A2").getValue();
  let html = fetchHTML(url);

  //htmlに対して、クラスの記述を綺麗にする（不要なクラスを削除するなど）.replace()を使って置換し、不要なクラスを取り除く
  // <li class="menu-vitem">だけになるように。※通常
  // html = html.replace(/columnPlex/g, 'columnPsssB').replace(/column4B/g, 'columnPsssB');

  const menuRegex =
    /<ul class="courseList">([\s\S]*?)<\/ul>|<div class="body">([\s\S]*?)<\/div>/g;

  let title_list = []; //コース・通常メニューの正しい順番 []
  let match;

  while ((match = menuRegex.exec(html)) !== null) {
    const courseMenu = match[1];
    const regularMenu = match[2];

    if (regularMenu) {
      const titleRegex = /<h[3|4] class="title">([\s\S]*?)<\/h[3|4]>/;
      const priceRegex = /<p class="price">([\s\S]*?)<\/p>/;
      const textRegex = /<p class="text">([\s\S]*?)<\/p>/;

      const matchTitle = regularMenu.match(titleRegex);
      const matchPrice = regularMenu.match(priceRegex);
      const matchText = regularMenu.match(textRegex);

      const title =
        matchTitle && matchTitle[1]
          ? matchTitle[1].replace(/<[^>]*>/g, "").trim()
          : "";
      const price =
        matchPrice && matchPrice[1]
          ? matchPrice[1]
              .replace(/<[^>]*>/g, "")
              .replace(/\n/g, "")
              .replace(/\s+/g, " ")
              .trim()
          : "";
      const text =
        matchText && matchText[1]
          ? matchText[1]
              .replace(/<[^>]*>/g, "")
              .replace(/\n/g, "")
              .replace(/\s+/g, " ")
              .trim()
          : "";

      title_list.push([title, price, text]);
    }

    if (courseMenu) {
      // const titleRegex = />(.*?)<\/a>/;
      const titleRegex = /<a [^>]*>(.*?)<\/a>/;
      const priceRegex = /<li class="coursePrice lastChild">([\s\S]*?)<\/li>/;
      const textRegex =
        /<ul class="summaryList">([\s\S]*?)(?=<li class="coursePrice lastChild">|<\/ul>)/;

      const matchTitle = courseMenu.match(titleRegex);
      const matchPrice = courseMenu.match(priceRegex);
      const matchText = courseMenu.match(textRegex);

      const title = matchTitle
        ? matchTitle[1]
            .replace(/<[^>]*>/g, "")
            .replace(/\n/g, "")
            .replace(/\s+/g, " ")
            .trim()
        : "";
      const price = matchPrice
        ? matchPrice[1]
            .replace(/<[^>]*>/g, "")
            .replace(/\n/g, "")
            .replace(/\s+/g, " ")
            .trim()
        : "";
      const text = matchText
        ? matchText[1]
            .replace(/<[^>]*>/g, "")
            .replace(/\n/g, "")
            .replace(/\s+/g, " ")
            .trim()
        : "";

      title_list.push([title, price, text]);
    }
  }

  console.log(title_list);

  let range = sheet.getRange(5, 1, sheet.getLastRow(), sheet.getLastColumn());
  range.clearContent();

  if (title_list.length > 0) {
    sheet
      .getRange(5, 1, title_list.length, title_list[0].length)
      .setValues(title_list);
  }
}

function pushBtnGurunavi() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sitename = "ぐるなび";
  const sheet = ss.getSheetByName(sitename);
  const url = ss.getRange("A2").getValue();
  let html = fetchHTML(url);

  //htmlに対して、クラスの記述を綺麗にする（不要なクラスを削除するなど）.replace()を使って置換し、不要なクラスを取り除く
  // <li class="menu-vitem">だけになるように。※通常
  html = html
    .replace(/menu-item/g, "menu-vitem")
    .replace(/class="menu-vitem[^"]*"/g, 'class="menu-vitem"')
    .replace(/&hellip;/g, "…")
    .replace(/&rArr;/g, "→")
    .replace(/&ldquo;/g, "“")
    .replace(/&rdquo;/g, "”")
    .replace(/&times;/g, "×")
    .replace(/&rarr;/g, "→")
    .replace(/&amp;/g, "&")
    .replace(/&deg;/g, "゜")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

  //１．htmlから、コース・通常メニューの正しい順番を取得し、配列で記録しておく（正規表現を使って、コースor通常メニューのタイトルをマッチさせる）
  /*
   ["コース１","通常１","コース２"] 
   */

  const menuRegex =
    /<li class="menu-vitem">([\s\S]*?)<\/dl><\/li>|<div class="l-plan-info">([\s\S]*?)<\/div><\/div><\/div><\/div>/g;

  let title_list = []; //コース・通常メニューの正しい順番 []
  let match;

  while ((match = menuRegex.exec(html)) !== null) {
    const regularMenu = match[1];
    const courseMenu = match[2];

    if (regularMenu) {
      const titleRegex = /<dt class="menu-term">([\s\S]*?)<\/dt>/;
      const priceRegex = /<dd class="menu-price">([\s\S]*?)<\/dd>/;
      const textRegex = /<dd class="menu-desc">([\s\S]*?)<\/dd>/;

      const matchTitle = regularMenu.match(titleRegex);
      const matchPrice = regularMenu.match(priceRegex);
      const matchText = regularMenu.match(textRegex);

      const title =
        matchTitle && matchTitle[1]
          ? matchTitle[1].replace(/<[^>]*>/g, "").trim()
          : "";
      const price =
        matchPrice && matchPrice[1]
          ? matchPrice[1]
              .replace(/<[^>]*>/g, "")
              .replace(/\n/g, "")
              .replace(/\s+/g, " ")
              .trim()
          : "";
      const text =
        matchText && matchText[1]
          ? matchText[1]
              .replace(/<[^>]*>/g, "")
              .replace(/\n/g, "")
              .replace(/\s+/g, " ")
              .trim()
          : "";

      title_list.push([title, price, text]);
    }

    if (courseMenu) {
      const titleRegex = /<span class="plan__name">\s*([^<]+)\s*<\/span>/;
      const priceRegex =
        /<div class="l-plan__name__under-right">\s*([\s\S]*?)\s*<\/div>/;
      const textRegex =
        /<div class="l-plan__description">\s*<p class="plan__description">([\s\S]*?)<\/p>\s*<\/div>/;

      const matchTitle = courseMenu.match(titleRegex);
      const matchPrice = courseMenu.match(priceRegex);
      const matchText = courseMenu.match(textRegex);

      const title = matchTitle
        ? matchTitle[1].replace(/&rArr;/g, "→").trim()
        : "";
      const price = matchPrice
        ? matchPrice[1]
            .replace(/<[^>]*>/g, "")
            .replace(/\n/g, "")
            .replace(/\s+/g, " ")
            .trim()
        : "";
      const text = matchText
        ? matchText[1]
            .replace(/<[^>]*>/g, "")
            .replace(/\n/g, "")
            .replace(/\s+/g, " ")
            .trim()
        : "";

      title_list.push([title, price, text]);
    }
  }

  let range = sheet.getRange(5, 1, sheet.getLastRow(), sheet.getLastColumn());
  range.clearContent();

  if (title_list.length > 0) {
    sheet
      .getRange(5, 1, title_list.length, title_list[0].length)
      .setValues(title_list);
  }
}

function pushminimo() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sitename = "minimo";
  const sheet = ss.getSheetByName(sitename);
  const url = ss.getRange("A2").getValue();

  const obj = {
    info_start: '<div class="menu-body">',
    info_end: "</div></div></li>",
    menu_title_start: "<h2>",
    menu_title_end: "</h2>",
    includes_price: "price-text",
    price_start: '<span class="price-text">',
    price_end: "</div>",
    includes_ex: "menu-description",
    ex_start: '<div class="menu-description">',
    ex_end: "</div>",
  };

  const html = fetchHTML(url);

  const menus = menuparser(sitename, obj, html);

  let range = sheet.getRange(5, 1, sheet.getLastRow(), sheet.getLastColumn());
  range.clearContent();

  if (menus.length > 0) {
    range = sheet.getRange(5, 1, menus.length, menus[0].length);
    range.setValues(menus);
  }
}

function fetchHTML(url) {
  // try~catchを使ってエラーハンドリングを行う（最大5回までのリトライ）
  let html = "";

  for (var i = 0; i < 5; i++) {
    try {
      // レスポンスからcontentを取得する
      const response = UrlFetchApp.fetch(url);
      html = response.getContentText("UTF-8").replace(/>[\s　]+</g, "><");

      // ループを抜ける（成功した場合）
      break;
    } catch (error) {
      // エラーが発生した場合の処理
      console.log("Error:", error);

      // 一定時間の間隔をあける
      Utilities.sleep(1000 * (1 + i));

      if (i == 4) {
        throw new Error(
          "メニューの取得に失敗しました。時間を空けて再度実行しなおしてください"
        );
      }
    }
  }

  return html;
}

function menuparser(sitename, obj, html) {
  let info_start = obj.info_start;
  let info_end = obj.info_end;
  let menu_title_start = obj.menu_title_start;
  let menu_title_end = obj.menu_title_end;
  let includes_price = obj.includes_price;
  let price_start = obj.price_start;
  let price_end = obj.price_end;
  let includes_ex = obj.includes_ex;
  let ex_start = obj.ex_start;
  let ex_end = obj.ex_end;

  const div = Parser.data(html).from(info_start).to(info_end).iterate();

  let menus = [];

  for (let i = 0; i < div.length; i++) {
    // console.log(div[i]);
    const title = Parser.data(div[i])
      .from(menu_title_start)
      .to(menu_title_end)
      .build();

    let price = "";
    if (div[i].includes(includes_price)) {
      price = Parser.data(div[i]).from(price_start).to(price_end).build();
    }

    let ex = "";
    if (div[i].includes(includes_ex)) {
      ex = Parser.data(div[i]).from(ex_start).to(ex_end).build();
    }

    // console.log(title);
    // console.log(price);
    // console.log(ex);

    menus.push([
      title
        .replace(/<\/?[^>]+(>|$)/g, "")
        .replace(/&amp;/g, "&")
        .replace(/&rarr;/g, "→")
        .replace(/&rArr;/g, "→")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&times;/g, "×")
        .trim(),
      price
        .replace(/<\/?[^>]+(>|$)/g, "")
        .replace(/\n/g, "")
        .replace(/\s+/g, " ")
        .trim(),
      ex
        .replace(/<\/?[^>]+(>|$)/g, "")
        .replace(/&deg;/g, "゜")
        .replace(/&times;/g, "×")
        .replace(/&ldquo;/g, "”")
        .replace(/&rdquo;/g, "”")
        .replace(/&amp;/g, "&")
        .replace(/\s+/g, " ")
        .replace(/&rArr;/g, "→")
        .trim(),
    ]);
  }

  return menus;
}

function makeMenuXML() {
  const ss = SpreadsheetApp.getActiveSpreadsheet(); //スプレッドシートそのものを取得
  const selectedSheetName = ss.getActiveSheet().getName();
  let sheet;

  if (selectedSheetName === "食べログ") {
    sheet = ss.getSheetByName("食べログ");
  } else if (selectedSheetName === "hotpepper beauty") {
    sheet = ss.getSheetByName("hotpepper beauty");
  } else if (selectedSheetName === "hotpepper グルメ") {
    sheet = ss.getSheetByName("hotpepper グルメ");
  } else if (selectedSheetName === "ぐるなび") {
    sheet = ss.getSheetByName("ぐるなび");
  } else if (selectedSheetName === "minimo") {
    sheet = ss.getSheetByName("minimo");
  }
  let startRow = 5; // 開始行
  let endRow = sheet.getLastRow();

  let xml = "";

  for (let i = startRow; i <= endRow; i++) {
    let menu_title = sheet.getRange(i, 1).getValue(); // A列から取得

    if (menu_title === "") {
      continue;
    }

    let price = sheet.getRange(i, 2).getValue(); // B列から取得
    let ex = sheet.getRange(i, 3).getValue();

    xml += "<type>\n";
    xml += " <datastore>article</datastore>\n";
    xml += " <class>article</class>\n";
    xml += " <key>article</key>\n";
    xml += " <parent>804.setting</parent>\n";
    xml += "   " + v("title", menu_title);
    xml += "   " + v("h_ttl", menu_title);
    xml += "   " + v("price", price);
    xml += "   " + v("text", ex);
    xml += "   " + v("resize", "2");
    xml += "</type>\n";
    xml += " \n";
  }

  return xml;
}

function createFile2() {
  const xml = makeMenuXML();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const selectedSheetName = ss.getActiveSheet().getName();
  const ss_selected = ss.getSheetByName(selectedSheetName);

  let range = "E12";
  let filename =
    ss.getSheetByName("基本情報").getRange("C3").getValue() +
    "_" +
    selectedSheetName +
    ".xml";

  //格納するGoogleドライブを指定
  const folder = DriveApp.getFolderById("1nP0TzHG5PcQY1S8wGDDo5i_jNblC8VV6");

  const newfile = folder.createFile(
    Utilities.newBlob("", "text/plain", filename).setDataFromString(
      "<root>" + xml + "</root>",
      "utf-8"
    )
  );

  // ここで ss_selected を使うように修正する
  ss_selected
    .getRange(range)
    .setValue("https://drive.google.com/file/d/" + newfile.getId() + "/view");
  Browser.msgBox("フォルダに入れましたヽ(・×・)/✧");
}
function test() {
  const ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("ぐるなび");
  const value = ss.getRange("J1:L3").getValues();
  console.log(value);
  const flat = value.flat();
  console.log(flat);
  ss.getRange("J1:L3").setValues(flat);
}
