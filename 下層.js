function MakeXML_under() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const ss_makexml = get_sheet("makexml");
  ss_makexml.getRange("B36").clearContent();

  const sitesetPattern = ss_makexml.getRange("E15").getValue();

  if (sitesetPattern == "") {
    Browser.msgBox("エラー！！  サイトセットパターンを選択してください！");
    return;
  }

  const is_ai = ss_makexml.getRange("E7").getValue();

  if (is_ai == "") {
    Browser.msgBox("エラー！！  AIブログのありなしを選択してください！");
    return;
  }

  const ss_basic = ss.getSheetByName("基本情報");
  const ss_ws_fixed = get_sheet("ライティングシート (固定)");
  const ss_ws_flex = get_sheet("ライティングシート (可変)");
  const ss_ws_top = get_sheet("ライティングシート (TOP)");
  //const ss_page = get_sheet('ページ構成');
  //const ss_parts_list = get_sheet('パーツ設置箇所確認用');
  const ss_shops = get_sheet("店舗情報");
  const ss_csv = get_sheet("CSV");
  const ss_hearing = get_sheet("ヒアリングシート");
  const url_facebook = ss_hearing.getRange("F73").getValue();
  const url_twitter = ss_hearing.getRange("F74").getValue();
  const url_instagram = ss_hearing.getRange("F75").getValue();
  const url_ameblo = ss_hearing.getRange("F77").getValue();
  const url_line = ss_hearing.getRange("F78").getValue();
  const is_supported_kuchikomi = ss_makexml.getRange("K10").getValue();

  let feature_pagename = "特徴";

  if (sitesetPattern == "採用smart") {
    feature_pagename = "当" + ss_makexml.getRange("E9").getValue() + "を知る";
  }

  let domain = ss_csv.getRange("O2").getValue().trim(); //ドメイン
  if (!domain.length) {
    //リニューアルの場合、M2は空欄でN2に既存ドメイン
    domain = ss_csv.getRange("P2").getValue().trim();
  }
  domain = extractDomain(domain);
  const company = ss_csv.getRange("K2").getValue().trim().replace(/　/g, " "); //企業名
  const unit = ss_makexml.getRange("E9").getValue().trim(); //当〇
  const store = ss_shops.getRange("C3").getValue().trim().replace(/　/g, " "); //店舗名
  let zip = ss_shops.getRange("C4").getValue().toString().trim();

  if (zip == "" || zip == "記載なし") {
    zip = ["", ""];
  } else {
    zip = zip.split("-");
  }

  const address = ss_shops.getRange("C5").getValue().trim().replace(/　/g, " ");
  const addr = zip2addr(zip[0] + "" + zip[1]);
  const addr2 = address
    .replace(addr.prefecture, "")
    .replace(addr.address1, "")
    .replace(addr.address2, "")
    .trim();
  const tel = ss_shops.getRange("C6").getValue().trim().split("-");
  const fax = ss_shops.getRange("C7").getValue().trim().split("-");
  const hours = ss_shops.getRange("C8:C9").getDisplayValues().flat();
  //const is_supported_bbs = ss_makexml.getRange('K8').getValue();
  const representative = ss_csv.getRange("I2").getValue().replace("　", " ");

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

  xml += "\n\n<!-- ここから 下層ページ-->\n";

  xml += (function () {
    let under_xml = "";
    const rows = ss_ws_flex.getRange(1, 1, 2, 338).getValues(); //ライティングシート（可変）の1,2行目
    let gallery_count = 0; //下層_ギャラリーページが何ページあるかをカウント（）
    let menu_count = 0;

    for (let col = 11; col <= 338; col = col + 7) {
      //ライティングシート（可変）を７列ごとにループ 9=I列 338=LZ列
      let xml = "";
      const pagetype = rows[0][col - 1];

      let url = "",
        pagename = "",
        dir = [];

      if (pagetype == "") {
        continue;
      }

      switch (pagetype) {
        case "コンセプト":
          if (
            rows[1][col - 1] != "選択してください" ||
            rows[1][col - 1] != ""
          ) {
            dir = rows[1][col - 1].split("///");
            xml += underpage_concept(col + 5, dir[1], dir[0]); //col+5 ライティングシート（可変）のライティングが書いてある列番号
          }

          break;

        case "ビジョン (コンセプト)":
          if (
            rows[1][col - 1] != "選択してください" ||
            rows[1][col - 1] != ""
          ) {
            dir = rows[1][col - 1].split("///");
            xml += underpage_concept(col + 5, dir[1], dir[0]); //col+5 ライティングシート（可変）のライティングが書いてある列番号
          }

          break;

        case "よくある質問":
          if (
            rows[1][col - 1] != "選択してください" ||
            rows[1][col - 1] != ""
          ) {
            dir = rows[1][col - 1].split("///");
            xml += underpage_faq(col + 5, dir[1], dir[0]);
          }

          break;

        case "サービス":
          if (
            rows[1][col - 1] != "選択してください" ||
            rows[1][col - 1] != ""
          ) {
            dir = rows[1][col - 1].split("///");
            xml += underpage_service(col + 5, dir[1], dir[0]);
          }

          break;

        case "事業内容（サービス）":
          if (
            rows[1][col - 1] != "選択してください" ||
            rows[1][col - 1] != ""
          ) {
            dir = rows[1][col - 1].split("///");
            xml += underpage_service(col + 5, dir[1], dir[0]);
          }

          break;

        case "商品説明ページ":
          if (
            rows[1][col - 1] != "選択してください" ||
            rows[1][col - 1] != ""
          ) {
            dir = rows[1][col - 1].split("///");
            xml += underpage_service(col + 5, dir[1], dir[0]);
          }

          break;

        case "ブログ":
          if (
            rows[1][col - 1] != "選択してください" ||
            rows[1][col - 1] != ""
          ) {
            dir = rows[1][col - 1].split("///");
            xml += underpage_blog(col + 5, dir[1], dir[0]);
          }

          break;

        case "コラム":
          if (
            is_ai == "あり" &&
            (rows[1][col - 1] != "選択してください" || rows[1][col - 1] != "")
          ) {
            dir = rows[1][col - 1].split("///");
            xml += underpage_aiblog(col + 5, dir[1], dir[0]);
          }

          break;

        //mode 0='総合',1='施術事例',2='デザイン事例',3='リフォーム',4='不動産売却',5='商品紹介'
        case "ギャラリー 詳細あり":
          if (
            rows[1][col - 1] != "選択してください" ||
            rows[1][col - 1] != ""
          ) {
            dir = rows[1][col - 1].split("///");
            xml += underpage_gallery(col + 5, dir[1], dir[0], 0, gallery_count);
            gallery_count++;
          }

          break;

        case "ギャラリー 詳細なし":
          if (
            rows[1][col - 1] != "選択してください" ||
            rows[1][col - 1] != ""
          ) {
            dir = rows[1][col - 1].split("///");
            xml += underpage_gallery(col + 5, dir[1], dir[0], 1, gallery_count);
            gallery_count++;
          }

          break;

        case "ギャラリー beforeAfter":
          if (
            rows[1][col - 1] != "選択してください" ||
            rows[1][col - 1] != ""
          ) {
            dir = rows[1][col - 1].split("///");
            xml += underpage_gallery(col + 5, dir[1], dir[0], 2, gallery_count);
            gallery_count++;
          }

          break;

        // case 'ギャラリー (施術事例：詳細ページ有)':

        //   if (rows[1][col - 1] != '選択してください' || rows[1][col - 1] != '') {
        //     dir = rows[1][col - 1].split('///');
        //     xml += underpage_gallery(col + 5, dir[1], dir[0], 1, gallery_count);
        //     gallery_count++;
        //   }

        //   break;

        // case 'ギャラリー (デザイン事例)':

        //   if (rows[1][col - 1] != '選択してください' || rows[1][col - 1] != '') {
        //     dir = rows[1][col - 1].split('///');
        //     xml += underpage_gallery(col + 5, dir[1], dir[0], 2, gallery_count);
        //     gallery_count++;
        //   }

        //   break;

        // case 'ギャラリー (施工事例：詳細ページ有)':

        //   if (rows[1][col - 1] != '選択してください' || rows[1][col - 1] != '') {
        //     dir = rows[1][col - 1].split('///');
        //     xml += underpage_gallery(col + 5, dir[1], dir[0], 1, gallery_count);
        //     gallery_count++;
        //   }

        //   break;

        // case 'ギャラリー (リフォーム)':

        //   if (rows[1][col - 1] != '選択してください' || rows[1][col - 1] != '') {
        //     dir = rows[1][col - 1].split('///');
        //     xml += underpage_gallery(col + 5, dir[1], dir[0], 3, gallery_count);
        //     gallery_count++;
        //   }

        //   break;

        // case 'ギャラリー (不動産系：詳細ページ有)':

        //   if (rows[1][col - 1] != '選択してください' || rows[1][col - 1] != '') {
        //     dir = rows[1][col - 1].split('///');
        //     xml += underpage_gallery(col + 5, dir[1], dir[0], 4, gallery_count);
        //     gallery_count++;
        //   }

        //   break;

        // case 'ギャラリー (商品紹介)':

        //   if (rows[1][col - 1] != '選択してください' || rows[1][col - 1] != '') {
        //     dir = rows[1][col - 1].split('///');
        //     xml += underpage_gallery(col + 5, dir[1], dir[0], 5, gallery_count);
        //     gallery_count++;
        //   }

        //   break;

        case "スタッフ (代表挨拶・代表のみ)":
          if (
            rows[1][col - 1] != "選択してください" ||
            rows[1][col - 1] != ""
          ) {
            dir = rows[1][col - 1].split("///");
            xml += underpage_staff(col + 5, dir[1], dir[0], 0);
          }
          break;

        case "スタッフ (複数スタッフ)":
          if (
            rows[1][col - 1] != "選択してください" ||
            rows[1][col - 1] != ""
          ) {
            dir = rows[1][col - 1].split("///");
            xml += underpage_staff(col + 5, dir[1], dir[0], 1);
          }
          break;

        case "新着情報":
          if (
            rows[1][col - 1] != "選択してください" ||
            rows[1][col - 1] != ""
          ) {
            dir = rows[1][col - 1].split("///");
            xml += underpage_news(col + 5, dir[1], dir[0], 1);
          }
          break;

        case "お客様の声":
          if (
            rows[1][col - 1] != "選択してください" ||
            rows[1][col - 1] != ""
          ) {
            dir = rows[1][col - 1].split("///");
            xml += underpage_voice(col + 5, dir[1], dir[0], 1);
          }
          break;

        case "メニュー (総合)":
          if (
            rows[1][col - 1] != "選択してください" ||
            rows[1][col - 1] != ""
          ) {
            dir = rows[1][col - 1].split("///");
            xml += underpage_menu(col + 5, dir[1], dir[0], menu_count);
            menu_count++;
          }

          break;

        case "フロー (総合)":
          if (
            rows[1][col - 1] != "選択してください" ||
            rows[1][col - 1] != ""
          ) {
            dir = rows[1][col - 1].split("///");
            xml += underpage_flow(col + 5, dir[1], dir[0], 1);
          }
          break;

        case "フロー (依頼、相談の流れ)":
          if (
            rows[1][col - 1] != "選択してください" ||
            rows[1][col - 1] != ""
          ) {
            dir = rows[1][col - 1].split("///");
            xml += underpage_flow(col + 5, dir[1], dir[0], 1);
          }
          break;

        case "リクルート":
          if (
            rows[1][col - 1] != "選択してください" ||
            rows[1][col - 1] != ""
          ) {
            dir = rows[1][col - 1].split("///");
            xml += underpage_recruit(col + 5, dir[1], dir[0], 1);
          }
          break;

        case "アクセス (1店舗)":
          if (
            rows[1][col - 1] != "選択してください" ||
            rows[1][col - 1] != ""
          ) {
            dir = rows[1][col - 1].split("///");
            xml += underpage_access(col + 5, dir[1], dir[0], 1);
          }

          break;

        case "アクセス (複数店舗)":
          if (
            rows[1][col - 1] != "選択してください" ||
            rows[1][col - 1] != ""
          ) {
            dir = rows[1][col - 1].split("///");
            xml += underpage_access(col + 5, dir[1], dir[0], 1);
            // xml += multiple_stores(col + 5, dir[1], dir[0], 1);
            xml += multiple_stores(303, dir[1], dir[0], 1); // 303(固定シート 店舗のライティング開始行)
          }

          break;
      }
      under_xml += xml;
    }

    return under_xml;
  })();

  let links_featuresub = ss_makexml.getRange("E21:E25").getValues(); //特徴の重点

  ss_makexml
    .getRange("F21:F25")
    .getValues()
    .forEach(function (v) {
      if (v[0].length > 0) {
        links_featuresub.push(v);
      }
    });

  const links_fixed = ss_makexml.getRange("E44:F49").getValues(); //固定ページ

  const features = [];
  links_featuresub.forEach(function (v) {
    features.push(v[0]);
  });

  let fixed_writing_col = "W";

  /* feature */
  xml += (function () {
    let xml = make_page(
      {
        url: "/feature/",
        page_name: feature_pagename,
        layout: "42",
        auth_user: "",
        auth_pw: "",
        on_sitemap: "1",
        is_dummy: "",
        parent_path: "",
        h4seo: ss_ws_fixed.getRange(fixed_writing_col + 157).getValue(),
        description: ss_ws_fixed.getRange(fixed_writing_col + 159).getValue(),
        keyword_1: "",
        keyword_2: "",
        title: "",
        title_mode: "same_name",
        one_phrase: "",
      },
      function () {
        let xml = "";
        xml += mv_parts("Feature", feature_pagename);
        xml += parts({ column: "U", key: "main" }, function () {
          //共通_見出し＋本文
          let xml = "";
          xml += v("ttl_en", "");
          xml += v(
            "h2_ttl",
            ss_ws_fixed.getRange(fixed_writing_col + 158).getValue()
          );
          xml += v("h3_ttl", "");
          xml += richtext(
            "text",
            ss_ws_fixed.getRange(fixed_writing_col + 159).getValue()
          );
          xml += v("css_id", "");
          xml += v("css_class", "");
          return xml;
        });
        xml += parts({ column: "BR", key: "main" }, function () {
          //特徴
          let xml = "";
          xml += v("css_id", "");
          xml += v("css_class", "");
          xml += '<child key="contents">';
          features.forEach(function (n, index) {
            xml += fieldset("cms", "contents", function () {
              let xml = "";
              xml += img("image", "under");
              xml += v("bg_size", "cover");
              xml += v("h_ttl_en", "Feature 0" + (index + 1));
              xml += v(
                "h_ttl_jp",
                ss_ws_fixed
                  .getRange(fixed_writing_col + (160 + index * 2))
                  .getValue()
              ); //コンテンツごとにライティング2行ずつ
              xml += richtext(
                "text",
                ss_ws_fixed
                  .getRange(fixed_writing_col + (161 + index * 2))
                  .getValue()
              );
              xml += v("href", "/feature/" + n.replace(/ /g, "_") + "/");
              xml += v("href_text", n + "へ");
              xml += v("target", "");
              xml += v("fade", "0");
              xml += v("css_class", "");
              return xml;
            });
          });
          xml += v("bg_color", "1");
          xml += "</child>";
          return xml;
        });
        xml += parts({ column: "BS", key: "main" }, function () {
          //関連ページ
          let xml = "";
          xml += v("css_id", "");
          xml += v("css_class", "");
          xml += v("h_ttl", "Related");
          xml += v("h_ttl2", "");
          xml += v("h_ttl3", "");
          xml += v("bg_color", "1");
          xml += '<child key="contents">';
          xml += fieldset("cms", "contents", function () {
            let xml = "";
            xml += v("href", "/feature/");
            xml += v("href_text", feature_pagename);
            xml += v("target", "");
            xml += img("bg_image", "under");
            return xml;
          });
          features.forEach(function (f) {
            xml += fieldset("cms", "contents", function () {
              let xml = "";
              xml += v("href", "/feature/" + f.replace(/ /g, "_") + "/");
              xml += v("href_text", f);
              xml += v("target", "");
              xml += img("bg_image", "under");
              return xml;
            });
          });
          xml += v("bg_color", "1");
          xml += "</child>";
          return xml;
        });
        return xml;
      }
    );
    return xml;
  })();

  features.forEach(function (page_name, feature) {
    xml += (function () {
      //const page_name=ss_ws_fixed.getRange('F6').getValue();
      let S_base = feature * 10 + 6;

      let xml = make_page(
        {
          url: "/feature/" + page_name.replace(/ /g, "_") + "/",
          page_name: page_name,
          layout: "42",
          auth_user: "",
          auth_pw: "",
          on_sitemap: "1",
          is_dummy: "",
          parent_path: "",
          h4seo: ss_ws_fixed
            .getRange(fixed_writing_col + (S_base + 1))
            .getValue(),
          description: ss_ws_fixed
            .getRange(fixed_writing_col + (S_base + 3))
            .getValue(),
          keyword_1: "",
          keyword_2: "",
          title: ss_ws_fixed.getRange(fixed_writing_col + S_base).getValue(),
          title_inherit_order: "ignore",
          title_mode: "input",
          one_phrase: "",
        },
        function () {
          let xml = "";
          xml += mv_parts("Feature 0" + (feature + 1), page_name);
          xml += parts({ column: "U", key: "main" }, function () {
            //共通_見出し＋本文
            let xml = "";
            xml += v("ttl_en", "");
            xml += v(
              "h2_ttl",
              ss_ws_fixed.getRange(fixed_writing_col + (S_base + 2)).getValue()
            );
            xml += v("h3_ttl", "");
            xml += richtext(
              "text",
              ss_ws_fixed.getRange(fixed_writing_col + (S_base + 3)).getValue()
            );
            xml += v("css_id", "");
            xml += v("css_class", "");
            return xml;
          });
          xml += parts({ column: "BR", key: "main" }, function () {
            //特徴
            let xml = "";
            xml += v("css_id", "");
            xml += v("css_class", "");
            xml += '<child key="contents">\n';
            xml += fieldset("cms", "contents", function () {
              let xml = "";
              xml += img("image", "under");
              xml += v("bg_size", "cover");
              xml += v("h_ttl_en", "");
              xml += v(
                "h_ttl_jp",
                ss_ws_fixed
                  .getRange(fixed_writing_col + (S_base + 4))
                  .getValue()
              );
              xml += richtext(
                "text",
                ss_ws_fixed
                  .getRange(fixed_writing_col + (S_base + 5))
                  .getValue()
              );
              xml += v("href", "");
              xml += v("href_text", "");
              xml += v("target", "");
              xml += v("fade", "0");
              xml += v("css_class", "");
              return xml;
            });
            xml += fieldset("cms", "contents", function () {
              let xml = "";
              xml += img("image", "under");
              xml += v("bg_size", "cover");
              xml += v("h_ttl_en", "");
              xml += v(
                "h_ttl_jp",
                ss_ws_fixed
                  .getRange(fixed_writing_col + (S_base + 6))
                  .getValue()
              );
              xml += richtext(
                "text",
                ss_ws_fixed
                  .getRange(fixed_writing_col + (S_base + 7))
                  .getValue()
              );
              xml += v("href", "");
              xml += v("href_text", "");
              xml += v("target", "");
              xml += v("fade", "0");
              xml += v("css_class", "");
              return xml;
            });
            xml += "</child>\n";
            return xml;
          });
          if (is_ai == "あり") {
            xml += parts({ column: "CD", key: "main" }, function () {
              //下層_ブログ（絞り込み）
              let xml = "";
              xml += v("article_code", "blog");
              xml += v("order", "ds.public_begin_datetime DESC,ds.id DESC");
              xml += v("count", "4");
              xml += v("h2_ttl", "Blog");
              xml += v("tag_group", "category");
              xml += v("tag_name", page_name.replace(/ /g, "_"));
              xml += v(
                "href",
                "/blog/category/" + page_name.replace(/ /g, "_") + "/"
              );
              xml += v("link_text", "ブログへ");
              xml += v("h2_ttl2", "Column");
              xml += v("tag_group2", "aicategory");
              xml += v("tag_name2", page_name.replace(/ /g, "_"));
              xml += v(
                "href2",
                "/column/category/" + page_name.replace(/ /g, "_") + "/"
              );
              xml += v("link_text2", "コラムへ");
              xml += v("bg_color", "0");
              return xml;
            });
          }
          if (is_ai == "なし") {
            xml += parts({ column: "CC", key: "main" }, function () {
              //下層_ブログ（絞り込み）
              let xml = "";
              xml += v("article_code", "blog");
              xml += v("order", "ds.public_begin_datetime DESC,ds.id DESC");
              xml += v("count", "4");
              xml += v("h_ttl", "Blog");
              xml += v("h2_ttl", "ブログ");
              xml += v("tag_group", "category");
              xml += v("tag_name", page_name.replace(/ /g, "_"));
              xml += v(
                "href",
                "/blog/category/" + page_name.replace(/ /g, "_") + "/"
              );
              xml += v("link_text", "ブログへ");
              xml += v("target", "");
              xml += v("bg_color", "0");
              return xml;
            });
          }
          xml += parts({ column: "AA", key: "main" }, function () {
            //アクセス2
            let xml = "";
            xml += v("css_id", "");
            xml += v("css_class", "");
            xml += v(
              "en_ttl",
              links_fixed[0][1].charAt(0).toUpperCase() +
                links_fixed[0][1].slice(1)
            );
            xml += v("h2_ttl", links_fixed[0][0]);
            xml += v("href", "/" + links_fixed[0][1] + "/");
            xml += v("href_text", links_fixed[0][0] + "へ");
            xml += v("order", "ds.public_begin_datetime DESC,ds.id DESC");
            xml += v("article_display", "all");
            xml += v("article", "{map:shop_0}"); //id未定
            xml += v("bg_color", "1");
            return xml;
          });
          xml += parts({ column: "BE", key: "main" }, function () {
            //共通_見出し＋本文2
            let xml = "";
            xml += v("ttl_en", "");
            xml += v(
              "h2_ttl",
              ss_ws_fixed.getRange(fixed_writing_col + (S_base + 8)).getValue()
            );
            xml += v("h3_ttl", "");
            xml += richtext(
              "text",
              ss_ws_fixed.getRange(fixed_writing_col + (S_base + 9)).getValue()
            );
            xml += v("css_id", "");
            xml += v("css_class", "");
            return xml;
          });
          xml += parts({ column: "BS", key: "main" }, function () {
            //関連ページ
            let xml = "";
            xml += v("css_id", "");
            xml += v("css_class", "");
            xml += v("h_ttl", "Related");
            xml += v("h_ttl2", "関連ページ");
            xml += v("h_ttl3", "");
            xml += v("bg_color", "1");
            xml += '<child key="contents">\n';
            xml += fieldset("cms", "contents", function () {
              let xml = "";
              xml += v("href", "/feature/");
              xml += v("href_text", feature_pagename);
              xml += v("target", "");
              xml += img("bg_image", "under");
              return xml;
            });
            features.forEach(function (f) {
              xml += fieldset("cms", "contents", function () {
                let xml = "";
                xml += v("href", "/feature/" + f.replace(/ /g, "_") + "/");
                xml += v("href_text", f);
                xml += v("target", "");
                xml += img("bg_image", "under");
                return xml;
              });
            });
            xml += v("bg_color", "1");
            xml += "</child>\n";
            return xml;
          });
          return xml;
        }
      );
      return xml;
    })();
  });

  if (is_supported_kuchikomi == "あり") {
    const kuchikomi_type = ss_csv.getRange("AVL2").getValue().trim();

    let kuchikomi_url = kuchikomi_type == "口コミ" ? "reviews" : "voice";
    xml += underpage_kuchikomi(kuchikomi_url, kuchikomi_type);
  }
  xml += underpage_contact();
  xml += underpage_privacy();
  xml += underpage_sitemap();

  /* smart 背景固定コンテンツ */
  /*   if ((get_sheet('makexml').getRange('E15').getValue()) == 'smart') {
      xml += parts({ column: 'BY', key: '', parent: ['25.layout.layout'] }, function () {
        let xml = '';
  
      });
    } */

  createFile(xml, 0);
}

function underpage_concept(column, url, pagename) {
  const ss_ws_flex = get_sheet("ライティングシート (可変)");
  const writings = ss_ws_flex.getRange(7, column, 134, 1).getValues().flat();

  console.log(writings[0]);
  console.log(writings[1]);
  console.log(writings[2]);

  let xml = "<!--ここから下層_コンセプト-->";
  xml += make_page(
    {
      url: "/" + url + "/",
      page_name: pagename,
      layout: "42",
      auth_user: "",
      auth_pw: "",
      on_sitemap: "1",
      is_dummy: "",
      parent_path: "",
      h4seo: writings[0],
      description: writings[2],
      keyword_1: "",
      keyword_2: "",
      title: "",
      title_mode: "same_name",
      one_phrase: "",
    },
    function () {
      const ttl_en = url[0].toUpperCase() + url.slice(1);
      let xml = "";

      xml += mv_parts(ttl_en, pagename); //下層MV
      xml += parts({ column: "U", key: "main" }, function () {
        //共通見出し+本文
        let xml = "";
        xml += v("ttl_en", "");
        xml += v("h2_ttl", writings[1]);
        xml += richtext("text", writings[2]);
        xml += v("css_id", "");
        xml += v("css_class", "");
        return xml;
      });
      xml += parts({ column: "BQ", key: "main" }, function () {
        //TOP_SEOクッション
        let xml = "";
        xml += v("css_id", "");
        xml += v("css_class", "");
        xml += v("h_ttl", "");
        xml += v("h_ttl2", "");
        xml += '<child key="contents">\n';
        for (i = 0; i < 4; i = i + 2) {
          xml += fieldset("cms", "contents", function () {
            let xml = "";
            xml += img("image", "under");
            xml += v("bg_size", "cover");
            xml += v("h3_ttl", writings[3 + i]);
            xml += richtext("text", writings[4 + i]);
            xml += v("href", "");
            xml += v("href_text", "");
            xml += v("fade", "0");
            xml += v("css_class", "");
            xml += v("target", "");
            return xml;
          });
        }
        xml += "</child>\n";
        xml += v("bg_color", "1");
        return xml;
      });
      xml += parts({ column: "BA", key: "main" }, function () {
        //共通背景
        let xml = "";
        xml += v("bg_color", "0");
        return xml;
      });
      xml += parts({ column: "BQ", key: "main" }, function () {
        //TOP_SEOクッション
        let xml = "";
        xml += v("css_id", "");
        xml += v("css_class", "");
        xml += v("h_ttl", "");
        xml += v("h_ttl2", "");
        xml += '<child key="contents">\n';
        for (i = 0; i < 120; i = i + 2) {
          if (writings[7 + i] == "" && writings[8 + i] == "") {
            continue;
          }
          xml += fieldset("cms", "contents", function () {
            let xml = "";
            xml += img("image", "under");
            xml += v("bg_size", "cover");
            xml += v("h3_ttl", writings[7 + i]);
            xml += richtext("text", writings[8 + i]);
            xml += v("href", "");
            xml += v("href_text", "");
            xml += v("fade", "0");
            xml += v("css_class", "");
            xml += v("target", "");
            return xml;
          });
        }
        xml += "</child>\n";
        xml += v("bg_color", "1");
        return xml;
      });
      return xml;
    }
  );
  return xml;
}

function underpage_service(column, url, pagename) {
  const ss_ws_flex = get_sheet("ライティングシート (可変)");
  const writings = ss_ws_flex.getRange(7, column, 134, 1).getValues().flat();

  let xml = "<!--ここから下層_サービス-->";
  xml += make_page(
    {
      url: "/" + url + "/",
      page_name: pagename,
      layout: "42",
      auth_user: "",
      auth_pw: "",
      on_sitemap: "1",
      is_dummy: "",
      parent_path: "",
      h4seo: writings[0],
      keyword_1: "",
      keyword_2: "",
      title: "",
      title_mode: "same_name",
      description: writings[2],
      one_phrase: "",
    },
    function () {
      const ttl_en = url[0].toUpperCase() + url.slice(1);
      let xml = "";

      xml += mv_parts(ttl_en, pagename); //下層MV
      xml += parts({ column: "U", key: "main" }, function () {
        //共通見出し＋本文
        let xml = "";
        xml += v("ttl_en", "");
        xml += v("h2_ttl", writings[1]);
        xml += richtext("text", writings[2]);
        xml += v("css_id", "");
        xml += v("css_class", "");
        return xml;
      });
      xml += parts({ column: "BQ", key: "main" }, function () {
        //TOP_SEOクッション
        let xml = "";
        xml += v("css_id", "");
        xml += v("css_class", "");
        xml += v("h_ttl", "");
        xml += v("h_ttl2", "");
        xml += '<child key="contents">\n';
        for (i = 0; i < 124; i = i + 2) {
          if (writings[3 + i] == "" && writings[4 + i] == "") {
            continue;
          }
          xml += fieldset("cms", "contents", function () {
            let xml = "";
            xml += img("image", "under");
            xml += v("bg_size", "cover");
            xml += v("h3_ttl", writings[3 + i]);
            xml += richtext("text", writings[4 + i]);
            xml += v("href", "");
            xml += v("href_text", "");
            xml += v("fade", "0");
            xml += v("css_class", "");
            xml += v("target", "");
            return xml;
          });
        }
        xml += "</child>\n";
        xml += v("bg_color", "1");
        return xml;
      });
      return xml;
    }
  );
  return xml;
}

function underpage_faq(column, url, pagename) {
  const ss_ws_flex = get_sheet("ライティングシート (可変)");
  const writings = ss_ws_flex.getRange(7, column, 134, 1).getValues().flat();

  let xml = "<!--ここから下層_よくある質問-->";
  xml += make_page(
    {
      url: "/" + url + "/",
      page_name: pagename,
      layout: "42",
      auth_user: "",
      auth_pw: "",
      on_sitemap: "1",
      is_dummy: "",
      parent_path: "",
      h4seo: writings[0],
      keyword_1: "",
      keyword_2: "",
      title: "",
      title_mode: "same_name",
      description: writings[2],
      one_phrase: "",
    },
    function () {
      const ttl_en = "Q&A";
      let xml = "";

      xml += mv_parts(ttl_en, pagename); //下層MV
      xml += parts({ column: "U", key: "main" }, function () {
        //共通見出し＋本文
        let xml = "";
        xml += v("ttl_en", "");
        xml += v("h2_ttl", writings[1]);
        xml += richtext("text", writings[2]);
        xml += v("css_id", "");
        xml += v("css_class", "");
        return xml;
      });

      xml += parts({ column: "CI", key: "main" }, function () {
        //構造化
        let xml = "";
        return xml;
      });

      xml += parts({ column: "AQ", key: "main" }, function () {
        //下層_よくある質問
        let xml = "";
        xml += v("css_id", "");
        xml += v("css_class", "");
        xml += v("h_ttl", "");
        xml += v("h_ttl2", "");
        xml += v("h_ttl3", "");
        xml += v("href", "");
        xml += v("link_text", "");
        xml += img("image", "");
        xml += v("order", "ds.priority ASC,ds.id ASC");
        xml += v("count", "10");
        xml += v("refine", "0");
        xml += v("tag_group", "faq");
        return xml;
      });

      if (writings[3] != "" || writings[4] != "") {
        xml += parts({ column: "BQ", key: "main" }, function () {
          //TOP_SEOクッション
          let xml = "";
          xml += v("css_id", "");
          xml += v("css_class", "");
          xml += v("h_ttl", "");
          xml += v("h_ttl2", "");
          xml += '<child key="contents">\n';
          for (i = 0; i < 124; i = i + 2) {
            if (writings[3 + i] == "" && writings[4 + i] == "") {
              continue;
            }
            xml += fieldset("cms", "contents", function () {
              let xml = "";
              xml += img("image", "under");
              xml += v("bg_size", "cover");
              xml += v("h3_ttl", writings[3 + i]);
              xml += richtext("text", writings[4 + i]);
              xml += v("href", "");
              xml += v("href_text", "");
              xml += v("fade", "0");
              xml += v("css_class", "");
              xml += v("target", "");
              return xml;
            });
          }
          xml += "</child>\n";
          xml += v("bg_color", "1");
          return xml;
        });
      }

      return xml;
    }
  );

  return xml;
}

function underpage_blog(column, url, pagename) {
  const ss_ws_flex = get_sheet("ライティングシート (可変)");
  const writings = ss_ws_flex.getRange(7, column, 134, 1).getValues().flat();
  const ttl_en = url[0].toUpperCase() + url.slice(1);

  let xml = "<!--ここから下層_ブログ-->";

  xml += make_page_with_directory(
    {
      parent: "357", // /_sys/setting/directory/group/357/
      code: "blog",
      url: url,
      name: pagename,
      layout: "72",
      auth_user: "",
      auth_pw: "",
      on_sitemap: "1",
      is_dummy: "",
      parent_path: "",
      h4seo: writings[0],
      h4seo_mode: "input",
      h4seo_title_inherit_order: "ignore",
      keyword_1: "",
      keyword_2: "",
      title: "",
      title_inherit_order: "before",
      title_mode: "same_name",
      description: writings[2],
      one_phrase: "",
    },
    function () {
      xml += parts({ column: "BW", key: "ttl" }, function () {
        //カテゴリ一覧(見出し+テキスト)_ブログ
        let xml = "";
        xml += v("h_ttl", ttl_en);
        xml += v("h_ttl2", "");
        xml += v("h_ttl3", writings[1]);
        xml += richtext("text", writings[2]);
        xml += v("css_id", "");
        return xml;
      });
      return xml;
    }
  );

  return xml;
}

function underpage_aiblog(column, url, pagename) {
  const makexml =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("makexml");
  const sitesetPattern = makexml.getRange("E15").getValue();
  const is_ai = makexml.getRange("E7").getValue();
  if (is_ai == "なし") {
    return;
  }
  const ss_ws_flex = get_sheet("ライティングシート (可変)");
  const writings = ss_ws_flex.getRange(7, column, 134, 1).getValues().flat();
  const ttl_en = url[0].toUpperCase() + url.slice(1);
  let parent = "";
  let layout = "";

  if (sitesetPattern == "smart" || sitesetPattern == "採用smart") {
    parent = "2281";
    layout = "180";
  } else if (sitesetPattern == "unbalan") {
    parent = "2287";
    layout = "181";
  } else if (sitesetPattern == "kind") {
    parent = "2224";
    layout = "182";
  }

  let xml = "<!--ここから下層_AIブログ-->";

  xml += make_page_with_directory(
    {
      parent: parent, // /_sys/setting/directory/group/2281/
      code: "column",
      url: url,
      name: pagename,
      layout: layout,
      auth_user: "",
      auth_pw: "",
      on_sitemap: "1",
      is_dummy: "",
      parent_path: "",
      h4seo: writings[0],
      h4seo_mode: "input",
      h4seo_title_inherit_order: "ignore",
      keyword_1: "",
      keyword_2: "",
      title: "",
      title_inherit_order: "before",
      title_mode: "same_name",
      description: writings[2],
      one_phrase: "",
    },
    function () {
      xml += parts({ column: "BW", key: "cont" }, function () {
        //カテゴリ一覧(見出し+テキスト)_ブログ
        let xml = "";
        xml += v("h_ttl", ttl_en);
        xml += v("h_ttl2", "");
        xml += v("h_ttl3", writings[1]);
        xml += richtext("text", writings[2]);
        xml += v("css_id", "");
        return xml;
      });
      return xml;
    }
  );

  return xml;
}

function underpage_kuchikomi(url, pagename) {
  const ss_ws_flex = get_sheet("ライティングシート (可変)");
  const writing = ss_ws_flex
    .getRange("W7")
    .getValue()
    .replace("ブログ", pagename);

  let xml = "<!--ここから下層_口コミ-->";
  xml += make_page(
    {
      url: "/" + url + "/",
      page_name: pagename,
      layout: "42",
      auth_user: "",
      auth_pw: "",
      on_sitemap: "1",
      analysis: "0",
      is_dummy: "",
      parent_path: "",
      h4seo: writing,
      keyword_1: "",
      keyword_2: "",
      title: "",
      title_mode: "same_name",
      one_phrase: "",
    },
    function () {
      const ttl_en = url[0].toUpperCase() + url.slice(1);
      let xml = "";

      xml += mv_parts(ttl_en, pagename); //下層MV
      xml += parts({ column: "CG", key: "main" }, function () {
        //口コミ
        let xml = "";
        xml += v("ttl_en", ttl_en);
        xml += v("h2_ttl", pagename);
        xml += richtext("text", "");
        xml += v("css_id", "");
        xml += v("css_class", "");
        xml += v("bg_color", "0");
        xml += v("link", "");
        xml += v("list", "2");
        xml += v("number", "");
        xml += v("location", "");
        return xml;
      });

      return xml;
    }
  );
  return xml;
}

//下層ギャラリー
function underpage_gallery(column, url, pagename, mode, count) {
  //mode 0='ギャラリー 詳細あり',1='ギャラリー 詳細なし',2='ギャラリー beforeAfter'
  const gallery_mode = ["AF", "AG", "AI"];
  const gallery_detail_mode = ["", "AH", "AJ", "AL", "AN", "AP"];
  const layout = ["111", "170", "171"];
  const detail_layout = ["114", "172", "173"];
  const directory_number = mode == 0 ? "" : (mode + 1).toString();
  count = count > 2 ? 2 : count; //レイアウトが3つしかないので上限2

  const ss_ws_flex = get_sheet("ライティングシート (可変)");
  const writings = ss_ws_flex.getRange(7, column, 134, 1).getValues().flat();
  const ttl_en = url[0].toUpperCase() + url.slice(1);

  let xml = "<!--ここから下層_ギャラリー-->";

  xml += make_page_with_directory(
    {
      parent: "1777",
      code: "gallery" + directory_number,
      url: url,
      name: pagename,
      layout: layout[count],
      auth_user: "",
      auth_pw: "",
      on_sitemap: "1",
      is_dummy: "",
      parent_path: "",
      h4seo: writings[0],
      h4seo_mode: "input",
      h4seo_title_inherit_order: "ignore",
      keyword_1: "",
      keyword_2: "",
      title: "",
      title_inherit_order: "before",
      title_mode: "same_name",
      description: writings[2],
      one_phrase: "",
    } /* , function () {
  } */
  );

  //レイアウト
  xml += parts(
    { column: "T", key: "mv", parent: [layout[count] + ".layout.layout"] },
    function () {
      //T:下層_MV
      const makexml = get_sheet("makexml");
      const mvtype = makexml.getRange("E16").getValue();

      let xml = "";
      xml += v("ttl_en", ttl_en);
      xml += v("ttl_jp", pagename);
      if (
        mvtype != "下層_MV_3" &&
        mvtype != "下層_MV_14" &&
        mvtype != "下層_MV_17"
      ) {
        xml += img("bg_image", "under_mv");
      }
      xml += v("position", "50% 0");
      xml += v("position_y", "center center");
      xml += v("reverse", "");
      return xml;
    }
  );
  xml += parts(
    { column: "G", key: "mv", parent: [layout[count] + ".layout.layout"] },
    function () {
      //パンくず
      return "";
    }
  );
  xml += parts(
    { column: "U", key: "main", parent: [layout[count] + ".layout.layout"] },
    function () {
      //共通見出し＋本文
      let xml = "";
      xml += v("ttl_en", "");
      xml += v("h2_ttl", writings[1]);
      xml += richtext("text", writings[2]);
      xml += v("css_id", "");
      xml += v("css_class", "");
      return xml;
    }
  );

  xml += parts(
    {
      column: gallery_mode[mode],
      key: "main",
      parent: [layout[count] + ".layout.layout"],
    },
    function () {
      //下層ギャラリー
      let xml = "";
      xml += v("css_id", "");
      xml += v("css_class", "");
      xml += v("refine", "1");
      xml += v("count", "15");
      xml += v("order", "ds.priority ASC,ds.id ASC");
      xml += v("slide", "true");
      if (mode > 0) {
        xml += v("tag_id", "1780");
      }
      xml += v("tag_group", "gallery");
      xml += v("directory_code", "gallery" + directory_number);

      return xml;
    }
  );

  return xml;
}

//下層スタッフ
function underpage_staff(column, url, pagename, mode) {
  //mode 0='代表挨拶',1='複数在籍'
  const staff_mode = ["AT", "AU"];

  const ss_ws_flex = get_sheet("ライティングシート (可変)");
  const writings = ss_ws_flex.getRange(7, column, 134, 1).getValues().flat();
  const ttl_en = url[0].toUpperCase() + url.slice(1);

  let xml = "<!--ここから下層_スタッフー-->";

  xml += make_page_with_directory({
    parent: "1804",
    code: "staff",
    url: url,
    name: pagename,
    layout: "63",
    auth_user: "",
    auth_pw: "",
    on_sitemap: "1",
    is_dummy: "",
    parent_path: "",
    h4seo: writings[0],
    h4seo_mode: "input",
    h4seo_title_inherit_order: "ignore",
    keyword_1: "",
    keyword_2: "",
    title: "",
    title_inherit_order: "before",
    title_mode: "same_name",
    description: writings[2],
    one_phrase: "",
  });

  //レイアウト
  xml += parts(
    { column: "T", key: "mv", parent: ["63.layout.layout"] },
    function () {
      //T:下層_MV
      const makexml = get_sheet("makexml");
      const mvtype = makexml.getRange("E16").getValue();

      let xml = "";
      xml += v("ttl_en", ttl_en);
      xml += v("ttl_jp", pagename);
      if (
        mvtype != "下層_MV_3" &&
        mvtype != "下層_MV_14" &&
        mvtype != "下層_MV_17"
      ) {
        xml += img("bg_image", "under_mv");
      }
      xml += v("position", "50% 0");
      xml += v("position_y", "center center");
      xml += v("reverse", "");
      return xml;
    }
  );
  xml += parts(
    { column: "G", key: "mv", parent: ["63.layout.layout"] },
    function () {
      //パンくず
      return "";
    }
  );
  xml += parts(
    { column: "U", key: "main", parent: ["63.layout.layout"] },
    function () {
      //共通見出し＋本文
      let xml = "";
      xml += v("ttl_en", "");
      xml += v("h2_ttl", writings[1]);
      xml += richtext("text", writings[2]);
      xml += v("css_id", "");
      xml += v("css_class", "");
      return xml;
    }
  );

  xml += parts(
    { column: staff_mode[mode], key: "main", parent: ["63.layout.layout"] },
    function () {
      //下層スタッフ
      let xml = "";
      xml += v("css_id", "");
      xml += v("css_class", "");
      xml += v("article_select", "staff");
      xml += v("h_ttl", "");
      xml += v("h_ttl2", "");
      xml += v("h_ttl3", "");
      xml += richtext("text", "");
      if (mode == 0) {
        xml += v("href", "");
        xml += v("link_text", "");
      }
      if (mode == 1) {
        xml += v("count", "10");
      }
      xml += v("order", "ds.priority ASC,ds.id ASC");
      xml += v("bg_color", "0");
      xml += v("link_text", "More");

      return xml;
    }
  );

  return xml;
}

//下層メニュー
function underpage_menu(column, url, pagename, count) {
  const ss_ws_flex = get_sheet("ライティングシート (可変)");
  const writings = ss_ws_flex.getRange(7, column, 134, 1).getValues().flat();
  const ttl_en = url[0].toUpperCase() + url.slice(1);
  const layout = ["102", "176", "177"];
  count = count > 2 ? 2 : count; //レイアウトが3つしかないので上限2
  const directory_number = count == 0 ? "" : count + 1;

  let xml = "<!--ここから下層_メニュー-->";

  xml += make_page_with_directory({
    parent: "363",
    code: "menu" + directory_number,
    url: url,
    name: pagename,
    layout: layout[count],
    auth_user: "",
    auth_pw: "",
    on_sitemap: "1",
    is_dummy: "",
    parent_path: "",
    h4seo: writings[0],
    h4seo_mode: "input",
    h4seo_title_inherit_order: "ignore",
    keyword_1: "",
    keyword_2: "",
    title: "",
    title_inherit_order: "before",
    title_mode: "same_name",
    description: writings[2],
    one_phrase: "",
  });

  //レイアウト
  xml += parts(
    { column: "T", key: "mv", parent: [layout[count] + ".layout.layout"] },
    function () {
      //T:下層_MV
      const makexml = get_sheet("makexml");
      const mvtype = makexml.getRange("E16").getValue();

      let xml = "";
      xml += v("ttl_en", ttl_en);
      xml += v("ttl_jp", pagename);
      if (
        mvtype != "下層_MV_3" &&
        mvtype != "下層_MV_14" &&
        mvtype != "下層_MV_17"
      ) {
        xml += img("bg_image", "under_mv");
      }
      xml += v("position", "50% 0");
      xml += v("position_y", "center center");
      xml += v("reverse", "");
      return xml;
    }
  );
  xml += parts(
    { column: "G", key: "mv", parent: [layout[count] + ".layout.layout"] },
    function () {
      //パンくず
      return "";
    }
  );
  xml += parts(
    { column: "U", key: "main", parent: [layout[count] + ".layout.layout"] },
    function () {
      //共通見出し＋本文
      let xml = "";
      xml += v("ttl_en", "");
      xml += v("h2_ttl", writings[1]);
      xml += richtext("text", writings[2]);
      xml += v("css_id", "");
      xml += v("css_class", "");
      return xml;
    }
  );

  xml += parts(
    { column: "AD", key: "main", parent: [layout[count] + ".layout.layout"] },
    function () {
      //下層メニュー
      let xml = "";
      xml += v("css_id", "");
      xml += v("css_class", "");
      xml += v("h_ttl", "");
      xml += v("h_ttl2", "");
      xml += v("h_ttl3", "");
      xml += v("href", "");
      xml += v("link_text", "");
      xml += v("order", "ds.priority ASC,ds.id ASC");
      xml += v("article_code", "menu");
      xml += '<child key="contents">\n';
      xml += fieldset("cms", "contents", function () {
        let xml = "";
        xml += richtext("text", "");
        xml += v("tag", "メニュー1");
        xml += v("count", "100");
        xml += img("image", "");
        xml += img("image01", "");
        xml += img("image02", "");
        xml += img("image03", "");
        return xml;
      });
      xml += "</child>\n";
      xml += v("target", "");
      xml += v("bg_color", "0");

      return xml;
    }
  );

  return xml;
}

//下層新着情報
function underpage_news(column, url, pagename) {
  const ss_ws_flex = get_sheet("ライティングシート (可変)");
  const writings = ss_ws_flex.getRange(7, column, 134, 1).getValues().flat();
  const ttl_en = url[0].toUpperCase() + url.slice(1);
  const makexml =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("makexml");
  const sitesetPattern = makexml.getRange("E15").getValue();
  const directory_id = sitesetPattern == "unbalan" ? "1930" : "1920";

  let xml = "<!--ここから下層_新着情報-->";

  xml += make_page_with_directory({
    parent: directory_id,
    code: "news",
    url: url,
    name: pagename,
    layout: "90",
    auth_user: "",
    auth_pw: "",
    on_sitemap: "1",
    is_dummy: "",
    parent_path: "",
    h4seo: writings[0],
    h4seo_mode: "input",
    h4seo_title_inherit_order: "ignore",
    keyword_1: "",
    keyword_2: "",
    title: "",
    title_inherit_order: "before",
    title_mode: "same_name",
    description: writings[2],
    one_phrase: "",
  });

  //レイアウト
  xml += parts(
    { column: "T", key: "mv", parent: ["90.layout.layout"] },
    function () {
      //T:下層_MV
      const makexml = get_sheet("makexml");
      const mvtype = makexml.getRange("E16").getValue();

      let xml = "";
      xml += v("ttl_en", ttl_en);
      xml += v("ttl_jp", pagename);
      if (
        mvtype != "下層_MV_3" &&
        mvtype != "下層_MV_14" &&
        mvtype != "下層_MV_17"
      ) {
        xml += img("bg_image", "under_mv");
      }
      xml += v("position", "50% 0");
      xml += v("position_y", "center center");
      xml += v("reverse", "");
      return xml;
    }
  );
  xml += parts(
    { column: "G", key: "mv", parent: ["90.layout.layout"] },
    function () {
      //パンくず
      return "";
    }
  );
  xml += parts(
    { column: "U", key: "main", parent: ["90.layout.layout"] },
    function () {
      //共通見出し＋本文
      let xml = "";
      xml += v("ttl_en", "");
      xml += v("h2_ttl", writings[1]);
      xml += richtext("text", writings[2]);
      xml += v("css_id", "");
      xml += v("css_class", "");
      return xml;
    }
  );

  xml += parts(
    { column: "W", key: "main", parent: ["90.layout.layout"] },
    function () {
      //下層新着情報
      let xml = "";
      xml += v("css_id", "");
      xml += v("css_class", "");
      xml += v("count", "18");
      xml += v("order", "ds.public_begin_datetime DESC,ds.id DESC");
      return xml;
    }
  );

  return xml;
}

//下層_お客様の声
function underpage_voice(column, url, pagename) {
  const ss_ws_flex = get_sheet("ライティングシート (可変)");
  const writings = ss_ws_flex.getRange(7, column, 134, 1).getValues().flat();
  const ttl_en = url[0].toUpperCase() + url.slice(1);

  let xml = "<!--ここから下層_お客様の声-->";

  xml += make_page_with_directory({
    parent: "1830",
    code: "voice",
    url: url,
    name: pagename,
    layout: "129",
    auth_user: "",
    auth_pw: "",
    on_sitemap: "1",
    is_dummy: "",
    parent_path: "",
    h4seo: writings[0],
    h4seo_mode: "input",
    h4seo_title_inherit_order: "ignore",
    keyword_1: "",
    keyword_2: "",
    title: "",
    title_inherit_order: "before",
    title_mode: "same_name",
    description: writings[2],
    one_phrase: "",
  });

  //レイアウト
  xml += parts(
    { column: "T", key: "mv", parent: ["129.layout.layout"] },
    function () {
      //T:下層_MV
      const makexml = get_sheet("makexml");
      const mvtype = makexml.getRange("E16").getValue();

      let xml = "";
      xml += v("ttl_en", ttl_en);
      xml += v("ttl_jp", pagename);
      if (
        mvtype != "下層_MV_3" &&
        mvtype != "下層_MV_14" &&
        mvtype != "下層_MV_17"
      ) {
        xml += img("bg_image", "under_mv");
      }
      xml += v("position", "50% 0");
      xml += v("position_y", "center center");
      xml += v("reverse", "");
      return xml;
    }
  );
  xml += parts(
    { column: "G", key: "mv", parent: ["129.layout.layout"] },
    function () {
      //パンくず
      return "";
    }
  );
  xml += parts(
    { column: "U", key: "main", parent: ["129.layout.layout"] },
    function () {
      //共通見出し＋本文
      let xml = "";
      xml += v("ttl_en", "");
      xml += v("h2_ttl", writings[1]);
      xml += richtext("text", writings[2]);
      xml += v("css_id", "");
      xml += v("css_class", "");
      return xml;
    }
  );

  xml += parts(
    { column: "Y", key: "main", parent: ["129.layout.layout"] },
    function () {
      //下層お客様の声
      let xml = "";
      xml += v("css_id", "");
      xml += v("css_class", "");
      xml += v("count", "10");
      xml += v("order", "ds.priority ASC,ds.id ASC");
      xml += v("image_off", "0");
      return xml;
    }
  );

  return xml;
}

function underpage_flow(column, url, pagename) {
  const ss_ws_flex = get_sheet("ライティングシート (可変)");
  const writings = ss_ws_flex.getRange(7, column, 134, 1).getValues().flat();

  let xml = "<!--ここから下層_フロー-->";
  xml += make_page(
    {
      url: "/" + url + "/",
      page_name: pagename,
      layout: "42",
      auth_user: "",
      auth_pw: "",
      on_sitemap: "1",
      is_dummy: "",
      parent_path: "",
      h4seo: writings[0],
      keyword_1: "",
      keyword_2: "",
      title: "",
      title_mode: "same_name",
      description: writings[2],
      one_phrase: "",
    },
    function () {
      const ttl_en = url[0].toUpperCase() + url.slice(1);
      let xml = "";

      xml += mv_parts(ttl_en, pagename); //下層MV
      xml += parts({ column: "U", key: "main" }, function () {
        //共通見出し＋本文
        let xml = "";
        xml += v("ttl_en", "");
        xml += v("h2_ttl", writings[1]);
        xml += richtext("text", writings[2]);
        xml += v("css_id", "");
        xml += v("css_class", "");
        return xml;
      });

      xml += parts({ column: "AR", key: "main" }, function () {
        //下層_流れ
        let xml = "";
        xml += v("css_id", "");
        xml += v("css_class", "");
        xml += v("h_ttl", "");
        xml += v("h_ttl2", "");
        xml += v("h_ttl3", "");
        xml += richtext("text", "");
        xml += '<child key="contents">\n';
        for (let i = 0; i < 124; i = i + 2) {
          if (writings[3 + i] == "" && writings[3 + i] == "") {
            continue;
          }
          xml += fieldset("cms", "contents", function () {
            let xml = "";
            xml += img("image", "under");
            xml += v("h3_ttl", writings[3 + i]);
            xml += richtext("text", writings[4 + i]);
            return xml;
          });
        }
        xml += "</child>\n";
        return xml;
      });

      return xml;
    }
  );

  return xml;
}

//下層求人一覧
function underpage_recruit(column, url, pagename) {
  const ss_ws_flex = get_sheet("ライティングシート (可変)");
  const writings = ss_ws_flex.getRange(7, column, 134, 1).getValues().flat();
  const ttl_en = url[0].toUpperCase() + url.slice(1);
  //const layout = ['102', '176', '177'];
  //const directory_number = count == 0 ? '' : count + 1;

  let xml = "<!--ここから下層_求人一覧-->";

  xml += make_page_with_directory({
    parent: "1822", // /_sys/setting/directory/group/1822/
    code: "recruit",
    url: url,
    name: pagename,
    layout: "187",
    auth_user: "",
    auth_pw: "",
    on_sitemap: "1",
    is_dummy: "",
    parent_path: "",
    h4seo: writings[0],
    h4seo_mode: "input",
    h4seo_title_inherit_order: "ignore",
    keyword_1: "",
    keyword_2: "",
    title: "",
    title_inherit_order: "before",
    title_mode: "same_name",
    description: writings[2],
    one_phrase: "",
  });

  //レイアウト
  xml += parts(
    { column: "T", key: "mv", parent: ["187.layout.layout"] },
    function () {
      //T:下層_MV
      const makexml = get_sheet("makexml");
      const mvtype = makexml.getRange("E16").getValue();

      let xml = "";
      xml += v("ttl_en", ttl_en);
      xml += v("ttl_jp", pagename);
      if (
        mvtype != "下層_MV_3" &&
        mvtype != "下層_MV_14" &&
        mvtype != "下層_MV_17"
      ) {
        xml += img("bg_image", "under_mv");
      }
      xml += v("position", "50% 0");
      xml += v("position_y", "center center");
      xml += v("reverse", "");
      return xml;
    }
  );
  xml += parts(
    { column: "G", key: "mv", parent: ["187.layout.layout"] },
    function () {
      //パンくず
      return "";
    }
  );
  xml += parts(
    { column: "U", key: "main", parent: ["187.layout.layout"] },
    function () {
      //共通見出し＋本文
      let xml = "";
      xml += v("ttl_en", "");
      xml += v("h2_ttl", writings[1]);
      xml += richtext("text", writings[2]);
      xml += v("css_id", "");
      xml += v("css_class", "");
      return xml;
    }
  );

  /* xml += parts({ column: 'AD', key: 'main', parent: ['187.layout.layout'] }, function () { //下層求人一覧？
    let xml = '';
    xml += v('css_id', '');
    xml += v('css_class', '');
    xml += v('h_ttl', '');
    xml += v('h_ttl2', '');
    xml += v('h_ttl3', '');
    xml += v('href', '');
    xml += v('link_text', '');
    xml += v('order', 'ds.priority ASC,ds.id ASC');
    xml += v('article_code', 'menu');
    xml += '<child key="contents">\n';
    xml += fieldset('cms', 'contents', function () {
      let xml = '';
      xml += richtext('text', '');
      xml += v('tag', 'メニュー1');
      xml += v('count', '100');
      xml += img('image', '');
      xml += img('image01', '');
      xml += img('image02', '');
      xml += img('image03', '');
      return xml;
    });
    xml += '</child>\n';
    xml += v('target', '');
    xml += v('bg_color', '0');

    return xml;
  }); */

  return xml;
}

function underpage_contact() {
  const ss_ws_flex = get_sheet("ライティングシート (可変)");
  const ss_makexml = get_sheet("makexml");
  let writings = "";
  const is_ai = ss_makexml.getRange("E7").getValue();
  if (is_ai == "あり") {
    writings = ss_ws_flex.getRange("AK7:AK9").getValues().flat();
  } else {
    writings = ss_ws_flex.getRange("AD7:AD9").getValues().flat();
  }

  let xml = "<!--ここから下層_お問い合わせ-->";

  xml += parts(
    { column: "Q", key: "main", parent: ["45.layout.layout"] },
    function () {
      //お問い合わせバナー
      let xml = "";
      xml += v("code", "contact");
      xml += v("ttl_en", "Contact");
      xml += v("h_ttl", writings[1]);
      xml += richtext("input_text", writings[2]);
      xml += richtext(
        "confirm_text",
        '<p style="text-align: center;">入力内容を確認し、送信ボタンをクリックしてください。</p>\n\
<p style="text-align: center;">入力内容を修正する場合は、戻るボタンをクリックしてください。</p>'
      );
      xml += richtext(
        "complete_text",
        '<p style="text-align: center;">この度はお問い合わせ頂き、ありがとうございます。</p>\n\
<p style="text-align: center;">内容を確認の上、担当者よりご連絡差し上げますので、今しばらくお待ちください。</p>'
      );
      xml += v("css_id", "");
      xml += v("href_link", "/privacypolicy/");
      return xml;
    }
  );

  xml += set_page_meta(15, 197, function () {
    let xml = "";
    xml += v("title", "");
    xml += v("title_inherit_order", "before");
    xml += v("title_mode", "same_name");
    xml += v("canonical", "");
    xml += v("canonical_type");
    xml += v("robots", "");
    xml += v("description", writings[2]);
    xml += v("h4seo", writings[0]);
    xml += v("h4seo_mode", "input");
    xml += v("h4seo_title_inherit_order", "ignore");
    xml += v("keyword_1", "");
    xml += v("keyword_2", "");
    xml += v("keyword_3", "");
    xml += v("keyword_4", "");
    xml += v("keyword_inherit", "1");
    xml += v("one_phrase", "");
    return xml;
  });

  return xml;
}

//下層_プライバシーポリシー
function underpage_privacy() {
  let xml = make_page(
    {
      url: "/privacypolicy/",
      page_name: "プライバシーポリシー",
      layout: "42",
      auth_user: "",
      auth_pw: "",
      on_sitemap: "1",
      analysis: "0",
      is_dummy: "",
      parent_path: "",
      h4seo: "プライバシーポリシー",
      description: "プライバシーポリシーを掲載しております",
      keyword_1: "",
      keyword_2: "",
      title: "",
      title_mode: "same_name",
      one_phrase: "",
    },
    function () {
      let xml = "";
      xml += mv_parts("Privacy Policy", "プライバシーポリシー"); //下層MV
      xml += parts({ column: "AC", key: "main" }, function () {
        //プライバシーポリシー
        let xml = "";
        xml += v("css_id", "");
        xml += v("css_class", "");
        xml += v("h3_ttl", "プライバシーポリシー");
        xml += v("name_set", "「個人情報の取り扱いについて」");

        return xml;
      });
      return xml;
    }
  );
  return xml;
}

//下層_サイトマップ
function underpage_sitemap() {
  let xml = make_page(
    {
      url: "/sitemap/",
      page_name: "サイトマップ",
      layout: "42",
      auth_user: "",
      auth_pw: "",
      on_sitemap: "1",
      analysis: "0",
      is_dummy: "",
      parent_path: "",
      h4seo: "サイトマップ",
      description: "サイトマップを掲載しております",
      keyword_1: "",
      keyword_2: "",
      title: "",
      title_mode: "same_name",
      one_phrase: "",
    },
    function () {
      let xml = "";
      xml += mv_parts("Sitemap", "サイトマップ"); //下層MV
      xml += parts({ column: "AB", key: "main" }, function () {
        //サイトマップ
        let xml = "";
        xml += v("css_id", "");
        xml += v("css_class", "");
        xml += v("h3_ttl", "サイトマップ");

        return xml;
      });

      return xml;
    }
  );
  return xml;
}

//下層_アクセス
function underpage_access(column, url, pagename) {
  const ss_ws_flex = get_sheet("ライティングシート (可変)");
  const writings = ss_ws_flex.getRange(7, column, 134, 1).getValues().flat();
  const ttl_en = url[0].toUpperCase() + url.slice(1);

  let xml = "<!--ここから下層_アクセス-->";

  xml += make_page(
    {
      url: "/" + url + "/",
      page_name: pagename,
      layout: "42",
      auth_user: "",
      auth_pw: "",
      on_sitemap: "1",
      is_dummy: "",
      parent_path: "",
      h4seo: writings[0],
      keyword_1: "",
      keyword_2: "",
      title: "",
      description: writings[2],
      title_mode: "same_name",
      one_phrase: "",
    },
    function () {
      let xml = "";
      xml += mv_parts(ttl_en, pagename); //下層MV
      xml += parts({ column: "U", key: "main" }, function () {
        let xml = "";
        xml += v("ttl_en", "");
        xml += v("h2_ttl", writings[1]);
        xml += richtext("text", writings[2]);
        xml += v("css_id", "");
        xml += v("css_class", "");
        return xml;
      });
      xml += parts({ column: "AA", key: "main" }, function () {
        let xml = "";
        xml += v("css_id", "");
        xml += v("css_class", "");
        xml += v("en_ttl", ttl_en);
        xml += v("h2_ttl", pagename);
        xml += v("href", "");
        xml += v("href_text", "");
        xml += v("order", "ds.public_begin_datetime DESC,ds.id DESC");
        xml += v("article_display", "all");
        xml += v("article", "{map:shop_0}");
        return xml;
      });
      xml += parts({ column: "BQ", key: "main" }, function () {
        //TOP_SEOクッション
        let xml = "";
        xml += v("css_id", "");
        xml += v("css_class", "");
        xml += v("h_ttl", "");
        xml += v("h_ttl2", "");
        xml += '<child key="contents">\n';

        for (i = 0; i < 120; i = i + 2) {
          if (writings[3 + i] == "" && writings[4 + i] == "") {
            continue;
          }
          xml += fieldset("cms", "contents", function () {
            let xml = "";
            xml += img("image", "under");
            xml += v("bg_size", "cover");
            xml += v("h3_ttl", writings[3 + i]);
            xml += richtext("text", writings[4 + i]);
            xml += v("href", "");
            xml += v("href_text", "");
            xml += v("fade", "0");
            xml += v("css_class", "");
            xml += v("target", "");
            return xml;
          });
        }
        xml += "</child>\n";
        xml += v("bg_color", "1");
        return xml;
      });
      return xml;
    }
  );
  return xml;
}

//下層_アクセス（複数店舗）
function multiple_stores(row, pagename, count) {
  //count 何番目の店舗か
  const ss_ws_fixed = get_sheet("ライティングシート (固定)");
  // const writings = ss_ws_fixed.getRange(row, 23, 21, 1).getValues().flat();
  // const writings = ss_ws_fixed.getRange(row, 23, 19, 1).getValues().flat();
  const ss_makexml = get_sheet("makexml");
  const links_fixed = ss_makexml.getRange("E44:F52").getValues(); //固定ページ
  let shop_names = []; //店舗

  for (let i = 0; i < 10; i++) {
    const name = ss_makexml.getRange(i + 8, 7).getValue();
    if (name.length > 0) {
      shop_names.push(name);
    }
  }
  console.log("shop_names：", shop_names);
  let xml = "";

  for (let j = 0; j < shop_names.length; j++) {
    let writings = ss_ws_fixed
      .getRange(row + j * 46, 23, 19, 1)
      .getValues()
      .flat();
    console.log("writings" + j + "：", writings);
    xml += make_page(
      {
        url: "/" + pagename + "/" + shop_names[j] + "/",
        // , page_name: pagename
        page_name: shop_names[j],
        layout: "42",
        auth_user: "",
        auth_pw: "",
        on_sitemap: "1",
        is_dummy: "",
        parent_path: "",
        h4seo: writings[1],
        keyword_1: "",
        keyword_2: "",
        title: "",
        title_mode: "same_name",
        description: writings[2],
        one_phrase: "",
      },
      function () {
        let xml = "";
        xml += mv_parts(
          links_fixed[0][1].charAt(0).toUpperCase() +
            links_fixed[0][1].slice(1),
          links_fixed[0][0]
        );
        xml += parts({ column: "U", key: "main" }, function () {
          let xml = "";
          xml += v("ttl_en", "");
          xml += v("h2_ttl", writings[1]);
          console.log("h2_ttl", writings[1]);
          xml += richtext("text", writings[2]);
          console.log("text", writings[2]);
          xml += v("css_id", "");
          xml += v("css_class", "");
          return xml;
        });
        xml += parts({ column: "AA", key: "main" }, function () {
          let xml = "";
          xml += v("css_id", "");
          xml += v("css_class", "");
          xml += v(
            "en_ttl",
            links_fixed[0][1].charAt(0).toUpperCase() +
              links_fixed[0][1].slice(1)
          );
          // xml += v('h2_ttl', name);
          xml += v("h2_ttl", writings[5]);
          xml += v("href", "");
          xml += v("href_text", "");
          xml += v("order", "ds.public_begin_datetime DESC,ds.id DESC");
          xml += v("article_display", "select");
          xml += v("article", "{map:shop_" + count + "}");
          return xml;
        });
        xml += parts({ column: "BQ", key: "main" }, function () {
          let xml = "";
          xml += v("css_id", "");
          xml += v("css_class", "");
          xml += v("h_ttl", "Feature");
          xml += v("h_ttl2", "特徴");
          xml += '<child key="contents">\n';
          for (i = 3; i < writings.length; i = i + 2) {
            if (writings[i] == "") {
              continue;
            }
            xml += fieldset("cms", "contents", function () {
              let xml = "";
              xml += img("image", "under");
              xml += v("bg_size", "cover");
              xml += v("h3_ttl", writings[i]);
              // xml += v('h3_ttl', writings[7]);
              xml += richtext("text", writings[i + 1]);
              // xml += richtext('text', writings[8]);
              xml += v("href", "");
              xml += v("href_text", "");
              xml += v("fade", "0");
              xml += v("css_class", "");
              xml += v("target", "");
              return xml;
            });
          }
          xml += "</child>\n";
          xml += v("bg_color", "1");
          return xml;
        });
        return xml;
      }
    );
  }
  return xml;
}
