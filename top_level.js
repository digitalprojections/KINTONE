//トップレベルのスクリプト。アプリじゃなくて、KINTONEのトップレベルに入れる事
//Customizing Kintone System-Wide
kintone.events.on("app.record.detail.show", function (event) {
  //kintone.app.record.setFieldShown('Text', false);
  elements = event;
  var retval = "0";
  for (item in cybozu.data.page.FORM_DATA.schema.table.fieldList) {
    if (
      cybozu.data.page.FORM_DATA.schema.table.fieldList[item].var ==
      //カテゴリーのフィールドコード名
      "category_dd"
    ) {
      //we found the category_dd fieldcode ID
      retval = item;
      document
        .querySelectorAll(".value-" + item)[0]
        .setAttribute(
          "style",
          "background-color:" +
            selectColor[
              document.querySelectorAll(".value-" + item + ">span")[0].innerText
            ] +
            "!important; color:white;"
        );
      break;
    }
  }
  //alert(event);
});
kintone.events.on("app.record.create.show", function (event) {
  //kintone.app.record.setFieldShown('Text', false);
  elements = event;
  var allday_id = getAllDayFCodeID();
  $(".control-value-gaia.value-"+allday_id+" div span input").on(
    "click",
    function () {
      console.log(this.checked);
    }
  );
  //alert(event);
});
kintone.events.on("space.portal.show", function () {
  var el = kintone.space.portal.getContentSpaceElement();
  el.textContent = "Hello Kintone!";
});

function getAllDayFCodeID() {
  var retval = "0";
  for (item in cybozu.data.page.FORM_DATA.schema.table.fieldList) {
    if (
      cybozu.data.page.FORM_DATA.schema.table.fieldList[item].var == "allday_cb"
    ) {
      //allday_cb フィールドコード IDを見つけた
      retval = item;
      break;
    }
  }
  return retval;
}
