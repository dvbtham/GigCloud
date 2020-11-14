const authUserId = require('../../middlewares/authUserId');
const LoadNotificationsService = require('../../services/loadNotificationsService');

module.exports.getNotifications = async (req, res) => {
  try {
    const notifications = await new LoadNotificationsService(authUserId(req)).perform();
    return res.status(200).json(notifications);
  } catch (err) {
    return res.status(500).json([]);
  }
};
