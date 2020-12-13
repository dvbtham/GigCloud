$(document).ready(function () {
  $('[data-toggle="tooltip"]').tooltip();
  const inputDate = $('.datetimepicker');

  if (inputDate) {
    inputDate.datetimepicker({ format: 'MM/DD/YYYY HH:mm' });
    inputDate.on('keydown', () => {
      return false;
    });
  }

  const notificationEl = document.getElementById('notifications');

  if (notificationEl) {
    $.getJSON('/api/notifications', function (notifications) {
      $('.js-notifications-count').text(notifications.length).removeClass('hide').addClass('animated bounceInDown');

      $('.notifications')
        .popover({
          html: true,
          title: 'Notifications',
          content: function () {
            if (notifications.length === 0) return '<li>You have no notifications</li>';

            const notificationsHtml = notifications.map((notification) => {
              return `<li>${notification.message}</li>`;
            });

            return `<ul>${notificationsHtml.join('')}</ul>`;
          },
          placement: 'bottom',

          template:
            '<div class="popover popover-notifications" role="tooltip"><div class="arrow"></div><h2 class="popover-title"></h2><div class="popover-content"></div></div>',
        })
        .on('shown.bs.popover', function () {
          // $.post('/api/notifications/markAsRead').done(function () {
          //   $('.js-notifications-count').text('').addClass('hide');
          // });
        });
    });
  }
});
