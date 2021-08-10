//トップレベルのスクリプト。アプリじゃなくて、KINTONEのトップレベルに入れる事
//Customizing Kintone System-Wide
//https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css

var cpicker;
var elements;
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
  会社カレンダー: "#f75050",
  その他: "#bfff00",
};
function getColor(category_name) {
  console.log(category_name);
  return localStorage.getItem(category_name)
    ? localStorage.getItem(category_name)
    : selectColor[category_name];
}
function displayCats() {
  var catar = kintone.app.getFieldElements("category_dd");
  for (i = 0; i < catar?.length; i++) {
    catar[i].style.backgroundColor = getColor(catar[i].innerText);
  }
}
kintone.events.on(
  [
    "app.record.create.show",
    "app.record.edit.show",
    "app.record.detail.show",
    "app.record.index.edit.submit.success",
    "app.record.edit.change.category_dd",
    "app.record.create.change.category_dd",
  ],
  function (event) {
    elements = event;
    console.log(event.type);
    category_id = getFieldCodeID("category_dd");

    if (
      event.type == "app.record.edit.show" ||
      event.type == "app.record.detail.show"
    ) {
      addUIAction();
      addColorPicker(event.record.category_dd.value);
    } else if (event.type == "app.record.index.edit.submit.success") {
      setTimeout(() => {
        displayCats();
      }, 500);
    } else if (
      event.type == "app.record.edit.change.category_dd" ||
      event.type == "app.record.create.change.category_dd"
    ) {
      if (cpicker != undefined) {
        cpicker.value = getColor(event.record.category_dd.value);
      }

      if(event.record.category_dd.value=="会社カレンダー"){
        //check if the user has rights
        if(cybozu.data.FOR_SLASH_ADMINISTRATOR){
          //all good
        }else {
          alert("別のカテゴリーにして下さい");
          $(".gaia-ui-actionmenu-save").hide();
        }
      }else{
        $(".gaia-ui-actionmenu-save").show();
      }
    } else if (event.type == "app.record.create.show") {
      kelement = event;
      addUIAction();
      ///*Set enddate equal to the startdate*/
      setEndDate();
      addColorPicker();
      ///
    }
  }
);

function controlHolidayInput(x){
  if(x){
    $(".field-"+getFieldCodeID("holiday_radio")).show();
  }
  else{
    $(".field-"+getFieldCodeID("holiday_radio")).hide();
  }
}

function addUIAction() {
  //if ALL DAY cb is checked, DISABLE enddate and time
  //DISABLED enddate
  $(".value-" + getFieldCodeID("allday_cb") + " div span input").on(
    "click",
    function () {
      setInputValues(getFieldCodeID("end_date"), this.checked);
    }
  );
  setInputValues(
    getFieldCodeID("end_date"),
    $(".value-" + getFieldCodeID("allday_cb") + " div span input")[0]?.checked
  );
  controlHolidayInput(cybozu.data.FOR_SLASH_ADMINISTRATOR);
}
function setEndDate() {
  //THIS MUST BE CHECKED
  if(elements.record.start_date.value){
    var d = new Date(Date.parse(elements.record.start_date.value) + 3600000);
    if (navigator.language == "en-US") {
      edate = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(d);
      etime = new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h24",
      }).format(d);
    } else {
      edate = new Intl.DateTimeFormat("uz", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(d);
      etime = new Intl.DateTimeFormat("uz", {
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h24",
      }).format(d);
    }

    $(
      ".value-" + getFieldCodeID("end_date") + " input.input-date-text-cybozu"
    )[0].value = edate;
    $(
      ".value-" + getFieldCodeID("end_date") + " input.input-time-text-cybozu"
    )[0].value = etime;
  }
  
}
function addColorPicker(category_item) {
  if ($(".gaia-argoui-app-menu-edit").length == 0) return;

  cp_edit = document.createElement("div");
  cp_edit.id = "cp_edit";
  cp_edit.setAttribute("style", "display: flex;");

  div_button_box = document.createElement("div");
  div_button_box.id = "btnbox";

  cp_clear_txt = document.createElement("p");
  cp_clear_txt.id = "cp_clear_txt";
  cp_clear_txt.innerText = "clear";

  icon_revert = document.createElement("i");
  icon_revert.setAttribute("class", "fa fa-folder");

  icon_revert2 = document.createElement("i");
  icon_revert2.setAttribute("class", "fa fa-file");

  cp_clear_one = document.createElement("button");
  cp_clear_one.id = "clear_one";
  cp_clear_one.setAttribute("class", "btn");
  cp_clear_one.addEventListener("click", watchTrashAction, false);
  cp_clear_all = document.createElement("button");
  cp_clear_all.id = "clear_two";
  cp_clear_all.setAttribute("class", "btn");
  cp_clear_all.addEventListener("click", watchTrashAction, false);

  div_button_box.append(cp_clear_txt);
  div_button_box.append(cp_clear_one);
  div_button_box.append(cp_clear_all);

  cp_clear_one.append(icon_revert);
  cp_clear_all.append(icon_revert2);

  cp_edit.append(div_button_box);

  //<input type="color" id="html5colorpicker" onchange="clickColor(0, -1, -1, 5)" value="#ff0000" style="width: 30px;height: 30px;">
  cpicker = document.createElement("input");
  cpicker.id = "html5colorpicker";
  cpicker.type = "color";
  //cpicker.setAttribute("onchange", "clickColor(0, -1, -1, 5)");
  cpicker.value = getColor(category_item);
  cpicker.setAttribute("style", "width:174px; height:25px;");
  cpicker.addEventListener("change", watchColorPicker, false);
  //now add the element at the right place
  cp_edit.append(cpicker);
  $(".field-" + getFieldCodeID("category_dd"))[0]?.append(cp_edit);

  setButtonStates(category_item);
}
function watchColorPicker() {
  cpicker.value = event.target.value;
  localStorage.setItem(elements.record.category_dd.value, cpicker.value);
  console.log("saving color " + cpicker.value);
  setButtonStates(elements.record.category_dd.value);
}
function watchTrashAction() {
  if (this.id == "clear_one") {
    for (i in selectColor) {
      localStorage.removeItem(i);
    }
  } else if (this.id == "clear_two") {
    localStorage.removeItem(elements.record.category_dd.value);
  }
  setButtonStates(elements.record.category_dd.value);
}
function setButtonStates(category_item) {
  if (localStorage.getItem(category_item)) {
    $("#clear_two").prop("disabled", false);
    $("#clear_one").prop("disabled", false);
  } else if (
    localStorage.getItem(category_item) == null &&
    anyColorsInMemory()
  ) {
    $("#clear_two").prop("disabled", true);
    $("#clear_one").prop("disabled", false);
  } else if (
    localStorage.getItem(category_item) == null &&
    !anyColorsInMemory()
  ) {
    $("#clear_two").prop("disabled", true);
    $("#clear_one").prop("disabled", true);
  }
  cpicker.value = getColor(elements.record.category_dd.value);
}
function anyColorsInMemory() {
  for (i in selectColor) {
    if (localStorage.getItem(i)) {
      return true;
    }
  }
  return false;
}

function setInputValues(enddate_id, bool) {
  console.log(this.checked);
  if (bool) {
    //set the enddate value and state

    document
      .querySelectorAll(
        ".control-value-gaia.value-" + enddate_id + " div input"
      )
      ?.forEach((i) => {
        i.value = "";
        i.disabled = true;
        //console.log(i);
      });
  } else {
    document
      .querySelectorAll(
        ".control-value-gaia.value-" + enddate_id + " div input"
      )
      ?.forEach((i) => {
        i.disabled = false;
        //console.log(i);
      });
  }
}
function getFieldCodeID(fc) {
  var retval = null;
  for (item in cybozu.data.page.FORM_DATA.schema.table.fieldList) {
    if (cybozu.data.page.FORM_DATA.schema.table.fieldList[item].var == fc) {
      //allday_cb フィールドコード IDを見つけた
      retval = item;
      break;
    }
  }
  return retval;
}
