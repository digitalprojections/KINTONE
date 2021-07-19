kintone.events.on("app.record.detail.show", function (event) {
  //kintone.app.record.setFieldShown('Text', false);
  elements = event;
    var retval = "0";
    for (item in cybozu.data.page.FORM_DATA.schema.table.fieldList) {
      if (
        cybozu.data.page.FORM_DATA.schema.table.fieldList[item].var ==
        "category_dd"
      ) {
        //we found the category_dd fieldcode ID
        retval = item;
        document
          .querySelectorAll(".value-"+item)[0]
          .setAttribute(
            "style",
            "background-color:" +
              selectColor[
                document.querySelectorAll(".value-"+item+">span")[0].innerText
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
  //alert(event);
});
kintone.events.on("space.portal.show", function () {
  var el = kintone.space.portal.getContentSpaceElement();
  el.textContent = "Hello Kintone!";
});
