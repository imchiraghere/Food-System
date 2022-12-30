$(document).ready(function () {
  $.getJSON("http://localhost:3000/food/fetchfoodtype", function (data) {
    console.log(data);
    data.result.map((item) => {
      $("#type").append($("<option>").text(item.typename).val(item.typeid));
    });
  });

  ///////////////------------> Food Items <----------------\\\\\\\\\\\\\\\\\\

  $("#type").change(function () {
    $.getJSON(
      "http://localhost:3000/food/fetchfooditem",
      { typeid: $("#type").val() },
      function (data) {
        // console.log(data);
        $("#item").empty();
        $("#item").append($("<option>").text("Choose Item..."));
        data.data.map((it) => {
          $("#item").append($("<option>").text(it.itemname));
        });
      }
    );
  });
});

$(document).ready(function () {
  ////////////////// -------> Offer Type <--------------\\\\\\\\\\\

  $.getJSON("http://localhost:3000/food/fetchofftype", function (data) {
    console.log(data);
    data.result.map((item) => {
      $("#offertype").append(
        $("<option>").text(item.offtypename).val(item.offtypeid)
      );
    });
  });

  //////////////////// -----------> Offer <----------\\\\\\\

  $("#offertype").change(function () {
    $.getJSON(
      "http://localhost:3000/food/fetchoffer",
      { offtypeid: $("#offertype").val() },
      function (data) {
        console.log(data);
        $("#offer").empty();
        $("#offer").append($("<option>").text("Choose Offer..."));
        data.data.map((it) => {
          $("#offer").append($("<option>").text(it.offname));
        });
      }
    );
  });
});
