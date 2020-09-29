const { titleChecker, venueChecker, dateChecker, genreChecker, descriptionChecker } = require('./concerns/gig');

const gigValidators = [titleChecker, venueChecker, dateChecker, genreChecker, descriptionChecker];

module.exports = gigValidators;
