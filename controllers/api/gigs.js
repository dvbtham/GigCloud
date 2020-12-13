const Gig = require('../../models/gig');
const authUserId = require('../../middlewares/authUserId');

module.exports.postChangeGigStatus = async (req, res, next) => {
  try {
    const { isRestore, gigId } = req.body;
    const gig = await Gig.findOne({ _id: gigId, artist: authUserId(req) });
    if (!gig) return res.status(404).json({ message: 'Gig is not found' });
    isRestore ? await gig.restore() : await gig.delete();
    return res.status(200).json({ message: `Gig is ${isRestore ? 'restored' : 'deleted'}!` });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
