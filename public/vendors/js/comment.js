var SaveResultController = (function () {

    var failed = function (res) {
        console.log(res);
        if (res.status === 400) {
            $('.my-alert').html('');
            for (var error in res.responseJSON.errors) {
                for (let index = 0; index < res.responseJSON.errors[error].length; index++) {
                    const element = res.responseJSON.errors[error][index];
                    $('.my-alert').append(`<p class="alert alert-danger">${element}</p>`);
                }
            }
        }
        else {
            $('.my-alert').html(`<p class="alert alert-danger">An error occurred while adding your comment.</p>`);
        }
        localStorage.removeItem('name');
        localStorage.removeItem('email');
    };

    var done = function (res) {
        console.log(res);
        localStorage.setItem('name', res.name);
        localStorage.setItem('email', res.email);
        const elToRemove = $('.is-remove');
        if (elToRemove)
            elToRemove.remove();
        window.location.reload();
    };

    var replyFailed = function (res) {
        console.log(res);
        if (res.status === 400) {
            $('.reply-alert').html('');
            for (var error in res.responseJSON.errors) {
                for (let index = 0; index < res.responseJSON.errors[error].length; index++) {
                    const element = res.responseJSON.errors[error][index];
                    $('.reply-alert').append(`<p class="alert alert-danger">${element}</p>`);
                }
            }
        }
        else {
            $('.reply-alert').html(`<p class="alert alert-danger">An error occurred while adding your comment.</p>`);
        }
        localStorage.removeItem('name');
        localStorage.removeItem('email');
    };

    var replyDone = function (res) {
        console.log(res);
        localStorage.setItem('name', res.name);
        localStorage.setItem('email', res.email);
        const elToRemove = $('.is-remove');
        if (elToRemove)
            elToRemove.remove();
        window.location.reload();
    };

    return {
        replyDone: replyDone,
        replyFailed: replyFailed,
        done: done,
        failed: failed
    }
})();

var CommentController = function (result) {
    var button;
    var init = function () {
        $('#comment-form').parsley()
            .on('form:submit', function (e) {
                addComment();
                return false;
            });

        const elToRemove = $('.is-remove');

        if (localStorage.getItem('email') && localStorage.getItem('name')) {
            if (elToRemove)
                elToRemove.remove();
        }
        registerEvents();
    };

    var registerEvents = function () {
        $(".reply").on('click', function (e) {
            e.preventDefault();
            const id = $(this).data('repid');
            const html = `<div class="voffset10 reply-cmbox">
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="reply-alert"></div>
                                        <div class="form-group">
                                            <div class="form-group">
                                            <textarea id='reply-text' class='form-control voffset10' rows='5'></textarea>
                                            </div>
                                        </div>
                                        <button type="button" data-repid="${id}" id="reply-button" class="btn btn-success btn-sm">Comment</button>
                                        <button type="button" class="btn btn-default btn-sm cancel">Cancel</button>
                                    </div>
                                </div>
                            </div>`;

            let parent = $(this).parent('.media-body');

            if (!document.querySelector('.reply-cmbox'))
                parent.append(html);
            else {
                $(window).scrollTop($('.reply-cmbox').offset().top);
            }

            registerEventsAfterAppend();
        });
    };

    var setDataToLocalStorage = () => {
        const nameEl = document.getElementById('name');
        const emailEl = document.getElementById('email');

        const unameEl = document.getElementById('uname');
        const uemailEl = document.getElementById('uemail');

        if (unameEl.value !== "")
            localStorage.setItem('name', unameEl.value);

        if (uemailEl.value !== "")
            localStorage.setItem('email', uemailEl.value);

        if (nameEl)
            localStorage.setItem('name', nameEl.value);

        if (emailEl)
            localStorage.setItem('email', emailEl.value);
    };

    var registerEventsAfterAppend = () => {
        const cancelEl = document.querySelector('.cancel');
        const replyButton = document.querySelector('#reply-button');

        if (cancelEl) {
            cancelEl.addEventListener('click', function (e) {
                cancelEl.parentElement.parentElement.parentElement.remove();
            });
        }

        if (replyButton) {
            replyButton.addEventListener('click', function (e) {
                sendReply(replyButton.dataset.repid);
            });
        }

        let sendReply = (id) => {
            const data = {
                '_token': $('input[name="_token"]').val(),
                'comment': $("#reply-text").val(),
                'reply_id': id,
                'created_at': $.format.date(new Date(), "dd/MM/yyyy HH:mm"),
                'updated_at': $.format.date(new Date(), "dd/MM/yyyy HH:mm"),
                'gig_id': $("input[name='id']").val(),
            };

            setDataToLocalStorage();

            const name = localStorage.getItem('name');
            const email = localStorage.getItem('email');
            data.name = name;
            data.email = email;

            console.log(data); return;

            $.post("/api/comments", data)
                .done(result.replyDone)
                .fail(result.replyFailed);
        };
    };

    var addComment = function (e) {
        const data = {
            '_token': $('input[name="_token"]').val(),
            'name': $("#uname").val(),
            'email': $("#uemail").val(),
            'comment': $("#comment").val(),
            'created_at': $.format.date(new Date(), "dd/MM/yyyy HH:mm"),
            'updated_at': $.format.date(new Date(), "dd/MM/yyyy HH:mm"),
            'gig_id': $("input[name='id']").val(),
        };

        setDataToLocalStorage();

        const name = localStorage.getItem('name');
        const email = localStorage.getItem('email');
        data.name = name;
        data.email = email;
        $.post("/api/comments", data)
            .done(result.done)
            .fail(result.failed);
    };

    return {
        init: init
    };
}(SaveResultController);

CommentController.init();
