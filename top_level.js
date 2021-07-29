//トップレベルのスクリプト。アプリじゃなくて、KINTONEのトップレベルに入れる事
//Customizing Kintone System-Wide

selectColor = {
  "営業 (訪問)": "crimson",
  "営業（訪問）": "crimson",
  "営業 (Web)": "cyan",
  "営業（Web）": "cyan",
  "社員面談 (訪問)": "coral",
  "社員面談（訪問）": "coral",
  "社員面談 (Web)": "blue",
  "社員面談（Web）": "blue",
  面接: "navy",
  説明会: "teal",
  社内会議: "lightseagreen",
  業者打合せ: "lime",
  来客: "aqua",
  出張: "deeppink",
  配属: "red",
  在宅: "fuchsia",
  有給休暇: "olive",
  その他: "purple",
};

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
      category_item = document.querySelectorAll(".value-" + item + ">span")[0]
        .innerText;
      document
        .querySelectorAll(".value-" + item)[0]
        .setAttribute(
          "style",
          "background-color:" + selectColor[category_item] + "!important;"
        );
      break;
    }
  }
  //alert(event);
});
kintone.events.on(
  ["app.record.create.show", "app.record.edit.show"],
  function (event) {
    //kintone.app.record.setFieldShown('Text', false);
    elements = event;
    var allday_id = getAllDayFCodeID();
    var enddate_id = getEndDateFCID();
    
    $(".control-value-gaia.value-" + allday_id + " div span input").on(
      "click",
      function(){setInputValues(enddate_id, this.checked);}
    );
    //alert(event);
    //<input type="color" id="html5colorpicker" onchange="clickColor(0, -1, -1, 5)" value="#ff0000" style="width: 30px;height: 30px;">
    var cpicker = document.createElement("input");
    cpicker.id="html5colorpicker";
    cpicker.setAttribute("onchange","clickColor(0, -1, -1, 5)");
    cpicker.value = "#ff0000";
    cpicker.setAttribute("style","width:174px; height:20px;");
    
    setInputValues(enddate_id, $(".control-value-gaia.value-" + allday_id + " div span input")[0].checked);
  });

  function setInputValues (enddate_id, bool) {
    console.log(this.checked);
    if (bool) {
      //set the enddate value and state

      document
        .querySelectorAll(".control-value-gaia.value-"+enddate_id+" div input")
        .forEach((i) => {
          i.value = "";
          i.disabled = true;
          console.log(i);
        });
    }else{
      document
        .querySelectorAll(".control-value-gaia.value-"+enddate_id+" div input")
        .forEach((i) => {
          i.disabled = false;
          console.log(i);
        });
    }
  }
kintone.events.on("space.portal.show", function () {
  var el = kintone.space.portal.getContentSpaceElement();
  el.textContent = "Hello Kintone!";
});
function getEndDateFCID() {
  var retval;
  for (item in cybozu.data.page.FORM_DATA.schema.table.fieldList) {
    if (
      cybozu.data.page.FORM_DATA.schema.table.fieldList[item].var == "end_date"
    ) {
      //allday_cb フィールドコード IDを見つけた
      retval = item;
      break;
    }
  }
  return retval;
}
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
