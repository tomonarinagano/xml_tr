function make_ss_hinshitsu() {
  const ss_makexml = get_sheet("makexml");
  const mode = ss_makexml.getRange("B48").getValue();
  const ss_csv = get_sheet("csv");
  const ss_tempo = get_sheet("店舗情報");
  const proposal_number = ss_csv.getRange("B2").getValue().trim();
  const proposal_name = ss_csv.getRange("D2").getValue().trim();

  let seisaku_type = ss_csv.getRange("L2").getValue().trim();
  let new_hinshitsu_ss;
  let url_hinshitsu = "";

  if (mode == "新規作成") {
    const ss_original = SpreadsheetApp.openById(
      "1ByzX8SzNLC9uZ4_smHdqNY5aLbfjTfqgPHaOsw8FiC4"
    ); //雛形のスプレッドシート
    new_hinshitsu_ss = ss_original.copy(
      "【" + proposal_number + "_" + proposal_name + "】" + "品質チェックシート"
    );
    url_hinshitsu = new_hinshitsu_ss.getUrl();
  } else if (mode == "既存のシートに転記") {
    const url = ss_makexml.getRange("C48").getValue();
    url_hinshitsu = ss_makexml.getRange("C48").getValue();
    new_hinshitsu_ss = SpreadsheetApp.openByUrl(url);
  }

  let domain = "";
  if (seisaku_type == "リニューアル") {
    domain = ss_csv.getRange("P2").getValue().trim();
  } else {
    domain = ss_csv.getRange("O2").getValue().trim();
  }
  domain = extractDomain(domain);
  const id = domain.split(".")[0];
  const pass1 = ss_makexml.getRange("E10").getValue().trim();
  let tel = ss_tempo.getRange("C6").getValue();

  if (!containsNumber(tel)) {
    tel = "000-0000-0000";
  }

  const pass2 = tel.replace(/‐|-|ー/g, "").replace(/\s+/g, "");

  const ss_hinshitsu = new_hinshitsu_ss.getSheetByName("品質チェックシート");
  const ss_anken = new_hinshitsu_ss.getSheetByName("案件情報");
  const url_product = "https://" + domain + "/";

  ss_hinshitsu.getRange("E2").setValue(proposal_name);
  ss_hinshitsu.getRange("E3").setValue(url_product);
  if (seisaku_type == "リニューアル") {
    const default_comment = ss_hinshitsu.getRange("E4").getValue();
    const comment =
      '・「property = "og:image"」と「property = "og:image:secure_url"」に画像が表示されておりませんがリニューアル案件のため、公開後に公開ドメインと一致し、問題なく表示されます。';
    ss_hinshitsu.getRange("E4").setValue(comment + "\n\n" + default_comment);
  }

  ss_anken.getRange("E4").setValue(proposal_name);
  ss_anken.getRange("E5").setValue(proposal_number);
  ss_anken.getRange("E9").setValue(id);
  ss_anken.getRange("E6").setValue(domain);
  ss_anken.getRange("E7").setValue(url_product);
  ss_anken.getRange("E8").setValue(url_product + "_sys/");
  ss_anken.getRange("J9").setValue(pass1);
  ss_anken.getRange("J10").setNumberFormat("@");
  ss_anken.getRange("J10").setValue(pass2);

  assignSingleEditor(new_hinshitsu_ss); //編集権限付与

  /*   const id_folder_asteer = '1JK2J93Safqx8ILA0nChT0eIuJ5N_BtLk';
    const folder_asteer = DriveApp.getFolderById(id_folder_asteer);
  
    const ss_id = new_hinshitsu_ss.getId();
    const file = DriveApp.getFileById(ss_id);
    file.moveTo(folder_asteer); */

  //品質チェックシートを開く
  const sheetId = ss_hinshitsu.getSheetId();
  url_hinshitsu = url_hinshitsu + "#gid=" + sheetId;
  ss_makexml.getRange("B50").setValue(url_hinshitsu);
}
function containsNumber(str) {
  return /\d/.test(str);
}
