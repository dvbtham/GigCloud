const CommentController = (function () {
  const init = function () {
    registerEvents();
  };

  const registerEvents = function () {
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

    const quill = new Quill('#comment-editor', quillOptions);
    const toolbar = quill.getModule('toolbar');
    const figures = document.querySelectorAll('figure');
    figures.forEach((f) => {
      const readOnlyQuill = new Quill('#' + f.id, {});
      readOnlyQuill.setContents(JSON.parse(f.dataset['content']));
      readOnlyQuill.enable(false);
    });

    toolbar.addHandler('image', () => imageHandler(quill));

    $('.submit-comment').on('click', function () {
      if (quill.getLength() > 1) {
        $('#comment-content').val(JSON.stringify(quill.getContents()));
        $('#form-comment').submit();
      } else {
        toastr.error('Content is required');
      }
    });
  };

  const imageHandler = function (quill) {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = function () {
      toastr.info('Uploading image....');
      const file = input.files[0];
      const formData = new FormData();
      formData.append('image', file);
      updateImage(formData)
        .then((res) => {
          const range = quill.getSelection();
          quill.insertEmbed(range.index, 'image', res.data.link);
          toastr.success('Image uploaded');
        })
        .catch((err) => {
          toastr.error('Failed to upload image');
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
        toastr('error', 'Đã có lỗi xảy ra, chèn ảnh không thành công!');
      });
  };

  return {
    init: init,
  };
})();

CommentController.init();
