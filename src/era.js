

/**
 * Representation of a list of periods
 * periods must not be overlapped in an Era object
 */
exports = module.exports = function Era()
{
    'use strict';

    /**
     * All periods
     * @var {Array}
     */
    this.periods = [];

    /**
     * All boundaries
     * @var {Array}
     */
    this.boundaries = [];

    /**
     * Boundaries indexed by date
     */
    this.boundariesByDate = {};


    var instance = this;





    /**
     * Add a period to Era
     * @var {Period} period
     *
     */
    this.addPeriod = function(period)
    {
        instance.periods.push(period);
        instance.addBoundary(period.dtstart, period, 'right');
        instance.addBoundary(period.dtend, period, 'left');

    };




    /**
     * @var {Date} rootDate
     * @var {Period} period
     */
    this.addBoundary = function(rootDate, period, position)
    {
        if (instance.boundariesByDate[rootDate] === undefined) {
            var newBoundary = new require('./boundary')(rootDate);
            instance.boundariesByDate[rootDate] = newBoundary;
            instance.boundaries.push(newBoundary);
        }

        instance.boundariesByDate[rootDate].addPeriod(position, period);
    };


    this.sortBoundaries = function()
    {
        instance.boundaries.sort(function(a, b) {

            if (a.rootDate > b.rootDate) {
                return 1;
            }

            if (a.rootDate < b.rootDate) {
                return -1;
            }

            return 0;
        });
    };


    /**
     * Get new Era object with merged overlapping events
     * @return {Era}
     */
    this.getFlattenedEra = function()
    {
        instance.sortBoundaries();
        var boundary, openStatus = false, lastDate = null, flattenedEra = new Era(), period;

        for(var i=0; i<instance.boundaries; i++) {
            boundary = instance.boundaries[i];

            // open period
            if (!openStatus && boundary.left.length === 0) {
                openStatus = true;
                lastDate = new Date(boundary.rootDate);
                continue;
            }

            // close period
            if (openStatus && boundary.right.length === 0) {
                openStatus = false;

                period = new require('./period')();
                period.dtstart = new Date(lastDate);
                period.dtend = new Date(boundary.rootDate);
                flattenedEra.addPeriod(period);
            }
        }

        return flattenedEra;
    };



    /**
     * Returns a new Era object whose value is the sum of the specified Era object and this instance.
     * @param {Era} era
     * @return {Era}
     */
    this.addEra = function(era)
    {
        for(var i=0; i<era.periods.length; i++) {
            instance.addPeriod(era.periods[i]);
        }
    };

    /**
     * Returns a new Era object whose value is the difference between the specified Era object and this instance.
     * @param {Era} era
     * @return {Era}
     */
    this.substractEra = function(era)
    {

    };
};
