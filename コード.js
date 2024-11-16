// テストだよ

//ライトプラン案件で、署名リンクが入らないようにする

function test_grid() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("シート26");
  const values = sheet.getRange(1, 1, 3, 4).getValues();

  //const array = [[1,2,3,4],[5,6,7,8],[9,10,11,12]];

  console.log(values[1][2]);

  values.forEach(function (row) {
    console.log(row[1]);
  });
}

class SpreadSheets {
  constructor() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    this.makexml = ss.getSheetByName("makexml");
    this.basic = ss.getSheetByName("基本情報");
    this.shop = ss.getSheetByName("店舗情報");
  }
}

class Utils {
  static v(k, value) {
    if (value == undefined) {
      value = "";
    }
    const trimmed = value.toString().trim();
    return (
      '<kv key="' + k + '"><value><![CDATA[' + trimmed + "]]></value></kv>\n"
    );
  }
}

//https://google-apps-script.takami-site.work/194#:~:text=%E4%BE%8B%E3%81%88%E3%81%B0%E3%80%81GAS%E3%81%8C%E3%80%81Spreadsheet%E3%81%AE,%E9%81%85%E3%81%8F%E3%81%AA%E3%81%A3%E3%81%A6%E3%81%97%E3%81%BE%E3%81%84%E3%81%BE%E3%81%99%E3%80%82

function testmain() {
  const ss = SpreadsheetApp.getActiveSpreadsheet(); //スプレッドシート自体を取得
  const sheet = ss.getSheetByName("makexml"); //スプレッドシートの中の特定のシートを取得
  const range_a1 = sheet.getRange("A1"); //シートの中の範囲を取得
  const value_a1 = range_a1.getValue(); //範囲の中の値を取得

  console.log(value_a1); //出力

  range_a1.setValue("test dayo"); //範囲に対して値を書き込み
}

/**
 * 郵便番号から住所を取得して返す
 *
 * @param {string} [zip] - 郵便番号の-を抜いた文字列
 * @return {Object} 住所のオブジェクト
 */
/*郵便番号エラーの対処 ここから*/
function zip2addr(zip) {
  zip = zenkaku2hankaku(zip);
  let addr = {};
  try {
    addr = JSON.parse(
      UrlFetchApp.fetch(
        "https://template-asteer-005.296.works/_lib/owl/address/zip2addr.html?zip=" +
          zip
      ).getContentText("UTF-8")
    );
  } catch (e) {
    Browser.msgBox(
      "郵便番号から住所が取得できませんでした。一括入稿後、WEBサイト基本情報で住所を修正してください。"
    );
    addr = {
      address: "選択して下さい",
      address1: "",
      address2: "",
      kokyo_code: "",
      prefectures_id: "",
      prefecture: "北海道",
    };
  }
  return addr;
}

/**
 * 入力された郵便番号の数字やハイフンを全て半角に変換して返す
 *
 * @param {string} [str] - 郵便番号の文字列
 * @return {string} 半角の数字やハイフン
 */
function zenkaku2hankaku(str) {
  str = str.replace(/[‐－―ー]/g, "-");
  return str.replace(/[０-９]/g, function (s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
  });
}

/**
 * ライティングシート内の制御文字の削除(空文字に置き換え)
 *
 * @param {string} sheet - シート名の文字列
 * @return {} void
 */
/*制御文字の削除 ここから*/
function delete_control_characters() {
  const writings = [
    "ライティングシート (TOP)",
    "ライティングシート (可変)",
    "ライティングシート (固定)",
  ];

  writings.forEach(function (sheet) {
    const ss_writing_top = get_sheet(sheet);
    const control_chars = ["\b", "\f", "\r", "\t", "\v"]; //バックスペース、フォームフィード、ラインフィード、キャリッジリターン、水平タブ、垂直タブ
    const range_whole_sheet = ss_writing_top.getDataRange();

    control_chars.forEach(function (char) {
      range_whole_sheet
        .createTextFinder(char)
        .useRegularExpression(true)
        .replaceAllWith("");
    });
  });
}

function remove_layout() {
  let remove_target = {
    メニュー: {
      page: [60],
      layout: [],
      setting: [804, 363, 444, 459, 462, 447],
    },
    メニュー2: {
      page: [63],
      layout: [],
      setting: [405],
    },
    採用情報: {
      page: [39, 24, 27, 30],
      layout: [], //[48]
      setting: [606, 297, 351],
    },
    ギャラリー: {
      page: [69, 72, 75, 78],
      layout: [], //[114,111,108]
      setting: [657, 366, 456],
    },
    新着情報: {
      page: [],
      layout: [], //[87,90,93]
      setting: [348],
    },
    スタッフ: {
      page: [470, 45, 48, 51],
      layout: [], //[63,66,60]
      setting: [627, 354],
    },
    お客様の声: {
      page: [93],
      layout: [], //[129,132,126]
      setting: [594, 372],
    },
    スケジュール: {
      page: [96],
      layout: [], //[141,144,135]
      setting: [777, 375],
    },
    よくある質問: {
      page: [],
      layout: [], //[81,84,78]
      setting: [585, 360],
    },
    実績: {
      page: [81, 84, 87, 90],
      layout: [], //[120,123,117]
      setting: [720, 369],
    },
  };
  delete remove_target[flexible_page1];
  delete remove_target[flexible_page2];
  delete remove_target[flexible_page3];

  Object.keys(remove_target).forEach(function (key) {
    remove_target[key].page.forEach(function (pid) {
      xml += '<remove ds="page" id="' + pid + '" />\n';
    });
    remove_target[key].layout.forEach(function (lid) {
      xml += '<remove ds="layout" id="' + lid + '" />\n';
    });
    remove_target[key].setting.forEach(function (sid) {
      xml += '<remove ds="setting" id="' + sid + '" />\n';
    });
  });
}

/**
 * 指定した文字をシート内から削除(空文字に置き換え)
 *
 * @param {string} [sheetname] - 対象とするシート名の文字列
 * @param {string} [char] - 削除したい任意の文字列
 * @return {} void
 */
function replaceAllWith(sheetname, char) {
  const range_whole_sheet = get_sheet(sheetname).getDataRange();

  range_whole_sheet
    .createTextFinder(char)
    .matchFormulaText(true)
    .replaceAllWith("");
}

/**
 * Iやlなど見間違えやすい英数字を除いた、ランダムな英数字を8桁生成してパスワードのセルに出力
 *
 * @return {} void
 */
function ramdom_pw() {
  var letters = "abcdefghijkmnprstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
  var numbers = "2345678";
  var string = letters + numbers;

  var len = 8;
  var password = "";

  for (var i = 0; i < len; i++) {
    password += string.charAt(Math.floor(Math.random() * string.length));
  }

  SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName("makexml")
    .getRange("E10")
    .setValue(password);
}

/**
 * キーと値を持つXML形式の文字列を生成して返す
 *
 * @param {string} [k] - XMLのkey属性に指定したい文字列
 * @param {string} [value] - 出力したい文字列
 * @return {string} XML形式の文字列
 */
function v(k, value) {
  if (value == undefined) {
    value = "";
  }
  const trimmed = value.toString().trim();
  return (
    '<kv key="' + k + '"><value><![CDATA[' + trimmed + "]]></value></kv>\n"
  );
}

/**
 * キーと値を持つXML形式の画像ファイルタグの文字列を生成して返す
 *
 * @param {string} [k] - XMLのkey属性に指定したい文字列
 * @param {string} [group] - 画像をどこで使用したいか、グループ指定の文字列
 * @return {string} XML形式の画像ファイルタグの文字列
 */
function img(k, group) {
  return '<kv key="' + k + '" type="file" image_from="' + group + '"></kv>\n';
}

/**
 * リッチテキストのXML形式の文字列を生成して返す
 *
 * @param {string} [k] - XMLのkey属性に指定したい文字列
 * @param {string} [value] - 住所やサンプルテキストなどの文字列
 * @return {string} 改行があればpタグを追加するXML形式の文字列
 */
function richtext(k, value) {
  //value = value.toString();

  if (value != "") {
    value = "<p>" + value + "</p>";
  }
  const trimmed = value.trim();
  return (
    '<kv key="' +
    k +
    '"><value><![CDATA[' +
    trimmed.replace(/\n/g, "</p><p>") +
    "]]></value></kv>\n"
  ); //gのフラグを付けて、マッチしたすべて置換にする。
}

/**
 * 現在アクティブ状態のシート名を取得して返す
 *
 * @param {string} [name] - シート名の文字列
 * @return {string} 現在アクティブ状態のシート名の文字列
 */
function get_sheet(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(name);
}

/**
 * UUIDを取得して返す
 *
 * @param {string} [column] - シートの列を指定する文字列
 * @return {string} 選択されたセルに記載のUUIDの文字列
 */
function widget_uuid(column) {
  return get_sheet("全パーツ")
    .getRange(
      column +
        {
          smart: 2,
          unbalan: 3,
          kind: 4,
          採用smart: 5,
        }[get_sheet("makexml").getRange("E15").getValue()]
    )
    .getValue();
}

function make_page(p, callback_parts) {
  let xml = "";
  xml += "<type>\n";
  xml += "  <datastore>page</datastore>\n";
  xml += "  <class>page</class>\n";
  xml += "  <key></key>\n";
  xml += "  " + v("url", p.url);
  xml += "  " + v("name", p.page_name);
  xml += "  " + v("layout", p.layout);
  xml += "  " + v("auth_user", p.auth_user);
  xml += "  " + v("auth_pw", p.auth_pw);
  xml += "  " + v("on_sitemap", p.on_sitemap);
  xml += "  " + v("analysis", p.analysis ? p.analysis : "1");
  xml += "  " + v("is_dummy", "");
  xml += "  " + v("parent_path", "");
  xml += "  <child>\n";
  xml += "    <type>\n";
  xml += "      <datastore>meta</datastore>\n";
  xml += "      <class>meta</class>\n";
  xml += "      " + v("title", p.title);
  xml +=
    "      " +
    v(
      "title_inherit_order",
      p.title_inherit_order ? p.title_inherit_order : "before"
    );
  xml += "      " + v("title_mode", p.title_mode ? p.title_mode : "input");
  xml += "      " + v("canonical", "");
  xml += "      " + v("canonical_type", "inside");
  xml += "      " + v("robots", "");
  xml += "      " + v("description", p.description);
  xml += "      " + v("h4seo", p.h4seo);
  xml += "      " + v("h4seo_mode", "input");
  xml += "      " + v("h4seo_title_inherit_order", "ignore");
  xml += "      " + v("keyword_1", p.keyword_1);
  xml += "      " + v("keyword_2", p.keyword_2);
  xml += "      " + v("keyword_3", "");
  xml += "      " + v("keyword_4", "");
  xml += "      " + v("keyword_5", "");
  xml += "      " + v("keyword_6", "");
  xml += "      " + v("keyword_7", "");
  xml += "      " + v("keyword_inherit", 1);
  xml += "      " + v("one_phrase", p.one_phrase);
  xml += "      " + v("seo_keyword_1", "");
  xml += "      " + v("seo_keyword_2", "");
  xml += "      " + v("seo_keyword_3", "");
  xml += "      " + v("seo_keyword_4", "");
  xml += "      " + v("seo_keyword_5", "");
  xml += "    </type>\n";
  xml += "  </child>\n";
  xml += '  <child key="page">' + callback_parts() + "</child>\n";
  xml += "</type>\n";

  return xml;
}
function make_page_with_directory(p, callback_parts) {
  let xml = "";
  xml += "<type>\n";
  xml += "  <datastore>setting</datastore>\n";
  xml += "  <class>directory</class>\n";
  xml += "  <key></key>\n";
  xml += "  <id>0</id>\n";
  xml += "  <parent>" + p.parent + ".setting</parent>";
  xml += "  " + v("_code", p.code);
  xml += "  " + v("name", p.name);
  xml += '  <kv key="list_only"><value>0</value></kv>\n';
  xml += '  <kv key="url"><value>' + p.url + "</value></kv>\n";
  xml += '  <child key="system_page">\n';
  xml += "    <type>\n";
  xml += "      <datastore>page</datastore>\n";
  xml += "      <class>page</class>\n";
  xml += "      <key>/</key>\n";
  xml += "      " + v("url", "/" + p.url + "/");
  xml += "      " + v("name", p.name);
  xml += "      " + v("layout", p.layout);
  xml += "      " + v("auth_user", p.auth_user);
  xml += "      " + v("auth_pw", p.auth_pw);
  xml += "      " + v("on_sitemap", p.on_sitemap);
  xml += "      " + v("analysis", p.analysis ? p.analysis : "1");
  xml += "      " + v("is_dummy", "");
  xml += "      " + v("without_list", 0);
  xml += '      <kv key="parent_path" type="array"><value></value></kv>\n';
  xml += "      <child>\n";
  xml += "      <type>\n";
  xml += "        <datastore>meta</datastore>\n";
  xml += "        <class>meta</class>\n";
  xml += "        " + v("title", p.title);
  xml += "        " + v("title_inherit_order", "before");
  xml += "        " + v("title_mode", p.title_mode ? p.title_mode : "input");
  xml += "        " + v("canonical", "");
  xml += "        " + v("canonical_type", "inside");
  xml += "        " + v("robots", "");
  xml += "        " + v("description", p.description ? p.description : "");
  xml += "        " + v("h4seo", p.h4seo);
  xml += "        " + v("h4seo_mode", "input");
  xml += "        " + v("h4seo_title_inherit_order", "ignore");
  xml += "        " + v("keyword_1", p.keyword_1);
  xml += "        " + v("keyword_2", p.keyword_2);
  xml += "        " + v("keyword_3", "");
  xml += "        " + v("keyword_4", "");
  xml += "        " + v("keyword_5", "");
  xml += "        " + v("keyword_6", "");
  xml += "        " + v("keyword_7", "");
  xml += "        " + v("keyword_inherit", 1);
  xml += "        " + v("one_phrase", p.one_phrase);
  xml += "        " + v("seo_keyword_1", "");
  xml += "        " + v("seo_keyword_2", "");
  xml += "        " + v("seo_keyword_3", "");
  xml += "        " + v("seo_keyword_4", "");
  xml += "        " + v("seo_keyword_5", "");
  xml += "      </type>\n";
  xml += "    </child>\n";
  if (callback_parts != undefined) {
    xml += '  <child key="page">' + callback_parts() + "</child>\n";
  }
  xml += "  </type>\n";
  xml += "  </child>\n";
  xml += "</type>\n";
  return xml;
}

function tag_with_page(
  name,
  h1,
  description,
  parent,
  page,
  layout,
  url_prefix,
  parts_function
) {
  const h1mode = h1 == "" ? "same_title" : "input"; //h1が空だったら「titleを使用する」、空じゃなかったら「直接入力」
  const h1inherit_order = h1 == "" ? "before" : "ignore";
  let xml = "";
  xml += "<type>\n";
  xml += "  <datastore>setting</datastore>\n";
  xml += "  <class>tag</class>\n";
  xml += "  <parent>" + parent + ".setting</parent>\n";
  xml += " " + v("name", name.replace(/ /g, "_"));
  xml += '  <child key="system_page">\n';
  xml += "    <type>\n";
  xml += "      <datastore>page</datastore>\n";
  xml += "      <class>page</class>\n";
  xml += "      <parent>" + page + ".setting</parent>\n";
  xml += " " + v("url", url_prefix + name.replace(/ /g, "_") + "/");
  xml += "      " + v("parent_path", "");
  xml += "      " + v("layout", layout);
  xml += "      " + v("auth_user", "");
  xml += "      " + v("auth_pw", "");
  xml += "      " + v("on_sitemap", "0");
  xml += "      " + v("is_dummy", "0");
  xml += "      " + v("without_list", "1");
  xml += "      " + v("name", name);
  xml += "      <child>\n";
  xml += "        <type>\n";
  xml += "        <datastore>meta</datastore>\n";
  xml += "        <class>meta</class>\n";
  xml += "        " + v("title_inherit_order", "before");
  xml += "        " + v("h4seo", h1);
  xml += "        " + v("h4seo_mode", h1mode);
  xml += "        " + v("h4seo_title_inherit_order", h1inherit_order);
  xml += "        " + v("description", description ? description : "");
  xml += "        </type>\n";
  xml += "      </child>\n";
  xml += '      <child key="page">\n';
  xml += "      " + parts_function();
  xml += "      </child>\n";
  xml += "    </type>\n";
  xml += "  </child>\n";
  xml += "</type>\n";
  return xml;
}

/**
 * 郵便番号から住所を取得して返す
 *
 * @param {string} [zip] - 郵便番号の-を抜いた文字列
 * @return {Object} 住所のオブジェクト
 */
function parts(p, callback_kv) {
  let xml = "";
  xml += "<type>\n";
  xml += "  <datastore>cms</datastore>\n";
  xml += "  <class>parts/library</class>\n";
  xml += "  <key>" + p.key + "</key>\n";
  if (p.parent) {
    p.parent.forEach(function (parent) {
      xml += "<parent>" + parent + "</parent>";
    });
  }
  xml +=
    '<parent widget_id_from_uuid="' + widget_uuid(p.column) + '"></parent>\n';
  xml += callback_kv();
  xml += "</type>\n";
  return xml;
}

function mv_parts(title_en, title_jp) {
  //下層_MV
  return parts({ column: "T", key: "mv" }, function () {
    const makexml = get_sheet("makexml");
    const mvtype = makexml.getRange("E16").getValue();
    let xml = "";
    xml += v("ttl_en", title_en);
    xml += v("ttl_jp", title_jp);
    if (
      mvtype != "下層_MV_3" &&
      mvtype != "下層_MV_14" &&
      mvtype != "下層_MV_17"
    ) {
      xml += img("bg_image", "under_mv");
    }
    if (mvtype != "下層_MV_22") {
      xml += v("position", "50% 0");
      xml += v("position_y", "center center");
    }
    return xml;
  });
}

function set_page_meta(page_id, id, callback_kv) {
  //ページのMeta情報
  let xml = "";
  xml += "<type>\n";
  xml += "  <datastore>meta</datastore>\n";
  xml += "  <class>meta</class>\n";
  xml += "  <parent>" + page_id + ".page</parent>";
  xml += "  <id>" + id + "</id>"; //入力欄のｉｄ
  xml += callback_kv();
  xml += "</type>\n";
  return xml;
}

function blog_category(cat, writings, parent, page) {
  const dir = "blog";
  return tag_with_page(
    cat,
    writings[1],
    writings[3],
    parent,
    page,
    "169",
    "/" + dir + "/category/",
    function () {
      //name, parent, page, layout, url_prefix, parts_function

      let xml = "";
      xml += parts({ column: "BW", key: "ttl" }, function () {
        let xml = "";
        xml += v("h_ttl2", cat);
        xml += v("h_ttl3", writings[2]);
        xml += richtext("text", writings[3]);
        return xml;
      });
      xml += parts({ column: "L", key: "text" }, function () {
        let xml = "";
        xml += v("directory_code", "blog");
        xml += v("tag_page", dir + "/category");
        xml += v("category_text", writings[4]);
        return xml;
      });
      return xml;
    }
  );
}
function blog_tag(tag, writings, parent, page) {
  const dir = "blog";
  const description = writings[1] ? writings[1] : writings[0];
  return tag_with_page(
    tag,
    "",
    description,
    parent,
    page,
    "166",
    "/" + dir + "/",
    function () {
      let xml = "";

      xml += parts({ column: "O", key: "main" }, function () {
        let xml = "";
        xml += v("directory_code", "blog");
        xml += richtext("text", writings[0]);
        return xml;
      });
      if (writings[1].length > 0) {
        xml += parts({ column: "BZ", key: "text" }, function () {
          let xml = "";
          xml += richtext("text", writings[1]);
          return xml;
        });
      }
      return xml;
    }
  );
}

function aiblog_category(cat, parent, page) {
  const ss_makexml = get_sheet("makexml");
  const dir = "column";
  let layout = "";
  const sitesetPattern = ss_makexml.getRange("E15").getValue();
  if (sitesetPattern == "smart" || sitesetPattern == "採用smart") {
    layout = "183";
  } else if (sitesetPattern == "unbalan") {
    layout = "184";
  } else if (sitesetPattern == "kind") {
    layout = "185";
  }

  return tag_with_page(
    cat,
    "",
    "",
    parent,
    page,
    layout,
    "/" + dir + "/category/",
    function () {
      //name, parent, page, layout, url_prefix, parts_function

      let xml = "";
      xml += parts({ column: "BW", key: "cont" }, function () {
        let xml = "";
        xml += v("h_ttl2", cat);
        return xml;
      });
      return xml;
    }
  );
}
function aiblog_tag(tag, parent, page) {
  const ss_makexml = get_sheet("makexml");
  const dir = "column";
  let layout = "";
  const sitesetPattern = ss_makexml.getRange("E15").getValue();
  if (sitesetPattern == "smart" || sitesetPattern == "採用smart") {
    layout = "181";
  } else if (sitesetPattern == "unbalan") {
    layout = "182";
  } else if (sitesetPattern == "kind") {
    layout = "183";
  }

  return tag_with_page(
    tag,
    "",
    "",
    parent,
    page,
    layout,
    "/" + dir + "/",
    function () {
      let xml = "";

      xml += parts({ column: "CE", key: "cont" }, function () {
        let xml = "";
        xml += v("directory_code", "column");
        xml += richtext("text", "");
        return xml;
      });

      return xml;
    }
  );
}

function fieldset(datastore, key, callback_kv) {
  let xml = "";
  xml += "<type>\n";
  xml += "  <datastore>" + datastore + "</datastore>\n";
  xml += "  <class>fieldset</class>\n";
  xml += "  <key>" + key + "</key>\n";
  xml += callback_kv();
  xml += "  </type>\n";
  return xml;
}

function checkEmpty(element) {
  return element !== undefined && element !== 0 && element !== null;
}

function MakeXML() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const ss_makexml = get_sheet("makexml");
  ss_makexml.getRange("B21").clearContent();

  const sitesetPattern = ss_makexml.getRange("E15").getValue();

  if (sitesetPattern == "") {
    Browser.msgBox("エラー！！  サイトセットパターンを選択してください！");
    return;
  }

  const is_ai = ss_makexml.getRange("E7").getValue();
  const is_supported_kuchikomi = ss_makexml.getRange("K10").getValue();

  const ss_basic = ss.getSheetByName("基本情報");
  const ss_ws_fixed = get_sheet("ライティングシート (固定)");
  const ss_ws_flex = get_sheet("ライティングシート (可変)");
  const ss_ws_top = get_sheet("ライティングシート (TOP)");
  //const ss_page = get_sheet('ページ構成');
  //const ss_parts_list = get_sheet('パーツ設置箇所確認用');
  const ss_shops = get_sheet("店舗情報");
  const ss_csv = get_sheet("CSV");
  const ss_hearing = get_sheet("ヒアリングシート");
  let url_facebook = ss_hearing.getRange("F74").getValue();
  if (url_facebook.indexOf("http") < 0) {
    url_facebook = "/delete_this_url/";
  }
  let url_twitter = ss_hearing.getRange("F75").getValue();
  if (url_twitter.indexOf("http") < 0) {
    url_twitter = "/delete_this_url/";
  }
  let url_instagram = ss_hearing.getRange("F76").getValue();
  if (url_instagram.indexOf("http") < 0) {
    url_instagram = "/delete_this_url/";
  }
  let url_ameblo = ss_hearing.getRange("F78").getValue();
  if (url_ameblo.indexOf("http") < 0) {
    url_ameblo = "/delete_this_url/";
  }
  let url_line = ss_hearing.getRange("F79").getValue();
  if (url_line.indexOf("http") < 0) {
    url_line = "/delete_this_url/";
  }

  let domain = ss_csv.getRange("O2").getValue().trim(); //ドメイン
  if (!domain.length) {
    //リニューアルの場合、M2は空欄でN2に既存ドメイン
    domain = ss_csv.getRange("P2").getValue().trim();
  }
  domain = extractDomain(domain);
  const company = ss_csv.getRange("D2").getValue().trim(); //企業名
  const unit = ss_makexml.getRange("E9").getValue().trim(); //当〇
  const store = ss_shops.getRange("C3").getValue().trim(); //店舗名
  let zip = ss_shops.getRange("C4").getValue().toString().trim();

  if (zip == "" || zip == "記載なし") {
    zip = ["", ""];
  } else {
    zip = zip.split("-");
  }

  // const address = ss_shops.getRange("C5").getValue().trim().replace(/　/g, " ");
  const address = ss_shops.getRange("C5").getValue().trim();
  const addr = zip2addr(zip[0] + "" + zip[1]);
  const addr2 = address
    .replace(addr.prefecture, "")
    .replace(addr.address1, "")
    .replace(addr.address2, "")
    .trim();
  let tel = ss_shops.getRange("C6").getValue().trim().split("-");
  if (tel[0] == undefined || tel[1] == undefined || tel[2] == undefined) {
    tel = ["000", "0000", "0000"];
  }
  const fax = ss_shops.getRange("C7").getValue().trim().split("-");
  const hours = ss_shops.getRange("C8:C9").getDisplayValues().flat();
  const is_supported_bbs = ss_makexml.getRange("K8").getValue();
  const representative = ss_csv.getRange("I2").getValue();

  let feature_pagename = "特徴";

  if (sitesetPattern == "採用smart") {
    feature_pagename = "当" + ss_makexml.getRange("E9").getValue() + "を知る";
  }

  if (is_supported_bbs == "") {
    Browser.msgBox("BBS有りorなしを選択してください！");
    return;
  }

  if (is_supported_kuchikomi == "") {
    Browser.msgBox("口コミ有りorなしを選択してください！");
    return;
  }

  let xml = "";

  //カラー設定
  /* const base_color_select = ss_makexml.getRange("E16").getValue();
  var bg_text = '';
  if (base_color_select == '黒ベース') {
    var bg_text = '#ffffff';
  }
  else {
    var bg_text = '#313131';
  } */

  //Metaタグ
  xml += "<!--Metaタグ-->";
  xml +=
    '<type>\n\
  <datastore>meta</datastore>\n\
  <class>metatags</class>\n\
  <id>89</id>\n\
  <parent>25.layout</parent>\n\
  <kv key="meta_type">\n\
      <value><![CDATA[property]]></value>\n\
  </kv>\n\
  <kv key="name">\n\
      <value><![CDATA[og:image]]></value>\n\
  </kv>\n\
  <kv key="content">\n\
      <value><![CDATA[https://' +
    domain +
    '/_img/ja/resource/9/logo/250_250_1_ffffff/]]></value>\n\
  </kv>\n\
  </type>\n\
  <type>\n\
  <datastore>meta</datastore>\n\
  <class>metatags</class>\n\
  <id>92</id>\n\
  <parent>25.layout</parent>\n\
  <kv key="meta_type">\n\
      <value><![CDATA[property]]></value>\n\
  </kv>\n\
  <kv key="name">\n\
      <value><![CDATA[og:site_name]]></value>\n\
  </kv>\n\
  <kv key="content">\n\
      <value><![CDATA[' +
    store +
    ']]></value>\n\
  </kv>\n\
  </type>\n\
  <type>\n\
  <datastore>meta</datastore>\n\
  <class>metatags</class>\n\
  <id>3227</id>\n\
  <parent>25.layout</parent>\n\
  <kv key="meta_type">\n\
      <value><![CDATA[property]]></value>\n\
  </kv>\n\
  <kv key="name">\n\
      <value><![CDATA[og:image:secure_url]]></value>\n\
  </kv>\n\
  <kv key="content">\n\
      <value><![CDATA[https://' +
    domain +
    "/_img/ja/resource/9/logo/250_250_1_ffffff/]]></value>\n\
  </kv>\n\
  </type>";

  let img_folder_root = "";
  let img_folders = {};

  if (ss_makexml.getRange("E8").getValue() == "任意のフォルダ→") {
    img_folder_root = ss_makexml.getRange("F8").getValue() + "/";
    img_folders = {
      mv: ["mainimage"],
      top: ["下層800"],
      under_mv: ["MV用1920", "MV用1920"],
      under: ["下層800", "下層800", "下層800", "下層800", "下層800", "下層800"],
    };
  } else {
    img_folder_root = "_ASTEER/" + ss_makexml.getRange("E8").getValue() + "/";
    img_folders = {
      mv: ["mainimage"],
      top: ["01_top", "00_mv"],
      under_mv: ["00_mv"],
      under: [
        "02_concept",
        "03_seo11",
        "04_seo12",
        "05_seo13",
        "06_service",
        "07_servicemenu",
        "08_menu",
        "09_menu2",
        "10_faq",
        "11_gallery",
        "12_voice",
        "13_staff",
        "14_recruit",
        "15_schedule",
        "16_news",
        "17_access",
        "18_accessseo",
        "19_blog",
        "20_about",
        "21_seo21",
        "22_seo22",
        "23_seo23",
      ],
    };
  }

  for (let key in img_folders) {
    xml += '<imageStorage group="' + key + '">\n';
    img_folders[key].forEach(function (v, key) {
      xml += "<path>" + img_folder_root + v + "</path>\n";
    });
    xml += "</imageStorage>\n";
  }

  console.log("2");

  /*   xml += '<type>\n\
    <datastore>resource</datastore>\n\
    <class>resource</class>\n\
    <id>69</id>\n\
    <parent>20.setting</parent>\n\
    '+ v('background', ss_makexml.getRange('E12').getValue())
      + v('background_text', bg_text)
      + v('main', ss_makexml.getRange('E13').getValue())
      + v('main_text', '#ffffff')
      + v('accent', ss_makexml.getRange('E14').getValue())
      + '</type>'; */

  //採用共通
  if (sitesetPattern == "採用smart") {
    //採用共通
    xml +=
      "<type>\n\
    <datastore>resource</datastore>\n\
    <class>resource</class>\n\
    <id></id>\n\
    <parent>2337.setting</parent>\n\
    " +
      v("name", store) +
      v("domain", "https://" + domain + "/") +
      "</type>";
  }

  //求人（募集要項）　通知メール設定
  if (sitesetPattern == "採用smart") {
    xml += recruit_mailtemplate(domain);
  }

  let parent = ""; //AIブログ設定

  if (sitesetPattern == "smart" || sitesetPattern == "採用smart") {
    parent = "2291";
  } else if (sitesetPattern == "unbalan") {
    parent = "2295";
  } else if (sitesetPattern == "kind") {
    parent = "2234";
  }

  xml +=
    "<type>\n\
    <datastore>resource</datastore>\n\
    <class>resource</class>\n\
    <id></id>\n\
    <parent>" +
    parent +
    ".setting</parent>\n\
    " +
    v("kw", ss_csv.getRange("AZ2").getValue()) +
    "</type>";

  //WEBサイト基本情報
  xml +=
    "<type>\n\
  <datastore>resource</datastore>\n\
  <class>resource</class>\n\
  <id>9</id>\n\
  <parent>5.setting</parent>\n\
  " +
    v("company_name", store) +
    v("name", store) +
    v("logo_bg", "none") +
    v("logo_padding", "0px") +
    v("logo_bg_rwd", "none") +
    v("logo_padding_rwd", "0px") +
    v("address_zip1", zip[0]) +
    v("address_zip2", zip[1]) +
    v("address_prefectures", addr.prefecture) +
    v("address_city", addr.address1) +
    v("address_address", addr.address2) +
    v("address_address2", addr2) +
    v("tel1", tel[0] ? tel[0] : "") +
    v("tel2", tel[1] ? tel[1] : "") +
    v("tel3", tel[2] ? tel[2] : "") +
    v("fax1", fax[0] ? fax[0] : "") +
    v("fax2", fax[1] ? fax[1] : "") +
    v("fax3", fax[2] ? fax[2] : "") +
    v(
      "hours",
      ss_shops.getRange("C8").getDisplayValue() +
        "～" +
        ss_shops.getRange("C9").getDisplayValue()
    ) +
    v("copyright", store) +
    v("facebook_url", url_facebook) +
    v("twitter_url", url_twitter) +
    v("line_url", url_line) +
    v("ameba_url", url_ameblo) +
    v("instagram_url", url_instagram) +
    v("title1", "店舗名") +
    v("title2", "住所") +
    v("title3", "電話番号") +
    v("title4", "営業時間") +
    v("googlemap", ss_makexml.getRange("I8").getValue()) +
    img("parallax_common_bg", "mv") +
    img("cv_image", "mv") +
    "</type>";

  // ブログ署名
  let signature =
    "<p>" +
    store +
    "</p>\n\
  <p>住所：" +
    address +
    "</p>";

  if (is_supported_bbs == "なし") {
    signature +=
      "\n<p>電話番号：" + ss_shops.getRange("C6").getValue() + "</p>";
  }

  if (sitesetPattern == "smart" || sitesetPattern == "採用smart") {
    xml +=
      "<type>\n\
  <datastore>resource</datastore>\n\
  <class>resource</class>\n\
  <id>9971</id>\n\
  <parent>2111.setting</parent>\n\
  " +
      v("sign_top", signature) +
      "</type>";
  } else if (sitesetPattern == "unbalan") {
    xml +=
      "<type>\n\
  <datastore>resource</datastore>\n\
  <class>resource</class>\n\
  <id>9964</id>\n\
  <parent>2082.setting</parent>\n\
  " +
      v("sign_top", signature) +
      "</type>";
  } else if (sitesetPattern == "kind") {
    xml +=
      "<type>\n\
  <datastore>resource</datastore>\n\
  <class>resource</class>\n\
  <id>9956</id>\n\
  <parent>1982.setting</parent>\n\
  " +
      v("sign_top", signature) +
      "</type>";
  }

  xml += "\n\n<!-- ここからグローバルナビゲーション -->\n";
  const links_flexible = ss_makexml.getRange("E29:F43").getValues(); //可変ページの最初の5つ
  let links_featuresub = ss_makexml.getRange("E21:E25").getValues(); //特徴の重点
  let shop_names = []; //複数店舗用

  for (let i = 3; i <= 120; i = i + 15) {
    const name = ss_shops.getRange(i, 3).getValue();
    if (name.length > 0) {
      shop_names.push(name);
    }
  }

  ss_makexml
    .getRange("F21:F25")
    .getValues()
    .forEach(function (v) {
      if (v[0].length > 0) {
        links_featuresub.push(v);
      }
    });
  const links_fixed = ss_makexml.getRange("E44:F52").getValues(); //固定ページ

  xml +=
    '<type>\n\
    <datastore>resource</datastore>\n\
    <class>resource</class>\n\
    <id>12</id>\n\
    <parent>11.setting</parent>\n\
    <child key="link">\n';
  xml += fieldset("resource", "link", function () {
    let xml = "";
    xml += v("link_url", "/");
    xml += v("link_text", "TOP");
    xml += v("hidden", "0");
    xml += v("target", "");
    return xml;
  });
  for (i = 0; i < links_flexible.length; i++) {
    const name = links_flexible[i][0];
    const url = links_flexible[i][1];

    if (name != "" && url != "") {
      xml += fieldset("resource", "link", function () {
        let xml = "";
        xml += v("link_url", "/" + url + "/");
        xml += v("link_text", name);
        xml += v("hidden", "0");
        xml += v("target", "");
        return xml;
      });
    }
  }
  xml += fieldset("resource", "link", function () {
    let xml = "";
    xml += v("link_url", "/feature/");
    xml += v("link_text", feature_pagename);
    xml += v("hidden", "0");
    xml += v("target", "");
    xml += '<child key="sub_nav">\n';
    for (let i = 0; i < links_featuresub.length; i++) {
      if (links_featuresub[i][0] == "") {
        continue;
      }
      const name = links_featuresub[i][0];

      xml += fieldset("resource", "sub_nav", function () {
        let xml = "";
        xml += v("href", "/feature/" + name.replace(/ /g, "_") + "/");
        xml += v("text", name);
        xml += v("hidden", "0");
        xml += v("target", "");
        return xml;
      });
    }
    xml += "</child>\n";
    return xml;
  });

  for (let i = 0; i < links_fixed.length; i++) {
    const pagename = links_fixed[i][0];
    const url = links_fixed[i][1];

    if (
      pagename == "プライバシーポリシー" ||
      pagename == "サイトマップ" ||
      pagename == "お問い合わせ"
    ) {
      continue;
    }

    if (url == "privacypolicy" || url == "sitemap" || url == "contact") {
      continue;
    }

    if (url == "" || pagename == "") {
      continue;
    }

    xml += fieldset("resource", "link", function () {
      //アクセス
      let xml = "";
      xml += v("link_url", "/" + url + "/");
      xml += v("link_text", pagename);
      xml += v("hidden", "0");
      xml += v("target", "");
      if (i == 0 && shop_names.length > 1) {
        //複数店舗の場合アクセス重点を入れる
        xml += '<child key="sub_nav">\n';
        shop_names.forEach(function (name) {
          xml += fieldset("resource", "sub_nav", function () {
            let xml = "";
            xml += v("href", "/" + url + "/" + name + "/"); //変更
            xml += v("text", name);
            xml += v("hidden", "0");
            xml += v("target", "");
            return xml;
          });
        });
        xml += "</child>\n";
      }
      return xml;
    });
  }

  xml += "</child></type>";

  xml += "\n\n<!-- ここからハンバーガーメニュー -->\n";
  xml +=
    '<type>\n\
        <datastore>resource</datastore>\n\
        <class>resource</class>\n\
        <id>91</id>\n\
        <parent>1312.setting</parent>\n\
        <child key="link">\n';
  xml += fieldset("resource", "link", function () {
    let xml = "";
    xml += v("link_url", "/");
    xml += v("link_text", "TOP");
    xml += v("hidden", "0");
    xml += v("target", "");
    return xml;
  });
  for (i = 0; i < links_flexible.length; i++) {
    const name = links_flexible[i][0];
    const url = links_flexible[i][1];

    if (name != "" && url != "") {
      xml += fieldset("resource", "link", function () {
        let xml = "";
        xml += v("link_url", "/" + url + "/");
        xml += v("link_text", name);
        xml += v("hidden", "0");
        xml += v("target", "");
        return xml;
      });
    }
  }
  xml += fieldset("resource", "link", function () {
    let xml = "";
    xml += v("link_url", "/feature/");
    xml += v("link_text", feature_pagename);
    xml += v("hidden", "0");
    xml += v("target", "");
    xml += '<child key="sub_nav">\n';
    for (let i = 0; i < links_featuresub.length; i++) {
      if (links_featuresub[i][0] == "") {
        continue;
      }
      const name = links_featuresub[i][0];
      xml += fieldset("resource", "sub_nav", function () {
        let xml = "";
        xml += v("href", "/feature/" + name.replace(/ /g, "_") + "/");
        xml += v("text", name);
        xml += v("hidden", "0");
        xml += v("target", "");
        return xml;
      });
    }
    xml += "</child>\n";
    return xml;
  });
  for (let i = 0; i < links_fixed.length; i++) {
    //アクセス〜サイトマップのリンク

    const name = links_fixed[i][0];
    const url = links_fixed[i][1];

    if (name == "" || url == "") {
      continue;
    }

    xml += fieldset("resource", "link", function () {
      let xml = "";
      xml += v("link_url", "/" + url + "/");
      xml += v("link_text", name);
      xml += v("hidden", "0");
      xml += v("target", "");

      if (i == 0 && shop_names.length > 1) {
        //複数店舗の場合アクセス重点を入れる
        xml += '<child key="sub_nav">\n';
        shop_names.forEach(function (name) {
          xml += fieldset("resource", "sub_nav", function () {
            let xml = "";
            xml += v("href", "/" + url + "/" + name + "/");
            xml += v("text", name);
            xml += v("hidden", "0");
            xml += v("target", "");
            return xml;
          });
        });
        xml += "</child>\n";
      }
      return xml;
    });
  }

  xml += "</child></type>";

  xml += "\n\n<!-- ブログ署名リンクアーティクル -->\n";
  let col = "W";
  const merchandise = ss_csv.getRange("C2").getValue(); //商品

  if (!merchandise.includes("ライトプラン")) {
    for (let i = 0; i < 5; i++) {
      const title = ss_makexml.getRange("E" + (21 + i)).getValue();
      xml += '<type id_map="sign_' + i + '">\n';
      xml += "  <datastore>article</datastore>\n";
      xml += "  <class>article</class>\n";
      xml += "  <key>article</key>\n";
      xml += "  <parent>1891.setting</parent>\n";
      xml += " " + v("title", title.replace(/ /g, "_"));
      //xml += '  ' + v('sign', ss_ws_fixed.getRange('U' + (185 + (i * 6))).getValue());
      xml +=
        "  " + v("sign", ss_ws_fixed.getRange(col + (195 + i * 6)).getValue());
      xml += " " + v("link", "/feature/" + title.replace(/ /g, "_") + "/");
      xml += "</type>";
    }
    for (let i = 5; i < 10; i++) {
      const title = ss_makexml.getRange("F" + (21 + i - 5)).getValue();
      if (title.length < 1) {
        continue;
      }
      xml += '<type id_map="sign_' + i + '">\n';
      xml += "  <datastore>article</datastore>\n";
      xml += "  <class>article</class>\n";
      xml += "  <key>article</key>\n";
      xml += "  <parent>1891.setting</parent>\n";
      xml += "  " + v("title", title);
      //xml += '  ' + v('sign', ss_ws_fixed.getRange('U' + (185 + (i * 6))).getValue());
      xml +=
        "  " + v("sign", ss_ws_fixed.getRange(col + (195 + i * 6)).getValue());
      xml += "  " + v("link", "/feature/" + title.replace(/ /g, "_") + "/");
      xml += "</type>";
    }
    console.log("shop_names", shop_names);
    //複数店舗
    if (shop_names.length > 1) {
      for (let j = 0; j < shop_names.length; j++) {
        const title = shop_names[j];
        if (title.length < 1) {
          continue;
        }
        xml += '<type id_map="sign_' + (i + j) + '">\n';
        xml += "  <datastore>article</datastore>\n";
        xml += "  <class>article</class>\n";
        xml += "  <key>article</key>\n";
        xml += "  <parent>1891.setting</parent>\n";
        xml += "  " + v("title", title);
        //xml += '  ' + v('sign', ss_ws_fixed.getRange('U' + (185 + (i * 6))).getValue());
        xml +=
          "  " + v("sign", ss_ws_fixed.getRange(347 + j * 46, 23).getValue());
        xml += "  " + v("link", "/company/" + title.replace(/ /g, "_") + "/");
        xml += "</type>";
      }
    }
  }

  xml += "\n\n<!-- ここから AIブログレイアウト-->\n";
  const description = ss
    .getSheetByName("ライティングシート (TOP)")
    .getRange("U19")
    .getValue();
  let parent_aibloglayout = "";

  if (sitesetPattern == "smart") {
    parent_aibloglayout = "2358";
  } else if (sitesetPattern == "kind") {
    parent_aibloglayout = "2304";
  } else if (sitesetPattern == "unbalan") {
    parent_aibloglayout = "2372";
  } else if (sitesetPattern == "採用smart") {
    parent_aibloglayout = "2422";
  }

  xml +=
    "<type>\n\
    <datastore>resource</datastore>\n\
    <class>resource</class>\n\
    <id></id>\n\
    <parent>" +
    parent_aibloglayout +
    '.setting</parent>\n\
    <kv key="article">\n\
      <value><![CDATA[1333]]></value>\n\
    </kv>\n\
    <child key="top_banner">\n\
      <type>\n\
        <datastore>resource</datastore>\n\
        <class>fieldset</class>\n\
        <key>top_banner</key>\n\
        <kv key="title">\n\
          <value><![CDATA[' +
    store +
    ']]></value>\n\
        </kv>\n\
        <kv key="text">\n\
          <value><![CDATA[' +
    description +
    ']]></value>\n\
        </kv>\n\
        <kv key="href">\n\
          <value><![CDATA[/contact/]]></value>\n\
        </kv>\n\
        <kv key="btn_title">\n\
          <value><![CDATA[CONTACT]]></value>\n\
        </kv>\n\
        <kv key="link_text">\n\
          <value><![CDATA[お問い合わせ]]></value>\n\
        </kv>\n\
      </type>\n\
    </child>\n\
    <child key="bottom_banner">\n\
      <type>\n\
        <datastore>resource</datastore>\n\
        <class>fieldset</class>\n\
        <key>bottom_banner</key>\n\
        <kv key="title">\n\
          <value><![CDATA[' +
    store +
    ']]></value>\n\
        </kv>\n\
        <kv key="text">\n\
          <value><![CDATA[' +
    description +
    ']]></value>\n\
        </kv>\n\
        <kv key="href">\n\
          <value><![CDATA[/contact/]]></value>\n\
        </kv>\n\
        <kv key="btn_title">\n\
          <value><![CDATA[CONTACT]]></value>\n\
        </kv>\n\
        <kv key="link_text">\n\
          <value><![CDATA[お問い合わせ]]></value>\n\
        </kv>\n\
      </type>\n\
    </child>\n\
  </type>';

  xml += "\n\n<!-- ここから 店舗アーティクル-->\n";

  let shop_count = 0;
  let xml_shop = "";
  for (let i = 0; i < 10; i++) {
    const offset = i * 15;
    const shop_name = ss_shops.getRange("C" + (offset + 3)).getValue();
    if (shop_name) {
      xml_shop += '<type id_map="shop_' + i + '">\n';
      xml_shop += "  <datastore>article</datastore>\n";
      xml_shop += "  <class>article</class>\n";
      xml_shop += "  <key>article</key>\n";
      xml_shop += "  <parent>543.setting</parent>\n";
      xml_shop += "  " + v("title", shop_name);
      xml_shop += "  " + v("directory", "");
      xml_shop += "  " + v("name", shop_name);
      xml_shop += "  " + v("ac3", "電話番号");
      xml_shop +=
        "  " + v("tel", ss_shops.getRange("C" + (offset + 6)).getValue());
      xml_shop += "  " + v("fax_item", "FAX番号");
      xml_shop += "  " + v("fax", ss_shops.getRange("C7").getValue());
      xml_shop += "  " + v("ac2", "住所");
      xml_shop +=
        "  " +
        v(
          "address",
          "<p>〒" +
            ss_shops.getRange("C" + (offset + 4)).getDisplayValue() +
            "</p><p>" +
            ss_shops
              .getRange("C" + (offset + 5))
              .getDisplayValue()
              .trim() +
            "</p>"
        );
      xml_shop += "  " + v("tl2", "アクセス");

      // xml_shop += '  ' + v('access', ss_ws_top.getRange('U17').getValue());
      xml_shop +=
        "  " +
        v(
          "access",
          ss_shops.getRange("C18").getValue() !== ""
            ? ss_ws_fixed.getRange("W" + (309 + i * 46)).getValue()
            : ss_ws_top.getRange("U17").getValue()
        );

      xml_shop += "  " + v("access2", "");
      xml_shop += "  " + v("ac4", "営業時間");
      xml_shop +=
        "  " +
        v(
          "hours",
          ss_shops.getRange("C" + (offset + 8)).getDisplayValue() +
            "～" +
            ss_shops.getRange("C" + (offset + 9)).getDisplayValue()
        );
      xml_shop += "  " + v("ac5", "定休日");
      xml_shop +=
        "  " + v("holiday", ss_shops.getRange("C" + (offset + 10)).getValue());
      xml_shop += "  " + v("ac6", "代表者");
      xml_shop += "  " + v("representative", "");
      xml_shop += "  " + v("ac7", "備考");
      xml_shop +=
        "  " + v("remarks", ss_shops.getRange("C" + (offset + 11)).getValue());
      xml_shop +=
        "  " + v("map", ss_makexml.getRange("I" + (8 + i)).getValue());
      xml_shop +=
        "  " + v("map_link", ss_makexml.getRange("J" + (8 + i)).getValue());
      xml_shop += '  <child key="free">';
      xml_shop += fieldset("cms", "free", function () {
        let xml = "";
        xml += v("th", "その他");
        xml += v("td", ss_shops.getRange("I" + (12 + i)).getValue());
        return xml;
      });
      xml_shop += "  </child>";
      xml_shop += "  " + v("facebook_url", url_facebook);
      xml_shop += "  " + v("twitter_url", url_twitter);
      xml_shop += "  " + v("line_url", url_line);
      xml_shop += "  " + v("ameba_url", url_ameblo);
      xml_shop += "  " + v("instagram_url", url_instagram);
      xml_shop += "  " + v("mail", "");
      xml_shop += "  " + v("ac_url", "");
      xml_shop += "</type>";
      shop_count++;
    }
  }
  xml += xml_shop;

  const pattern = get_sheet("makexml").getRange("E15").getValue();
  const obj = {
    smart: {
      cat_parent: "1925",
      cat_page: "1937",
      tag_parent: "2133",
      tag_page: "2146",
    },
    kind: {
      cat_parent: "1925",
      cat_page: "1963",
      tag_parent: "1967",
      tag_page: "2117",
    },
    unbalan: {
      cat_parent: "1913",
      cat_page: "1946",
      tag_parent: "2085",
      tag_page: "2098",
    },
    採用smart: {
      cat_parent: "1925",
      cat_page: "1937",
      tag_parent: "2133",
      tag_page: "2146",
    },
  };

  const obj_ai = {
    smart: {
      cat_parent: "2279",
      cat_page: "1938",
      tag_parent: "2280",
      tag_page: "2147",
    },
    kind: {
      cat_parent: "2222",
      cat_page: "1964",
      tag_parent: "2223",
      tag_page: "2118",
    },
    unbalan: {
      cat_parent: "2283",
      cat_page: "1947",
      tag_parent: "2284",
      tag_page: "2099",
    },
    採用smart: {
      cat_parent: "2279",
      cat_page: "1938",
      tag_parent: "2280",
      tag_page: "2147",
    },
  };

  //ライティングシート（固定）　カテゴリ１～
  xml += "\n\n<!--ここからブログカテゴリ-->\n";

  xml += (function () {
    let xml = "";
    let writing_col = 23;
    const array1 = ss_makexml.getRange("E21:E25").getValues().flat();
    const array2 = ss_makexml.getRange("F21:F25").getValues().flat();
    const category_names = array1.concat(array2);

    for (let i = 0; i < 10; i++) {
      if (category_names[i].length > 0) {
        //const writings = ss_ws_fixed.getRange(180 + (i * 6), 21, 6, 1).getValues().flat();
        const writings = ss_ws_fixed
          .getRange(190 + i * 6, writing_col, 6, 1)
          .getValues()
          .flat(); //21はU列。カテゴリのライティング
        if (category_names[i].length < 1) {
          continue;
        }
        xml += blog_category(
          category_names[i],
          writings,
          obj[pattern].cat_parent,
          obj[pattern].cat_page
        ); //カテゴリ名,h1,ライティング, parent, page
      }
    }
    return xml;
  })();

  /* ライティングシート（固定）　ブログタグ */
  xml += "\n\n<!--ここからブログタグ-->\n";
  xml += (function () {
    let xml = "";

    let writing_col = "W";

    const tag_names = ss_basic.getRange("C33:C44").getValues().flat();
    const dirname = get_sheet("makexml").getRange("F45").getValue();
    /* const area = ss_ws_fixed.getRange('U' + 270).getValue();
    const industry = ss_ws_fixed.getRange('U' + 271).getValue();
    let wholetxt = ss_ws_fixed.getRange('U' + 272 + ':U' + 291).getValues().flat(); */
    const area = ss_ws_fixed.getRange(writing_col + 280).getValue();
    const industry = ss_ws_fixed.getRange(writing_col + 281).getValue();
    let wholetxt = ss_ws_fixed
      .getRange(writing_col + 282 + ":" + writing_col + 301)
      .getValues()
      .flat();
    wholetxt.unshift(area, "", industry, "");
    const layout = "166";

    for (let i = 0; i < 12; i++) {
      const writings = [wholetxt[i * 2], wholetxt[i * 2 + 1]];

      if (tag_names[i].length > 0) {
        xml += blog_tag(
          tag_names[i],
          writings,
          obj[sitesetPattern].tag_parent,
          obj[sitesetPattern].tag_page,
          layout,
          dirname,
          "O"
        );
      }
    }
    return xml;
  })();

  xml += "\n\n<!-- ここからAIブログカテゴリ -->\n";
  if (is_ai == "あり") {
    xml += (function () {
      let xml = "";
      const array1 = ss_makexml.getRange("E21:E25").getValues().flat();
      const array2 = ss_makexml.getRange("F21:F25").getValues().flat();
      const array3 = shop_names.length > 1 ? shop_names : [];
      const category_names = array1.concat(array2, array3);

      for (let i = 0; i < category_names.length; i++) {
        if (category_names[i].length > 0) {
          if (category_names[i].length < 1) {
            continue;
          }
          xml += aiblog_category(
            category_names[i],
            obj_ai[sitesetPattern].cat_parent,
            obj_ai[sitesetPattern].cat_page
          ); //カテゴリ名,h1,ライティング, parent, page, layout id
        }
      }
      return xml;
    })();
  }

  console.log("5");

  xml += "\n\n<!-- ここからAIブログタグ -->\n";
  if (is_ai == "あり") {
    xml += (function () {
      let xml = "";

      const tag_names = ss_basic.getRange("C33:C44").getValues().flat();

      for (let i = 0; i < 12; i++) {
        if (tag_names[i].length > 0) {
          xml += aiblog_tag(
            tag_names[i],
            obj_ai[sitesetPattern].tag_parent,
            obj_ai[sitesetPattern].tag_page
          );
        }
      }
      return xml;
    })();
  }

  //複数店舗の場合
  if (shop_names.length > 1) {
    let colnum = 23;

    let rows = [342, 388, 434, 480, 526, 572, 618, 664, 710, 756]; //ライティングシート（固定）　店舗カテゴリの開始行番号
    shop_names.forEach(function (name, index) {
      const writings = ss_ws_fixed
        .getRange(rows[index], colnum, 6, 1)
        .getValues()
        .flat(); //21はU列。店舗カテゴリのライティング
      xml += blog_category(
        name,
        writings,
        obj[sitesetPattern].cat_parent,
        obj[sitesetPattern].cat_page
      );
    });
  }

  xml += "\n\n<!-- ここから TOPページ-->\n";

  xml += (function () {
    /* const top_contens_list = {
      ブログ: {
        col: 'AY'
        , url: ''
        , name: ''
        , func: top_blog
      }
    } */

    let top_writing_col = "U";
    let fixed_writing_col = "W";

    const page_name = ss_ws_fixed.getRange(fixed_writing_col + "5").getValue();
    let xml = make_page(
      {
        url: "/",
        page_name: page_name,
        layout: "152",
        auth_user: "1",
        auth_pw: "1",
        on_sitemap: "1",
        is_dummy: "",
        parent_path: "",
        h4seo: ss_ws_top.getRange(top_writing_col + "7").getValue(),
        description: ss_ws_top.getRange(top_writing_col + "11").getValue(),
        keyword_1: ss_basic.getRange("C33").getValue(),
        keyword_2: ss_basic.getRange("C34").getValue(),
        title: ss_ws_fixed.getRange(fixed_writing_col + "5").getValue(),
        one_phrase: ss_ws_top.getRange(top_writing_col + "6").getValue(),
      },
      function () {
        let xml = "";
        xml += parts({ column: "AW", key: "mv" }, function () {
          let xml = "";
          xml += v(
            "mv_text_L",
            ss_ws_top.getRange(top_writing_col + "8").getValue()
          );
          xml += v(
            "mv_text_M",
            ss_ws_top.getRange(top_writing_col + "9").getValue()
          );
          xml += '<child key="mv">\n';
          for (i = 0; i < 3; i++) {
            xml += fieldset("cms", "mv", function () {
              let xml = "";
              xml += img("image", "mv");
              xml += v("image_alt", "");
              xml += v("position", "50%");
              xml += v("position_etc", "");
              xml += v("reverse", "none");
              xml += v("reverse_etc", "");
              return xml;
            });
          }
          xml += "</child>\n";
          return xml;
        });

        //ここからパーツ設置
        xml += parts({ column: "CH", key: "main" }, function () {
          //構造化パーツ
          let xml = "";
          return xml;
        });

        xml += parts({ column: "AX", key: "main" }, function () {
          //TOP_SEOライティング
          let xml = "";
          xml += v("css_id", "");
          xml += v("css_class", "");
          xml += v("h_ttl", "About");
          xml += v(
            "h_ttl2",
            ss_ws_top.getRange(top_writing_col + "10").getValue()
          );
          xml += v("h_ttl3", "");
          xml += richtext(
            "text",
            ss_ws_top.getRange(top_writing_col + "11").getValue()
          );
          xml += img("image", "top");
          xml += img("image2", "top");
          xml += v("position_vertical", "50");
          xml += v("href", "");
          xml += v("link_text", "");
          xml += v("target", "");
          xml += v("bg_display", "left");
          xml += v("bg_color", "none");
          return xml;
        });
        xml += parts({ column: "AY", key: "main" }, function () {
          //一覧_アーティクル
          let xml = "";
          xml += v("css_id", "");
          xml += v("css_class", "");
          xml += v("h_ttl", "Blog");
          xml += v(
            "h_ttl2",
            ss_ws_top.getRange(top_writing_col + "12").getValue()
          );
          xml += v("h_ttl3", "");
          xml += richtext(
            "text",
            ss_ws_top.getRange(top_writing_col + "13").getValue()
          );
          xml += v("href", "/blog/");
          xml += v("link_text", "ブログへ");
          xml += v("name", "Blog");
          xml += v("article_code", "blog");
          xml += v("count", "4");
          xml += v("order", "ds.public_begin_datetime DESC,ds.id DESC");
          return xml;
        });
        if (is_ai == "あり") {
          xml += parts({ column: "CB", key: "main" }, function () {
            //AIブログ
            let xml = "";
            xml += v("css_id", "");
            xml += v("css_class", "");
            xml += v("h_ttl", "Column");
            xml += v(
              "h_ttl2",
              ss_ws_top.getRange(top_writing_col + "14").getValue()
            );
            xml += v("h_ttl3", "");
            xml += richtext(
              "text",
              ss_ws_top.getRange(top_writing_col + "15").getValue()
            );
            xml += v("href", "/column/");
            xml += v("link_text", "コラムへ");
            xml += v("article_code", "aiblog");
            xml += v("column", "-w-column1");
            xml += v("count", "4");
            xml += v("order", "ds.public_begin_datetime DESC,ds.id DESC");
            xml += v("bg_color", "0");
            return xml;
          });
        }
        if (is_supported_kuchikomi == "あり") {
          xml += parts({ column: "CF", key: "main" }, function () {
            //AIブログ
            let xml = "";
            xml += v("css_id", "");
            xml += v("css_class", "");
            xml += v("h_ttl", "");
            xml += v("h_ttl2", "");
            xml += richtext("text", "");
            xml += v("href", "/voice/");
            xml += v("link_text", "お客様の声へ");
            xml += v("number", "");
            xml += v("location", "");

            return xml;
          });
        }
        if (shop_count == 1) {
          //単一店舗
          xml += parts({ column: "BB", key: "main" }, function () {
            //アクセス1
            let xml = "";
            xml += v("css_id", "");
            xml += v("css_class", "");
            xml += v(
              "en_ttl",
              links_fixed[0][1].charAt(0).toUpperCase() +
                links_fixed[0][1].slice(1)
            );
            xml += v(
              "h2_ttl",
              ss_ws_top.getRange(top_writing_col + "16").getValue()
            );
            xml += richtext("text", "");
            xml += v("href", "/" + links_fixed[0][1] + "/");
            xml += v("href_text", links_fixed[0][0] + "へ");
            xml += v("order", "ds.public_begin_datetime DESC,ds.id DESC");
            xml += v("article_display", "all");
            xml += v("article", "{map:shop_0}"); //id未定
            return xml;
          });
        } else {
          //複数店舗
          xml += parts({ column: "BX", key: "main" }, function () {
            //アクセス2
            let xml = "";
            xml += v(
              "h_ttl",
              links_fixed[0][1].charAt(0).toUpperCase() +
                links_fixed[0][1].slice(1)
            );
            xml += v(
              "h_ttl2",
              ss_ws_top.getRange(top_writing_col + "16").getValue()
            );
            xml += richtext(
              "text",
              ss_ws_top.getRange(top_writing_col + "17").getValue()
            );
            xml += v("count", 2);
            xml += v("order", "ds.public_begin_datetime DESC,ds.id DESC");
            xml += v("article_code", "company_access");
            xml += v("article_display", "all");
            xml += v("article", "{map:shop_0}"); //id未定
            return xml;
          });
        }
        xml += parts({ column: "BA", key: "main" }, function () {
          //共通背景画像
          let xml = "";
          return xml;
        });

        /*************************
         *
         * TOP可変コンテンツ（固定ページ対応用）
         *
         ************************/
        const parts_from_name = {
          コンセプト: function (title, text) {
            return parts({ column: "CL", key: "main" }, function () {
              let xml = "";
              xml += v("css_id", "");
              xml += v("css_class", "");
              xml += v("h_ttl", "Concept");
              xml += v("h_ttl2", title);
              xml += v("h_ttl3", "");
              xml += v("text", text);
              xml += img("image", "top");
              xml += img("image2", "top");
              return xml;
            });
          },
          Concept: function (title, text) {
            return parts({ column: "CL", key: "main" }, function () {
              let xml = "";
              xml += v("css_id", "");
              xml += v("css_class", "");
              xml += v("h_ttl", "Concept");
              xml += v("h_ttl2", title);
              xml += v("h_ttl3", "");
              xml += v("text", text);
              xml += img("image", "top");
              xml += img("image2", "top");
              return xml;
            });
          },
          ギャラリー: function (title, text) {
            return parts({ column: "BH", key: "main" }, function () {
              let xml = "";
              xml += v("css_id", "");
              xml += v("css_class", "");
              xml += v("h_ttl", "Gallery");
              xml += v("h_ttl2", title);
              xml += v("h_ttl3", "");
              xml += v("text", text);
              xml += v("href", "/gallery/");
              xml += v("link_text", "ギャラリーへ");
              xml += v("article_code", "gallery");
              xml += v("order", "ds.public_begin_datetime DESC,ds.id DESC");
              xml += img("image", "top");
              return xml;
            });
          },
          Gallery: function (title, text) {
            return parts({ column: "BH", key: "main" }, function () {
              let xml = "";
              xml += v("css_id", "");
              xml += v("css_class", "");
              xml += v("h_ttl", "Gallery");
              xml += v("h_ttl2", title);
              xml += v("h_ttl3", "");
              xml += v("text", text);
              xml += v("href", "/gallery/");
              xml += v("link_text", "ギャラリーへ");
              xml += v("article_code", "gallery");
              xml += v("order", "ds.public_begin_datetime DESC,ds.id DESC");
              xml += img("image", "top");
              return xml;
            });
          },
          施工事例: function (title, text) {
            return parts({ column: "BI", key: "main" }, function () {
              let xml = "";
              xml += v("css_id", "");
              xml += v("css_class", "");
              xml += v("h_ttl", "Case");
              xml += v("h_ttl2", title);
              xml += v("h_ttl3", "");
              xml += v("text", text);
              xml += v("href", "/case/");
              xml += v("link_text", "施工事例へ");
              xml += v("tag_id", "1780");
              xml += v("article_id", "gallery2");
              xml += v("order", "ds.public_begin_datetime DESC,ds.id DESC");
              xml += img("image", "top");
              return xml;
            });
          },
          // , 'リフォーム': function (title, text) {
          //   return parts({ column: 'BK', key: 'main' }, function () {
          //     let xml = '';
          //     xml += v('css_id', '');
          //     xml += v('css_class', '');
          //     xml += v('h_ttl', 'Reform');
          //     xml += v('h_ttl2', title);
          //     xml += v('h_ttl3', '');
          //     xml += v('text', text);
          //     xml += v('href', '/reform/');
          //     xml += v('link_text', 'リフォームへ');
          //     xml += v('count', '12');
          //     xml += v('tag_id', '1780');
          //     xml += v('article_id', 'gallery4');
          //     xml += v('order', 'ds.public_begin_datetime DESC,ds.id DESC');
          //     xml += img('image', 'top')
          //     return xml;
          //   });
          // }
          // , 'デザイン事例': function (title, text) {
          //   return parts({ column: 'BJ', key: 'main' }, function () {
          //     let xml = '';
          //     xml += v('css_id', '');
          //     xml += v('css_class', '');
          //     xml += v('h_ttl', 'Design');
          //     xml += v('h_ttl2', title);
          //     xml += v('h_ttl3', '');
          //     xml += v('href', '/dsign/');
          //     xml += v('link_text', 'デザイン事例へ');
          //     xml += v('text', text);
          //     xml += v('article_id', 'gallery3');
          //     xml += img('image', 'top')
          //     return xml;
          //   });
          // }
          // , '不動産売却': function (title, text) {
          //   return parts({ column: 'BL', key: 'main' }, function () {
          //     let xml = '';
          //     xml += v('css_id', '');
          //     xml += v('css_class', '');
          //     xml += v('h_ttl', 'Estimate');
          //     xml += v('h_ttl2', title);
          //     xml += v('h_ttl3', '');
          //     xml += v('href', '/estimate/');
          //     xml += v('link_text', 'ギャラリーへ');
          //     xml += v('text', text);
          //     xml += img('image', 'top')
          //     return xml;
          //   });
          // }
          // , '不動産': function (title, text) {
          //   return parts({ column: 'BL', key: 'main' }, function () {
          //     let xml = '';
          //     xml += v('css_id', '');
          //     xml += v('css_class', '');
          //     xml += v('h_ttl', 'Estimate');
          //     xml += v('h_ttl2', title);
          //     xml += v('h_ttl3', '');
          //     xml += v('href', '/estimate/');
          //     xml += v('link_text', 'ギャラリーへ');
          //     xml += v('text', text);
          //     xml += img('image', 'top')
          //     return xml;
          //   });
          // }
          代表あいさつ: function (title, text) {
            return parts({ column: "BO", key: "main" }, function () {
              let xml = "";
              xml += v("css_id", "");
              xml += v("css_class", "");
              xml += v("h_ttl", "Greeting");
              xml += v("h_ttl2", title);
              xml += v("h_ttl3", "");
              xml += v("text", text);
              xml += v("href", "/greeting/");
              xml += v("link_text", "代表あいさつへ");
              xml += v("article_select", "staff");
              xml += v("order", "ds.id ASC");
              return xml;
            });
          },
          スタッフ: function (title, text) {
            return parts({ column: "BP", key: "main" }, function () {
              let xml = "";
              xml += v("css_id", "");
              xml += v("css_class", "");
              xml += v("h_ttl", "Staff");
              xml += v("h_ttl2", title);
              xml += v("h_ttl3", "");
              xml += v("text", text);
              xml += v("href", "/staff/");
              xml += v("link_text", "スタッフへ");
              xml += v("count", "3");
              xml += v("article_select", "staff");
              xml += v("order", "ds.id ASC");
              return xml;
            });
          },
          スタッフ紹介: function (title, text) {
            return parts({ column: "BP", key: "main" }, function () {
              let xml = "";
              xml += v("css_id", "");
              xml += v("css_class", "");
              xml += v("h_ttl", "Staff");
              xml += v("h_ttl2", title);
              xml += v("h_ttl3", "");
              xml += v("text", text);
              xml += v("href", "/staff/");
              xml += v("link_text", "スタッフへ");
              xml += v("count", "3");
              xml += v("article_select", "staff");
              xml += v("order", "ds.id ASC");
              return xml;
            });
          },
          Staff: function (title, text) {
            return parts({ column: "BP", key: "main" }, function () {
              let xml = "";
              xml += v("css_id", "");
              xml += v("css_class", "");
              xml += v("h_ttl", "Staff");
              xml += v("h_ttl2", title);
              xml += v("h_ttl3", "");
              xml += v("text", text);
              xml += v("href", "/staff/");
              xml += v("link_text", "スタッフへ");
              xml += v("count", "3");
              xml += v("article_select", "staff");
              xml += v("order", "ds.id ASC");
              return xml;
            });
          },
          フロー: function (title, text) {
            return parts({ column: "CJ", key: "main" }, function () {
              let xml = "";
              xml += v("ttl_en", "Flow");
              xml += v("h2_ttl", title);
              xml += v("h3_ttl", "");
              xml += richtext("text", text);
              xml += v("css_id", "");
              xml += v("css_class", "");
              return xml;
            });
          },
          施術の流れ: function (title, text) {
            return parts({ column: "CJ", key: "main" }, function () {
              let xml = "";
              xml += v("ttl_en", "Flow");
              xml += v("h2_ttl", title);
              xml += v("h3_ttl", "");
              xml += richtext("text", text);
              xml += v("css_id", "");
              xml += v("css_class", "");
              return xml;
            });
          },
          "依頼、相談の流れ": function (title, text) {
            return parts({ column: "CJ", key: "main" }, function () {
              let xml = "";
              xml += v("ttl_en", "Flow");
              xml += v("h2_ttl", title);
              xml += v("h3_ttl", "");
              xml += richtext("text", text);
              xml += v("css_id", "");
              xml += v("css_class", "");
              return xml;
            });
          },
          Flow: function (title, text) {
            return parts({ column: "CJ", key: "main" }, function () {
              let xml = "";
              xml += v("ttl_en", "Flow");
              xml += v("h2_ttl", title);
              xml += v("h3_ttl", "");
              xml += richtext("text", text);
              xml += v("css_id", "");
              xml += v("css_class", "");
              return xml;
            });
          },
          よくある質問: function (title, text) {
            return parts({ column: "BC", key: "main" }, function () {
              let xml = "";
              xml += v("css_id", "");
              xml += v("css_class", "");
              xml += v("h_ttl", "Q&A");
              xml += v("h_ttl2", title);
              xml += v("h_ttl3", "");
              xml += v("text", text);
              xml += v("href", "/faq/");
              xml += v("link_text", "よくある質問へ");
              xml += v("count", "5");
              xml += v("order", "ds.priority ASC,ds.id ASC");
              return xml;
            });
          },
          "Q&A": function (title, text) {
            return parts({ column: "BC", key: "main" }, function () {
              let xml = "";
              xml += v("css_id", "");
              xml += v("css_class", "");
              xml += v("h_ttl", "Q&A");
              xml += v("h_ttl2", title);
              xml += v("h_ttl3", "");
              xml += v("text", text);
              xml += v("href", "/faq/");
              xml += v("link_text", "よくある質問へ");
              xml += v("count", "5");
              xml += v("order", "ds.priority ASC,ds.id ASC");
              return xml;
            });
          },
          新着情報: function (title, text) {
            return parts({ column: "AY", key: "main" }, function () {
              let xml = "";
              xml += v("css_id", "");
              xml += v("css_class", "");
              xml += v("h_ttl", "News");
              xml += v("h_ttl2", title);
              xml += v("h_ttl3", "");
              xml += v("text", text);
              xml += img("image", "top");
              xml += v("href", "/news/");
              xml += v("link_text", "新着情報へ");
              xml += v("count", "20");
              xml += v("article_code", "news");
              xml += v("order", "ds.public_begin_datetime DESC,ds.id DESC");
              xml += '<child key="label">';
              xml += fieldset("cms", "label", function () {
                let xml = "";
                xml += v("name", "NEWS");
                xml += v("directory_code", "news");
                return xml;
              });
              xml += "</child>";
              return xml;
            });
          },
          News: function (title, text) {
            return parts({ column: "AY", key: "main" }, function () {
              let xml = "";
              xml += v("css_id", "");
              xml += v("css_class", "");
              xml += v("h_ttl", "News");
              xml += v("h_ttl2", title);
              xml += v("h_ttl3", "");
              xml += v("text", text);
              xml += img("image", "top");
              xml += v("href", "/news/");
              xml += v("link_text", "新着情報へ");
              xml += v("count", "20");
              xml += v("article_code", "news");
              xml += v("order", "ds.public_begin_datetime DESC,ds.id DESC");
              xml += '<child key="label">';
              xml += fieldset("cms", "label", function () {
                let xml = "";
                xml += v("name", "NEWS");
                xml += v("directory_code", "news");
                return xml;
              });
              xml += "</child>";
              return xml;
            });
          },
          メニュー: function (title, text) {
            return parts({ column: "BF", key: "main" }, function () {
              let xml = "";

              xml += v("css_id", "");
              xml += v("css_class", "");
              xml += v("h_ttl", "Menu");
              xml += v("h_ttl2", title);
              xml += v("h_ttl3", "");
              xml += v("text", text);
              xml += img("bg_image", "");
              xml += v("order", "ds.public_begin_datetime DESC,ds.id DESC");
              xml += '<child key="contents">';
              xml += fieldset("cms", "contents", function () {
                let xml = "";
                xml += v("text", "");
                xml += v("count", "4");
                xml += v("article_code", "menu");
                xml += v("href", "/menu/");
                xml += v("link_text", "メニューへ");
                xml += v("article_code", "menu");
                xml += v("tag_group", "menu_tag");
                xml += v("tag_select", "メニュー1");
                return xml;
              });
              xml += "</child>";

              return xml;
            });
          },
          商品紹介: function (title, text) {
            return parts({ column: "BF", key: "main" }, function () {
              let xml = "";

              xml += v("css_id", "");
              xml += v("css_class", "");
              xml += v("h_ttl", "Introduction");
              xml += v("h_ttl2", title);
              xml += v("h_ttl3", "");
              xml += v("text", text);
              xml += img("bg_image", "");
              xml += v("order", "ds.public_begin_datetime DESC,ds.id DESC");
              xml += '<child key="contents">';
              xml += fieldset("cms", "contents", function () {
                let xml = "";
                xml += v("href", "/introduction/");
                xml += v("link_text", "商品紹介へ");
                xml += v("article_code", "menu");
                xml += v("tag_group", "menu_tag");
                xml += v("tag_select", "メニュー1");
                return xml;
              });
              xml += "</child>";

              return xml;
            });
          },
          Menu: function (title, text) {
            return parts({ column: "BF", key: "main" }, function () {
              let xml = "";

              xml += v("css_id", "");
              xml += v("css_class", "");
              xml += v("h_ttl", "Menu");
              xml += v("h_ttl2", title);
              xml += v("h_ttl3", "");
              xml += v("text", text);
              xml += img("bg_image", "");
              xml += v("order", "ds.public_begin_datetime DESC,ds.id DESC");
              xml += '<child key="contents">';
              xml += fieldset("cms", "contents", function () {
                let xml = "";
                xml += v("text", "");
                xml += v("count", "4");
                xml += v("article_code", "menu");
                xml += v("href", "/menu/");
                xml += v("link_text", "メニューへ");
                xml += v("article_code", "menu");
                xml += v("tag_group", "menu_tag");
                xml += v("tag_select", "メニュー1");
                return xml;
              });
              xml += "</child>";

              return xml;
            });
          },
          サービス: function (title, text) {
            return parts({ column: "U", key: "main" }, function () {
              let xml = "";
              xml += v("ttl_en", "Service");
              xml += v("h2_ttl", title);
              xml += v("h3_ttl", "");
              xml += richtext("text", text);
              xml += v("css_id", "");
              xml += v("css_class", "");
              return xml;
            });
          },
          サービス一覧: function (title, text) {
            return parts({ column: "U", key: "main" }, function () {
              let xml = "";
              xml += v("ttl_en", "Service");
              xml += v("h2_ttl", title);
              xml += v("h3_ttl", "");
              xml += richtext("text", text);
              xml += v("css_id", "");
              xml += v("css_class", "");
              return xml;
            });
          },
          Service: function (title, text) {
            return parts({ column: "U", key: "main" }, function () {
              let xml = "";
              xml += v("ttl_en", "Service");
              xml += v("h2_ttl", title);
              xml += v("h3_ttl", "");
              xml += richtext("text", text);
              xml += v("css_id", "");
              xml += v("css_class", "");
              return xml;
            });
          },
          商品説明ページ: function (title, text) {
            return parts({ column: "U", key: "main" }, function () {
              let xml = "";
              xml += v("ttl_en", "Service");
              xml += v("h2_ttl", title);
              xml += v("h3_ttl", "");
              xml += richtext("text", text);
              xml += v("css_id", "");
              xml += v("css_class", "");
              return xml;
            });
          },
          お客様の声: function (title, text) {
            return parts({ column: "BN", key: "main" }, function () {
              let xml = "";
              xml += v("css_id", "");
              xml += v("css_class", "");
              xml += v("h_ttl", "Voice");
              xml += v("h_ttl2", title);
              xml += v("h_ttl3", "");
              xml += v("text", text);
              xml += v("href", "/voice/");
              xml += v("link_text", "お客様の声へ");
              xml += v("count", "4");
              xml += v("order", "ds.public_begin_datetime DESC,ds.id DESC");
              xml += img("bg_image", "");
              return xml;
            });
          },
          新着情報: function (title, text) {
            return parts({ column: "AY", key: "main" }, function () {
              let xml = "";
              xml += v("css_id", "");
              xml += v("css_class", "");
              xml += v("h_ttl", "News");
              xml += v("h_ttl2", title);
              xml += v("h_ttl3", "");
              xml += v("text", text);
              xml += img("image", "top");
              xml += v("href", "/news/");
              xml += v("link_text", "新着情報へ");
              xml += v("count", "20");
              xml += v("article_code", "news");
              xml += v("order", "ds.public_begin_datetime DESC,ds.id DESC");
              xml += '<child key="label">';
              xml += fieldset("cms", "label", function () {
                let xml = "";
                xml += v("name", "NEWS");
                xml += v("directory_code", "news");
                return xml;
              });
              xml += "</child>";
              return xml;
            });
          },
          News: function (title, text) {
            return parts({ column: "AY", key: "main" }, function () {
              let xml = "";
              xml += v("css_id", "");
              xml += v("css_class", "");
              xml += v("h_ttl", "News");
              xml += v("h_ttl2", title);
              xml += v("h_ttl3", "");
              xml += v("text", text);
              xml += img("image", "top");
              xml += v("href", "/news/");
              xml += v("link_text", "新着情報へ");
              xml += v("count", "20");
              xml += v("article_code", "news");
              xml += v("order", "ds.public_begin_datetime DESC,ds.id DESC");
              xml += '<child key="label">';
              xml += fieldset("cms", "label", function () {
                let xml = "";
                xml += v("name", "NEWS");
                xml += v("directory_code", "news");
                return xml;
              });
              xml += "</child>";
              return xml;
            });
          },
          採用情報: function (title, text) {
            return parts({ column: "U", key: "main" }, function () {
              let xml = "";
              xml += v("ttl_en", "Recruit");
              xml += v("h2_ttl", title);
              xml += v("h3_ttl", "");
              xml += richtext("text", text);
              xml += v("css_id", "");
              xml += v("css_class", "");
              return xml;
            });
          },
          その他: function (title, text) {
            return parts({ column: "U", key: "main" }, function () {
              let xml = "";
              xml += v("ttl_en", "");
              xml += v("h2_ttl", title);
              xml += v("h3_ttl", "");
              xml += richtext("text", text);
              xml += v("css_id", "");
              xml += v("css_class", "");
              return xml;
            });
          },
        };
        for (i = 20; i <= 170; i += 2) {
          const name = ss_ws_top.getRange("C" + i).getValue();
          if (name.length < 1) {
            continue;
          } else if (parts_from_name[name] == undefined) {
            //ない場合はとりあえず見出し＋本文で設置
            xml += parts_from_name["その他"](
              ss_ws_top.getRange(top_writing_col + i).getValue(),
              ss_ws_top.getRange(top_writing_col + (i + 1)).getValue()
            );
          } else {
            xml += parts_from_name[name](
              ss_ws_top.getRange(top_writing_col + i).getValue(),
              ss_ws_top.getRange(top_writing_col + (i + 1)).getValue()
            );
          }
        }

        //2連バナー
        xml += parts({ column: "AZ", key: "main" }, function () {
          let xml = "";
          xml += v("css_id", "");
          xml += v("css_class", "");
          xml += v("h_ttl", "");
          xml += v("h_ttl2", "");
          xml += v("h_ttl3", "");
          xml += '<child key="contents">';
          xml += fieldset("cms", "contents", function () {
            let xml = "";
            xml += v("sub_ttl", "2連バナー_smart");
            xml += v("h_ttl4", "2連バナー_見出し");
            //xml += img("image", "top");
            xml += richtext(
              "text",
              "サンプルテキストサンプルテキストサンプルテキストサンプルテキストサンプルテキストサンプルテキストサンプルテキストサンプルテキストサンプルテキストサンプルテキストサンプルテキストサンプルテキストサンプルテキスト"
            );
            xml += img("image", "top");
            xml += v("href", "#");
            return xml;
          });
          xml += fieldset("cms", "contents", function () {
            let xml = "";
            xml += v("sub_ttl", "2連バナー_smart");
            xml += v("h_ttl4", "2連バナー_見出し");
            //xml += img("image", "top");
            xml += richtext(
              "text",
              "サンプルテキストサンプルテキストサンプルテキストサンプルテキストサンプルテキストサンプルテキストサンプルテキストサンプルテキストサンプルテキストサンプルテキストサンプルテキストサンプルテキストサンプルテキスト"
            );
            xml += img("image", "top");
            xml += v("href", "#");
            return xml;
          });
          xml += "</child>";
          return xml;
        });

        /*  
      メニュー (ランチメニュー)
      メニュー (コースメニュー)
      メニュー (フード)
      メニュー (ドリンク)
      メニュー (店内メニュー)
      メニュー (テイクアウト)
      */

        //複数店舗バナー
        xml += parts({ column: "BX", key: "main" }, function () {
          let xml = "";
          xml += v("css_id", "");
          xml += v("css_class", "");
          xml += v("h_ttl", "Access");
          xml += v("h_ttl2", "TOP・アクセスのH2見出し");
          xml += v("h_ttl3", "");
          xml += v(
            "text",
            "サンプルテキストサンプルテキストサンプルテキストサンプルテキストサンプルテキストサンプルテキストサンプルテキストサンプルテキストサンプルテキストサンプルテキストサンプルテキストサンプルテキストサンプルテキスト"
          );
          xml += v("href", "/faq/");
          xml += v("link_text", "よくある質問へ");
          xml += v("article_code", "company_access");
          xml += v("count", "2");
          xml += v("order", "ds.priority ASC,ds.id ASC");
          return xml;
        });

        //TOP_SEOクッション
        xml += parts({ column: "CK", key: "main" }, function () {
          let xml = "";
          xml += v("css_id", "");
          xml += v("css_class", "");
          xml += v("h_ttl", "Feature");
          xml += v("h_ttl2", feature_pagename);
          xml += '<child key="contents">';
          xml += fieldset("cms", "contents", function () {
            let xml = "";
            xml += img("image", "top");
            xml += v(
              "image_alt",
              ss_ws_top.getRange(top_writing_col + "18").getValue()
            );
            xml += v("bg_size", "cover");
            xml += v(
              "h3_ttl",
              ss_ws_top.getRange(top_writing_col + "18").getValue()
            );
            xml += richtext(
              "text",
              ss_ws_top.getRange(top_writing_col + "19").getValue()
            );
            xml += v("href", "/feature/");
            xml += v("href_text", feature_pagename + "へ");
            xml += v("fade", "0");
            xml += v("css_class", "0");
            xml += v("target", "");
            return xml;
          });
          xml += "</child>";
          return xml;
        });

        //共通_インスタ(6枚表示)
        xml += parts({ column: "CA", key: "main" }, function () {
          let xml = "";
          xml += v("h_ttl", "");
          xml += v("h_ttl2", "");
          xml += v("h_ttl3", "");
          xml += v("h_ttl4", "");
          xml += v("bg_color", "1");
          xml += v("more_btn", "さらに読み込む");
          xml += v("follow", "Instagramでフォロー");
          xml += v("insta_url", "");
          return xml;
        });
        return xml;
      }
    );
    return xml;
  })();

  /* smart 背景固定コンテンツ */
  /*   if ((get_sheet('makexml').getRange('E15').getValue()) == 'smart') {
      xml += parts({ column: 'BY', key: '', parent: ['25.layout.layout'] }, function () {
        let xml = '';
  
      });
    } */

  //サイト管理者情報
  xml +=
    "<type>\n\
  <datastore>sys</datastore>\n\
  <class>sys/manager</class>\n\
  <key></key>\n\
  <id>9</id>\n" +
    "  " +
    v("site_name", store) +
    "  " +
    img("logo", "logo") +
    "  " +
    v("company", company) +
    "  " +
    v("address", address) +
    "  " +
    v("tel", tel[0] + "-" + tel[1] + "-" + tel[2]) +
    "  " +
    v("tel_time", hours[0] + "〜" + hours[1]) +
    "  " +
    v("email_address", "info@" + domain) +
    "</type>";

  xml +=
    "<type>\n\
  <datastore>setting</datastore>\n\
  <class>mail_template</class>\n\
  <key></key>\n\
  <id>294</id>\n\
  <parent>270.setting</parent>" +
    v("response_enabled", "1") +
    v("response_from", "info@" + domain) +
    v("response_subject", "【" + store + "】お問い合わせありがとうございます") +
    v(
      "response_body_text",
      "この度は" +
        store +
        "にお問い合わせ頂きありがとうございます。\n\
内容確認の上、ご連絡を致しますので、今しばらくお待ちくださいませ。\n\
\n\
\n\
＝＝＝＝＝＝＝＝＝＝＝＝＝＝\n\
\n\
お名前\n\
[*@name*]\n\
\n\
フリガナ\n\
[*@kana*]\n\
\n\
電話番号\n\
[*@tel*]\n\
\n\
住所\n\
〒[*@address_zip1*]-[*@address_zip2*]\n\
[*@address_prefectures*]\n\
[*@address_city*]\n\
[*@address_address*]\n\
[*@address_address2*]\n\
\n\
E-mailアドレス\n\
[*@email*]\n\
\n\
お問い合わせ内容\n\
[*@body*]\n\
\n\
\n\
＝＝＝＝＝＝＝＝＝＝＝＝＝＝\n\
\n\
※本メールは自動返信メールです。\n\
※本メールに心あたりのない方は、恐れ入りますが【info@[*$_SERVER['SERVER_NAME']*]】までご連絡くださいませ。\n\
\n\
運営：" +
        company
    ) +
    v("response_body_html", "") +
    v("response_enabled", "1") +
    v("notify_from", "info@" + domain) +
    v("notify_to", "info@" + domain) +
    v("notify_subject", "ホームページからのお問い合わせ【" + store + "】") +
    v(
      "notify_body_text",
      "お客様より下記内容にてお問い合わせを頂戴しました。\n\
お客様メールアドレスへご返信、もしくはご連絡をお願いいたします。\n\
\n\
※お問い合わせの返信の際は、本メールの返信ボタンより\n\
送信してもお客様へ返信することができません。\n\
下記お客様記載のメールアドレス宛にご返信をいただきますよう\n\
よろしくお願いいたします。\n\
\n\
＝＝＝＝＝＝＝＝＝＝＝＝＝＝\n\
\n\
お名前\n\
[*@name*]\n\
\n\
フリガナ\n\
[*@kana*]\n\
\n\
電話番号\n\
[*@tel*]\n\
\n\
住所\n\
〒[*@address_zip1*]-[*@address_zip2*]\n\
[*@address_prefectures*]\n\
[*@address_city*]\n\
[*@address_address*]\n\
[*@address_address2*]\n\
\n\
E-mailアドレス\n\
[*@email*]\n\
\n\
お問い合わせ内容\n\
[*@body*]"
    ) +
    v("notify_body_html", "") +
    "\
</type>";

  xml +=
    "<type>\n\
  <datastore>setting</datastore>\n\
  <class>mail_template</class>\n\
  <key></key>\n\
  <id>1859</id>\n\
  <parent>1844.setting</parent>" +
    v("response_enabled", "1") +
    v("response_from", "info@" + domain) +
    v("response_subject", "【" + store + "】ご応募ありがとうございます") +
    v(
      "response_body_text",
      "この度は" +
        store +
        "にご応募頂きありがとうございます。\n\
内容確認の上、ご連絡を致しますので、今しばらくお待ちくださいませ。\n\
\n\
＝＝＝＝＝＝＝＝＝＝＝＝＝＝\n\
\n\
E-mailアドレス\n\
[*@email*]\n\
\n\
氏名\n\
[*@name*]\n\
\n\
フリガナ\n\
[*@kana*]\n\
\n\
生年月日\n\
[*@birthday*]\n\
\n\
性別\n\
[*sel_text(@sex,@sex_etc)*]\n\
\n\
住所\n\
〒[*@address_zip1*]-[*@address_zip2*]\n\
[*@address_prefectures*][*@address_city*][*@address_address*][*@address_address2*]\n\
\n\
連絡先電話番号\n\
[*@tel*]\n\
\n\
最終学歴\n\
[*@final_education*]\n\
\n\
現収入\n\
[*@current_income*]\n\
\n\
転職回数\n\
[*@number*]\n\
\n\
\n\
＝＝＝＝＝＝＝＝＝＝＝＝＝＝\n\
\n\
※本メールは自動返信メールです。\n\
※本メールに心あたりのない方は、恐れ入りますが【info@[*$_SERVER['SERVER_NAME']*]】までご連絡くださいませ。\n\
\n\
運営：" +
        company
    ) +
    v("response_body_html", "") +
    v("response_enabled", "1") +
    v("notify_from", "info@" + domain) +
    v("notify_to", "info@" + domain) +
    v("notify_subject", "ホームページからの採用ご応募【" + store + "】") +
    v(
      "notify_body_text",
      "お客様より下記内容にて採用ご応募を頂戴しました。\n\
お客様メールアドレスへご返信、もしくはご連絡をお願いいたします。\n\
\n\
※採用ご応募の返信の際は、本メールの返信ボタンより\n\
送信してもお客様へ返信することができません。\n\
下記お客様記載のメールアドレス宛にご返信をいただきますよう\n\
よろしくお願いいたします。\n\
＝＝＝＝＝＝＝＝＝＝＝＝＝＝\n\
\n\
E-mailアドレス\n\
[*@email*]\n\
\n\
氏名\n\
[*@name*] \n\
\n\
フリガナ\n\
[*@kana*]\n\
\n\
生年月日\n\
[*@birthday*]\n\
\n\
性別\n\
[*sel_text(@sex,@sex_etc)*]\n\
\n\
住所\n\
〒[*@address_zip1*]-[*@address_zip2*]\n\
[*@address_prefectures*][*@address_city*][*@address_address*][*@address_address2*]\n\
\n\
連絡先電話番号\n\
[*@tel*]\n\
\n\
最終学歴\n\
[*@final_education*]\n\
\n\
現収入\n\
[*@current_income*]\n\
\n\
転職回数\n\
[*@number*]\n\
\n\
＝＝＝＝＝＝＝＝＝＝＝＝＝＝"
    ) +
    v("notify_body_html", "") +
    "\
</type>";

  let kiyaku_contents =
    "<p>" +
    company +
    "（以下「当" +
    unit +
    "」）は、以下のとおり個人情報保護方針を定め、個人情報保護の仕組みを構築し、全従業員に個人情報保護の重要性の認識と取組みを徹底させることにより、個人情報の保護を推進致します。</p>\n\
<p>&nbsp;</p>\n\
<p><strong>個人情報の管理</strong></p>\n\
<p>当" +
    unit +
    "は、お客さまの個人情報を正確かつ最新の状態に保ち、個人情報への不正アクセス・紛失・破損・改ざん・漏洩などを防止するため、セキュリティシステムの維持・管理体制の整備・従業員教育の徹底等の必要な措置を講じ、安全対策を実施し個人情報の厳重な管理を行ないます。</p>\n\
<p>&nbsp;</p>\n\
<p><strong>個人情報の利用目的</strong></p>\n\
<p>お客さまからお預かりした個人情報は、当" +
    unit +
    "からのご連絡や業務のご案内やご質問に対する回答として、電子メールや資料のご送付に利用いたします。</p>\n\
<p>&nbsp;</p>\n\
<p><strong>個人情報の第三者への開示・提供の禁止</strong></p>\n\
<p>当" +
    unit +
    "は、お客さまよりお預かりした個人情報を適切に管理し、次のいずれかに該当する場合を除き、個人情報を第三者に開示いたしません。</p>\n\
<p>&nbsp;</p>\n\
<p>&nbsp;</p>\n\
<p><strong>＜お客さまの同意がある場合＞</strong></p>\n\
<p>お客さまが希望されるサービスを行なうために当" +
    unit +
    "が業務を委託する業者に対して開示する場合。</p>\n\
<p>&nbsp;</p>\n\
<p><strong>＜法令に基づき開示することが必要である場合＞</strong></p>\n\
<p><strong>個人情報の安全対策</strong></p>\n\
<p>当" +
    unit +
    "は、個人情報の正確性及び安全性確保のために、セキュリティに万全の対策を講じています。</p>\n\
<p>&nbsp;</p>\n\
<p><strong>ご本人の照会</strong></p>\n\
<p>お客さまがご本人の個人情報の照会・修正・削除などをご希望される場合には、ご本人であることを確認の上、対応させていただきます。</p>\n\
<p>&nbsp;</p>\n\
<p><strong>法令、規範の遵守と見直し</strong></p>\n\
<p>当" +
    unit +
    "は、保有する個人情報に関して適用される日本の法令、その他規範を遵守するとともに、本ポリシーの内容を適宜見直し、その改善に努めます。</p>\n\
<p>&nbsp;</p>\n\
<p><strong>お問い合わせ</strong></p>\n\
<p>当" +
    unit +
    "の個人情報の取扱に関するお問い合わせは下記までご連絡ください。</p>\n\
<p>&nbsp;</p>\n\
<p>" +
    ss_csv.getRange("D2").getValue() +
    "</p>\n\
<p>代表者：" +
    ss_csv.getRange("I2").getValue() +
    "</p>\n\
<p>〒" +
    ss_csv.getRange("E2").getValue() +
    "</p>\n\
<p>" +
    ss_csv.getRange("F2").getValue() +
    "</p>\n\
<p>電話番号：" +
    ss_csv.getRange("G2").getValue() +
    "</p>";

  if (fax[0].length > 0) {
    kiyaku_contents +=
      "\n<p>FAX番号：" + ss_csv.getRange("H2").getValue() + "</p>";
  }

  xml +=
    "<type>\n\
  <datastore>rules</datastore>\n\
  <class>rules/detail</class>\n\
  <key></key>\n\
  <id>9</id>\n\
  <parent>6.rules</parent>\n\
  " +
    v("memo", "") +
    v("body", kiyaku_contents) +
    "</type>";

  const password = ss_makexml.getRange("E10").getValue();
  xml += set_admin(
    password,
    tel[0].trim() + tel[1].trim() + tel[2].trim(),
    domain
  );

  xml += article_aiblog();

  console.log("a");

  createFile(xml, 1);

  console.log("b");
}

function pushButton() {
  //XML作成ボタンを押した時の挙動
  const html = HtmlService.createTemplateFromFile("dialog").evaluate();
  SpreadsheetApp.getUi().showModalDialog(html, "ファイルダウンロード");
}

function reload_cells() {
  const target_sheets = [
    "makexml",
    "csv",
    "ライティングシート (固定)",
    "ライティングシート (可変)",
    "ライティングシート (TOP)",
    "店舗情報",
    "基本情報",
    "ヒアリングシート",
    "分割",
    "ページ構成",
  ];

  target_sheets.forEach(function (element) {
    //セルを更新（範囲の中で関数の=を=で置換する）
    const sheet = get_sheet(element);

    sheet
      .getDataRange()
      .createTextFinder("=")
      .matchFormulaText(true)
      .replaceAllWith("=");
  });
}

function CheckSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  const ss_makexml = get_sheet("makexml");
  const siteset_pattern = ss_makexml.getRange("E15").getValue(); //通常案件か、採用案件か
  const ss_page = get_sheet("ページ構成");
  const ss_tempo = get_sheet("店舗情報");
  const ss_basic = spreadsheet.getSheetByName("基本情報");
  const ss_hearing = spreadsheet.getSheetByName("ヒアリングシート");
  const is_ai = ss_makexml.getRange("E7").getValue();
  const is_voice = ss_makexml.getRange("K10").getValue();

  const ok_url = ss_makexml.getRange("E6").getValue();
  if (ok_url == "") {
    Browser.msgBox(
      "OKエクセルのURLを入力してください！（makexmlシートのE6セル）"
    );
    return;
  }

  if (is_ai == "") {
    Browser.msgBox("エラー！！  AIブログのありなしを選択してください！");
    return;
  }

  if (siteset_pattern == "") {
    Browser.msgBox("エラー！！  サイトセットパターンを選択してください！");
    return;
  }

  const ss_ok = SpreadsheetApp.openByUrl(ok_url);

  if (
    ss_ok
      .getSheetByName("ヒアリングシート")
      .getRange("B44")
      .getValue()
      .trim() != "AIブログ"
  ) {
    Browser.msgBox(
      "AIブログ非対応のエクセルです！XMLツールver2を使ってください！"
    );
    return;
  }

  const must_sheets = [
    "CSV",
    "ライティングシート (固定)",
    "ライティングシート (可変)",
    "ライティングシート (TOP)",
    "ページ構成",
    "店舗情報",
    "ヒアリングシート",
  ];

  let nf_sheets = [];

  must_sheets.forEach(function (i) {
    try {
      const vals = ss_ok.getSheetByName(i).getDataRange().getValues();
      const sht = get_sheet(i);
      sht.getRange(1, 1, vals.length, vals[0].length).setValues(vals);
    } catch (e) {
      nf_sheets.push(i);
    }
  });

  if (!check_writing_positions()) {
    return;
  }

  reload_cells();
  /*制御文字削除関数の呼び出し*/
  delete_control_characters();

  const fixed_word1 = ss_basic.getRange("C16:C20").getValues();
  const mapped_fixed_word1 = fixed_word1.map(function (element) {
    // '-'は空白に変換する
    const word = element == "-" ? "" : element;
    return [word];
  });
  const fixed_word2 = ss_basic.getRange("C21:C25").getValues();
  const mapped_fixed_word2 = fixed_word2.map(function (element) {
    const word = element == "-" ? "" : element;
    return [word];
  });

  ss_makexml.getRange("E21:E25").setValues(mapped_fixed_word1);
  ss_makexml.getRange("F21:F25").setValues(mapped_fixed_word2);

  replaceAllWith("ライティングシート (可変)", "[1]");

  /*ベースカラーの色が分かるように*/
  //fill_basecolor();

  /* 編集者権限付与 */
  assignSingleEditor(spreadsheet);
  setPageDatasToMakexmlsheet();

  if (nf_sheets.length > 0) {
    Browser.msgBox(nf_sheets + " がありません(´ཀ`");
  } else {
    Browser.msgBox("OKですヽ(・×・)/✧✧");
  }
}

function setPageDatasToMakexmlsheet() {
  //ページ構成シートのページ名、ページURLを並び替えてmakexmlシートに張り付けるだけの関数
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const ss_makexml = ss.getSheetByName("makexml");
  const siteset_pattern = ss_makexml.getRange("E15").getValue(); //通常案件か、採用案件か
  const ss_page = ss.getSheetByName("ページ構成");
  const ss_csv = ss.getSheetByName("CSV");

  let flex_range = "D15:G97";
  let fixed_range = "C4:F12";

  const flex_list = ss_page.getRange(flex_range).getValues();
  const fixed_list = ss_page.getRange(fixed_range).getValues();

  let mapped_flex_list = [];
  let mapped_fixed_list = [];

  flex_list.forEach(function (v) {
    //v[0] ページ名 v[1] ページタイプ v[2] 既存URL v[3] ディレクトリ
    const pagename = v[0];
    let url = "";

    if (v[2] != "" && v[3] == "必要") {
      //リニューアル
      url = v[2];
    } else if (v[2] == "") {
      //リニューアル以外
      url = v[3];
    }

    if (v[0] != "") {
      mapped_flex_list.push([pagename, url]);
    }
  });

  const fixedPriority = {
    アクセス: {
      priority: 1,
      change: false,
    },
    会社概要: {
      priority: 1,
      change: false,
    },
    複数店舗で構築: {
      priority: 1,
      change: true,
      changed: {
        name: "アクセス",
        url: "access",
      },
    },
    リクルート: {
      priority: 2,
      change: false,
    },
    口コミ: {
      priority: 3,
      change: false,
    },
    お客様の声: {
      priority: 3,
      change: false,
    },
    ブログ: {
      priority: 4,
      change: false,
    },
    コラム: {
      priority: 5,
      change: false,
    },
    口コミ: {
      priority: 6,
      change: false,
    },
    採用申込: {
      priority: 7,
      change: true,
      changed: {
        name: "エントリー",
        url: "recruit/entry",
      },
    },
    フォーム: {
      priority: 8,
      change: false,
    },
    プラポリ: {
      priority: 9,
      change: true,
      changed: {
        url: "privacypolicy",
      },
    },
    サイトマップ: {
      priority: 10,
      change: false,
    },
  };

  fixed_list.forEach(function (v) {
    //v[0] ページ名 v[1] ページタイプ v[2] URL
    let display_setting = v[0],
      pagename = v[1],
      pagetype = v[2],
      url = v[3];

    if (pagetype.indexOf("アクセス") > -1) {
      pagetype = "アクセス";
    }

    if (fixedPriority[pagetype] && fixedPriority[pagetype].change) {
      if (fixedPriority[pagetype].changed.name) {
        pagename = fixedPriority[pagetype].changed.name;
      }
      url = fixedPriority[pagetype].changed.url;
    }

    if (
      display_setting.trim() != "非表示" &&
      pagename != "-" &&
      pagename != ""
    ) {
      mapped_fixed_list.push([pagename, url, pagetype]);
    }
  });

  //fixedPriorityにデータがないものはpriority 0に、それ以外はfixedPriorityのpriorityの順番にソート
  mapped_fixed_list.sort((a, b) => {
    let priorityA =
      fixedPriority[a[2]] == undefined ? 0 : fixedPriority[a[2]].priority;
    let priorityB =
      fixedPriority[b[2]] == undefined ? 0 : fixedPriority[b[2]].priority;

    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    } else {
      return (
        fixed_list.map((item) => item[0]).indexOf(a[0]) -
        fixed_list.map((item) => item[0]).indexOf(b[0])
      );
    }
  });

  const result = [];

  mapped_fixed_list.forEach(function (v) {
    result.push([v[0], v[1]]);
  });

  ss_makexml
    .getRange(29, 5, mapped_flex_list.length, 2)
    .setValues(mapped_flex_list);
  ss_makexml.getRange(44, 5, result.length, 2).setValues(result);
}

/*カラーコードを取得し、セルを塗りつぶす処理*/
function fill_basecolor() {
  const ss_make = get_sheet("makexml");
  const basecolor = ss_make.getRange("E12").getValue();
  ss_make.getRange("B18").setBackground(basecolor);
}

function set_dropdown() {
  const ss_ws_flex = get_sheet("ライティングシート (可変)");
  const ss_makexml = get_sheet("makexml");

  const sitesetPattern = ss_makexml.getRange("E15").getValue();

  const drop1 = {
    コンセプト: {
      //ページタイプ
      basic_pagename: "コンセプト", //イレギュラーじゃないページ名
      basic_url: "concept", //イレギュラーじゃないURL
    },
    サービス: {
      basic_pagename: "サービス",
      basic_url: "service",
    },
    よくある質問: {
      basic_pagename: "よくある質問",
      basic_url: "faq",
    },
    "ギャラリー 詳細あり": {
      basic_pagename: "ギャラリー",
      basic_url: "gallery",
    },
    "ギャラリー 詳細なし": {
      basic_pagename: "ギャラリー",
      basic_url: "gallery",
    },
    "ギャラリー beforeAfter": {
      basic_pagename: "施工事例",
      basic_url: "constructed",
    },
    /* 'ギャラリー (施術事例：詳細ページ有)': {
      basic_pagename: '施術事例',
      basic_url: 'operated'
    },
    'ギャラリー (デザイン事例)': {
      basic_pagename: 'デザイン事例',
      basic_url: 'dsign'
    },
    'ギャラリー (リフォーム)': {
      basic_pagename: 'リフォーム',
      basic_url: 'case'
    },
    'ギャラリー (不動産系：詳細ページ有)': {
      basic_pagename: '不動産売却',
      basic_url: 'estate'
    },
    'ギャラリー (施工事例：詳細ページ有)': {
      basic_pagename: '施工事例',
      basic_url: 'constructed'
    },
    'ギャラリー (商品紹介)': {
      basic_pagename: '商品紹介',
      basic_url: 'introduction'
    }, */
    "スタッフ (代表挨拶・代表のみ)": {
      basic_pagename: "代表あいさつ",
      basic_url: "greeting",
    },
    "スタッフ (複数スタッフ)": {
      basic_pagename: "スタッフ",
      basic_url: "staff",
    },
    "メニュー (総合)": {
      basic_pagename: "メニュー",
      basic_url: "menu",
    },
    "フロー (総合)": {
      basic_pagename: "フロー",
      basic_url: "flow",
    },
    "フロー (依頼、相談の流れ)": {
      basic_pagename: "依頼、相談の流れ",
      basic_url: "discussion-flow",
    },
    新着情報: {
      basic_pagename: "新着情報",
      basic_url: "news",
    },
    お客様の声: {
      basic_pagename: "お客様の声",
      basic_url: "voice",
    },
    ブログ: {
      basic_pagename: "ブログ",
      basic_url: "blog",
    },
    コラム: {
      basic_pagename: "コラム",
      basic_url: "column",
    },
    フォーム: {
      basic_pagename: "お問い合わせ",
      basic_url: "contact",
    },
    "アクセス (1店舗)": {
      basic_pagename: "アクセス",
      basic_url: "access",
    },
  };

  if (
    sitesetPattern == "採用smart" ||
    sitesetPattern == "採用unbalan" ||
    sitesetPattern == "採用kind"
  ) {
    drop1["リクルート"] = {
      basic_pagename: "求人一覧",
      basic_url: "recruit",
    };
    drop1["事業内容（サービス）"] = {
      basic_pagename: "事業内容",
      basic_url: "business",
    };
    drop1["ビジョン (コンセプト)"] = {
      basic_pagename: "ビジョン",
      basic_url: "vision",
    };
  }

  const lists = ss_makexml.getRange("E29:F50").getValues();
  let drop2 = ["選択してください"];

  lists.forEach(function (element) {
    if (element[0] == "") {
      return;
    }
    drop2.push(element[0] + "///" + element[1]);
  });
  const rule1 = SpreadsheetApp.newDataValidation()
    .requireValueInList(Object.keys(drop1))
    .build();
  const rule2 = SpreadsheetApp.newDataValidation()
    .requireValueInList(drop2)
    .build();

  for (col = 11; col <= 338; col = col + 7) {
    ss_ws_flex.getRange(1, col).setDataValidation(rule1);
    ss_ws_flex.getRange(2, col).setDataValidation(rule2);
  }

  const page_type = ss_ws_flex.getRange("P4:LZ4").getValues();

  let values_row1 = []; //1行目に貼り付けるデータ
  let values_row2 = []; //2行目に貼り付けるデータ
  for (col2 = 0; col2 < page_type[0].length; col2 = col2 + 7) {
    let value = "",
      value2 = "";
    console.log(page_type[0][col2]);

    if (Object.keys(drop1).includes(page_type[0][col2]) == true) {
      const basic_pagename = drop1[page_type[0][col2]].basic_pagename;
      const basic_url = drop1[page_type[0][col2]].basic_url;
      value = page_type[0][col2];
      if (drop2.includes(basic_pagename + "///" + basic_url) == true) {
        value2 = basic_pagename + "///" + basic_url;
      } else {
        value2 = "選択してください";
        ss_ws_flex.getRange(2, col2 + 11).setBackground("#ff0000");
      }
    }
    values_row1.push(value, "", "", "", "", "", "");
    values_row2.push(value2, "", "", "", "", "", "");
  }
  ss_ws_flex.getRange("K1:MA1").setValues([values_row1]);
  ss_ws_flex.getRange("K2:MA2").setValues([values_row2]);

  Browser.msgBox("ライティングシート（可変）でページ名とURLを選択してください");
  ss_ws_flex.activate();
}

function assignSingleEditor(ss) {
  //スプレッドシートに編集者権限をつける
  const ss_this = SpreadsheetApp.getActiveSpreadsheet();
  const ss_editor = ss_this.getSheetByName("編集者権限");
  const lastRow = ss_editor.getLastRow();
  const editors = ss_editor.getRange(1, 1, lastRow, 1).getValues().flat();

  editors.forEach(function (element) {
    if (element == "") {
      return;
    }
    ss.addEditor(element);
  });
}

function set_admin(password, tel, domain) {
  const t = tel == "" ? "00000000000" : tel;
  const domain_forward = domain.split(".")[0];
  let xml = "";

  xml +=
    '<type>\n\
  <datastore>sys</datastore>\n\
  <class>sys/account</class>\n\
  <id>0</id>\n\
  <kv key="account"><value><![CDATA[緊急用削除NG]]></value></kv>\n\
  <kv key="password"><value><![CDATA[' +
    t +
    ']]></value></kv>\n\
</type>\n\
<type>\n\
  <datastore>sys</datastore>\n\
  <class>sys/account</class>\n\
  <id>0</id>\n\
  <kv key="account"><value><![CDATA[緊急用削除ＮＧ]]></value></kv>\n\
  <kv key="password"><value><![CDATA[' +
    t +
    "]]></value></kv>\n\
</type>";

  xml +=
    '<type>\n\
  <datastore>sys</datastore>\n\
  <class>sys/account</class>\n\
  <id>0</id>\n\
  <kv key="account"><value><![CDATA[' +
    domain_forward +
    ']]></value></kv>\n\
  <kv key="password"><value><![CDATA[' +
    password +
    "]]></value></kv>\n\
</type>";

  return xml;
}

function createFile(xml, top) {
  console.log("aa");
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ss_makexml = get_sheet("makexml");

  let range = "";
  let filename =
    ss.getSheetByName("基本情報").getRange("C3").getValue() + ".xml";

  if (top) {
    range = "B21";
    filename = "TOP_" + filename;
  } else {
    range = "B36";
    filename = "下層_" + filename;
  }

  const folder = DriveApp.getFolderById("1nP0TzHG5PcQY1S8wGDDo5i_jNblC8VV6");

  const newfile = folder.createFile(
    Utilities.newBlob("", "text/plain", filename).setDataFromString(
      "<root>" + xml + "</root>",
      "utf-8"
    )
  );
  ss_makexml
    .getRange(range)
    .setValue("https://drive.google.com/file/d/" + newfile.getId() + "/view");
  Browser.msgBox("フォルダに入れましたヽ(・×・)/✧");
}

function check_writing_positions() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const makexml = ss.getSheetByName("makexml");

  //E6セルの、通常or採用を取得
  const sitesetPattern = makexml.getRange("E15").getValue();

  isOK = true;
  isOld = true;
  message = "";

  const obj = {
    "ライティングシート (固定)": {
      SEO1: "B6",
      カテゴリ1: "B190",
      "タグ-地域": "B280",
      タグ1: "B282",
      ライティングスペース: "W3",
    },
    "ライティングシート (可変)": {
      基本情報: "C3",
      本文: "E9",
    },
    "ライティングシート (TOP)": {
      ライティングスペース: "U3",
      MV: "C8",
    },
  };

  const obj_old = {
    "ライティングシート (固定)": {
      SEO1: "B6",
      カテゴリ1: "B190",
      "タグ-地域": "B280",
      タグ1: "B282",
      ライティングスペース: "U3",
    },
    "ライティングシート (可変)": {
      基本情報: "C3",
      本文: "E9",
    },
    "ライティングシート (TOP)": {
      ライティングスペース: "S3",
      MV: "C8",
    },
  };

  for (let sheetname in obj) {
    sheet = ss.getSheetByName(sheetname);

    for (let key in obj[sheetname]) {
      const val = sheet.getRange(obj[sheetname][key]).getValue();

      if (val.indexOf(key) < 0) {
        isOK = false;
        if (message != "") {
          message += ",";
        }
        message += sheetname;
        break;
      }
    }
  }

  if (!isOK) {
    for (let sheetname in obj_old) {
      sheet = ss.getSheetByName(sheetname);

      for (let key in obj_old[sheetname]) {
        const val = sheet.getRange(obj_old[sheetname][key]).getValue();

        if (val.indexOf(key) < 0) {
          isOld = false;
          if (message != "") {
            message += ",";
          }
          message += sheetname;
          break;
        }
      }
    }
  }

  if (isOld && !isOK) {
    Browser.msgBox(
      "OKエクセルのフォーマットが古いです。一括入稿ツールのver5を仕様してください。"
    );
  } else if (!isOK) {
    Browser.msgBox(
      "エラー！！！ " +
        message +
        "で行ずれが起きています。社員まで連絡してください。"
    );
  }

  return isOK && isOld;
}

function extractDomain(url) {
  // 正規表現を使ってドメイン部分を抽出
  var regex = /^(?:https?:\/\/)?(?:www\.)?([^\/]+)/i;
  var match = url.match(regex);

  // ドメインが見つかった場合はそれを返す
  if (match && match[1]) {
    return match[1];
  }

  // ドメインが見つからない場合はnullを返す
  return null;
}
