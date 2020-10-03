const CommentController = (function () {
  const quillOptions = {
    theme: 'snow',
    modules: {
      imageResize: {
        displaySize: true,
      },
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ['link', 'image', 'emoji'],
        ['clean'],
      ],
      'emoji-toolbar': true,
      'emoji-shortname': true,
      'emoji-textarea': true,
    },
  };

  const init = function () {
    registerEvents();
  };

  const registerEvents = function () {
    if ($('#comment-editor').length > 0) {
      const quill = createQuill('#comment-editor');

      $('.submit-comment').on('click', function () {
        if (quill.getLength() > 1) {
          $('#comment-content').val(JSON.stringify(quill.getContents()));
          $('#form-comment').submit();
        } else {
          toastr.error('Comment content is required');
        }
      });

      $('.reply-comment').on('click', function (e) {
        e.preventDefault();

        const commentId = $(this).attr('data-comment-id');
        const gigId = $(this).attr('data-gig-id');
        const csrf = $(this).attr('data-csrf');
        const commentEditorId = `#comment-reply-${commentId}`;
        if ($(commentEditorId).html().length > 0) return;
        const quill = createQuill(commentEditorId);
        createEditorButtons(`#reply-editor-${commentId}`, commentId);

        $(`#cancel-editor-${commentId}`).on('click', function () {
          quill.enable(false);
          $(commentEditorId).html('').removeAttr('class');
          $(`#reply-editor-${commentId} .ql-toolbar`).remove();
          $(`#reply-editor-${commentId} button`).remove();
        });

        $(`#submit-reply-${commentId}`).on('click', function (e) {
          e.preventDefault();

          if (quill.getLength() <= 0) {
            toastr.error('Reply content is required');
            return;
          }

          const body = {
            csrf,
            commentId,
            gigId,
            content: JSON.stringify(quill.getContents()),
          };
          addReply(body);
        });
      });

      $('.reply-reply').on('click', function (e) {
        e.preventDefault();

        const replyId = $(this).attr('data-reply-id');
        const commentId = $(this).attr('data-comment-id');
        const gigId = $(this).attr('data-gig-id');
        const csrf = $(this).attr('data-csrf');
        const replyEditorId = `#reply-reply-${replyId}`;
        if ($(replyEditorId).html().length > 0) return;
        const quill = createQuill(replyEditorId);
        createEditorButtons(`#reply-editor-${replyId}`, replyId);

        $(`#cancel-editor-${replyId}`).on('click', function () {
          quill.enable(false);
          $(replyEditorId).html('').removeAttr('class');
          $(`#reply-editor-${replyId} .ql-toolbar`).remove();
          $(`#reply-editor-${replyId} button`).remove();
        });

        $(`#submit-reply-${replyId}`).on('click', function (e) {
          e.preventDefault();

          if (quill.getLength() <= 0) {
            toastr.error('Reply content is required');
            return;
          }

          const body = {
            csrf,
            commentId,
            gigId,
            content: JSON.stringify(quill.getContents()),
          };
          addReply(body);
        });
      });
    }
    renderQuillContent();
  };

  const addReply = function (body) {
    fetch(`http://localhost:3000/api/reply`, {
      method: 'POST',
      headers: {
        'X-CSRF-TOKEN': body.csrf,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((reply) => {
        if (reply.errors && reply.errors.length > 0) {
          toastr.error(reply.errors[0]);
          return;
        }
        let url = window.location.href;
        let prevUrl = url.split('#');

        if (prevUrl.length > 1) {
          url = prevUrl[0];
        }

        url += `#${reply._id}`;
        window.location.href = url;
        window.location.reload();
      });
  };

  const createQuill = function (editorId) {
    const quill = new Quill(editorId, quillOptions);
    const toolbar = quill.getModule('toolbar');
    toolbar.addHandler('image', () => imageHandler(quill));
    return quill;
  };

  const createEditorButtons = function (idElToAppend, recordId) {
    const buttons = `
      <button id="submit-reply-${recordId}" type="button" class="btn btn-primary btn-sm voffset10">Submit</button>
      <button id="cancel-editor-${recordId}" type="button" class="btn btn-default btn-sm voffset10">Cancel</button>
    `;
    $(idElToAppend).append(buttons);
  };

  const renderQuillContent = function () {
    const figures = document.querySelectorAll('figure');
    figures.forEach((f) => {
      const readOnlyQuill = new Quill('#' + f.id, {});
      readOnlyQuill.setContents(JSON.parse(f.dataset['content']));
      readOnlyQuill.enable(false);
    });
  };

  const imageHandler = function (quill) {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = function () {
      toastr.info('Inserting image....');
      const file = input.files[0];
      const formData = new FormData();
      formData.append('image', file);
      updateImage(formData)
        .then((res) => {
          const range = quill.getSelection();
          quill.insertEmbed(range.index, 'image', res.data.link);
          toastr.success('Image inserted');
        })
        .catch(() => {
          toastr.error('Failed to inserted image');
        });
    };
  };

  const updateImage = function (formData) {
    return fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {
        Authorization: 'Client-ID f26fc764fdb5fff',
      },
      body: formData,
    })
      .then((res) => res.json())
      .catch(() => {
        toastr.error('Failed to insert image');
      });
  };

  return {
    init: init,
  };
})();

CommentController.init();
