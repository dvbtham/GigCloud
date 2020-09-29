$(document).ready(function () {
  const inputDate = $('.datetimepicker');

  if (inputDate) {
    inputDate.datetimepicker({ format: 'MM/DD/YYYY HH:mm' });
    inputDate.on('keydown', () => {
      return false;
    });
  }

  // $.getJSON("/api/notifications", function (notifications) {
  //     $(".js-notifications-count")
  //         .text(notifications.length)
  //         .removeClass("hide")
  //         .addClass("animated bounceInDown");

  //     $(".notifications").popover({
  //         html: true,
  //         title: "Notifications",
  //         content: function () {
  //             var complied = _.template($("#notifications-template").html());
  //             return complied({ notifications: notifications });
  //         },
  //         placement: "bottom",
  //         template: '<div class="popover popover-notifications" role="tooltip"><div class="arrow"></div><h2 class="popover-title"></h2><div class="popover-content"></div></div>'
  //     }).on('shown.bs.popover', function () {
  //         $.post("/api/notifications/markAsRead")
  //             .done(function () {
  //                 $(".js-notifications-count").text("").addClass("hide");
  //             })
  //     });
  // });
});
