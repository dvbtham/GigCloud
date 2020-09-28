var FollowingController = function () {
    var button;
    var init = function () {
        $('.js-toggle-following').click(toggleFollowing);
    };

    var toggleFollowing = function (e) {
        e.preventDefault();
        const userId = $('#uid').val();
        if(userId === '' || !userId) {
            toastr.error('Login to follow the gig.');
            return;
        }
        button = $(e.target);

        $.post("/api/followings", {
                followeeId: button.attr("data-following-id"),
                userId: userId,
            }
        ).done(done).fail(failed);
    };
    var done = function (res) {
        //console.log(res); return;
        var text = (button.text() == "Following") ? "Follow" : "Following";
        button.toggleClass("btn-info").toggleClass("btn-default").text(text);
    };

    var failed = function (res) {
        console.log(res); //return;
        toastr.error(res.responseJSON.Message);
    };
    return {
        init: init
    }
}();

FollowingController.init();
