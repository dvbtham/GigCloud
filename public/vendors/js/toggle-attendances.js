
var AttendanceController = function () {
    var button;
    var init = function () {
        $('.js-toggle-attendance').click(attendancesToggle);
    };
    var attendancesToggle = function (e) {
        e.preventDefault();
        button = $(e.target);
        $.post("/api/attendances", { gigId: button.attr("data-gig-id"), userId: $('#uid').val() })
            .done(done)
            .fail(failed);
    };
    var failed = function (res) {
        toastr.error(res.responseJSON);
    };
    var done = function (res) {
        var text = (button.text() == "Going") ? "Going?" : "Going";
        button.toggleClass("btn-info").toggleClass("btn-default").text(text);
    };
    return {
        init: init
    };
}();

AttendanceController.init();
