//トップレベルのスクリプト。アプリじゃなくて、KINTONEのトップレベルに入れる事
//Customizing Kintone System-Wide

selectColor = {
  "営業 (訪問)": "#ff0000",
  "営業（訪問）": "#ff0000",
  "営業 (Web)": "#ff0080",
  "営業（Web）": "#ff0080",
  "社員面談 (訪問)": "#bf00ff",
  "社員面談（訪問）": "#bf00ff",
  "社員面談 (Web)": "#4000ff",
  "社員面談（Web）": "#4000ff",
  面接: "#00bfff",
  説明会: "#00ffff",
  社内会議: "#00ff80",
  業者打合せ: "#40ff00",
  来客: "#ffbf00",
  出張: "#ff8000",
  配属: "#ff4000",
  在宅: "#bf00ff",
  有給休暇: "#00ff80",
  その他: "#bfff00",
};
function setColor(category_name){
  return localStorage.getItem(category_name) ? localStorage.getItem(category_name) : selectColor[category_name];
}
kintone.events.on(
  ["app.record.create.show", "app.record.edit.show", "app.record.detail.show", "app.record.index.edit.submit.success"],
  function (event) {
    //kintone.app.record.setFieldShown('Text', false);
    elements = event;
    var allday_id = getAllDayFCodeID();
    var enddate_id = getEndDateFCID();

    setCategoryColor();

    $(".control-value-gaia.value-" + allday_id + " div span input").on(
      "click",
      function () {
        setInputValues(enddate_id, this.checked);
      }
    );
    //alert(event);
    setInputValues(
      enddate_id,
      $(".control-value-gaia.value-" + allday_id + " div span input")[0]?.checked
    );
  }
);
function setCategoryColor() {
  var category_id;
  for (item in cybozu.data.page.FORM_DATA.schema.table.fieldList) {
    if (
      cybozu.data.page.FORM_DATA.schema.table.fieldList[item].var ==
      //カテゴリーのフィールドコード名
      "category_dd"
    ) {
      //we found the category_dd fieldcode ID
      category_id = item;
      category_item = document.querySelectorAll(".value-" + item + " span")[0]?.innerText;
      // document
      //   .querySelectorAll(".value-" + item)[0]?.setAttribute(
      //     "style",
      //     "background-color:" + selectColor[category_item] + "!important;"
      //   );
      break;
    }
  }
  //<input type="color" id="html5colorpicker" onchange="clickColor(0, -1, -1, 5)" value="#ff0000" style="width: 30px;height: 30px;">
  var cpicker = document.createElement("input");
  cpicker.id = "html5colorpicker";
  cpicker.type = "color";
  //cpicker.setAttribute("onchange", "clickColor(0, -1, -1, 5)");
  cpicker.value = setColor(category_item);
  cpicker.setAttribute("style", "width:174px; height:20px;");
  cpicker.addEventListener("change", watchColorPicker, false);
  //now add the element at the right place
  $(".field-"+category_id)[0]?.append(cpicker);
  
  function watchColorPicker(event) {    
    //cpicker.value = event.target.value;
    localStorage.setItem(category_item, event.target.value);  
  }
}

function setInputValues(enddate_id, bool) {
  console.log(this.checked);
  if (bool) {
    //set the enddate value and state

    document
      .querySelectorAll(
        ".control-value-gaia.value-" + enddate_id + " div input"
      )?.forEach((i) => {
        i.value = "";
        i.disabled = true;
        //console.log(i);
      });
  } else {
    document
      .querySelectorAll(
        ".control-value-gaia.value-" + enddate_id + " div input"
      )?.forEach((i) => {
        i.disabled = false;
        //console.log(i);
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
