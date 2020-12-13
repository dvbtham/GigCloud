const UserGigsController = (function () {
  let button;
  let table;
  let row;
  const csrfToken = $('meta[name="csrf-token"]').attr('content');
  const BACKEND_API = $('meta[name="backendApi"]').attr('content');

  const init = function () {
    table = $('#my-gigs-table').DataTable();
    $('.change-gig-status').click(handleChangeGigStatus);
  };

  const handleChangeGigStatus = function (e) {
    button = $(e.target);
    const restore = button.data('restore');
    if (!confirm(`Sure to ${restore ? 'restore' : 'delete'} this gig?`)) return;

    const gigId = button.data('id');
    postChangeGigStatus(gigId, restore);
  };

  const postChangeGigStatus = (gigId, restore) => {
    fetch(`${BACKEND_API}/change-gig-status`, {
      method: 'POST',
      headers: {
        'X-CSRF-TOKEN': csrfToken,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ gigId: gigId, isRestore: restore === 'yes' }),
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
      })
      .then(deleteDone)
      .catch(deleteFailed);
  };

  const deleteDone = () => {
    window.location.reload();
  };

  const deleteFailed = (err) => {
    toastr.error('Failed to delete this gig!');
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  return {
    init: init,
  };
})();

UserGigsController.init();
