

/**
 * Representation of a list of periods
 * periods must not be overlapped in an Era object
 */
module.exports = function Era()
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
        instance.addPeriodBoundary(period.dtstart, period, 'right');
        instance.addPeriodBoundary(period.dtend, period, 'left');

    };


    this.removePeriod = function(period)
    {
        for (var i=0; i<instance.periods.length; i++) {
            if(instance.periods[i].dtstart == period.dtstart && instance.periods[i].dtend == period.dtend) {
                instance.periods.splice(i, 1);
                break;
            }
        }
    };




    /**
     * Add a period to boundary, create the boundary if necessary
     * @param {Date} rootDate
     * @param {Period} period
     * @param {string} position
     */
    this.addPeriodBoundary = function(rootDate, period, position)
    {
        if (instance.boundariesByDate[rootDate] === undefined) {

            var Boundary = require('./boundary');
            var newBoundary = new Boundary(rootDate);

            instance.boundariesByDate[rootDate] = newBoundary;
            instance.boundaries.push(newBoundary);
        }

        instance.boundariesByDate[rootDate].addPeriod(position, period);
    };


    /**
     * Remove period from boundary, delete the boundary if necessary
     * @param {Date} rootDate
     * @param {Period} period
     * @param {string} position
     */
    this.removePeriodBoundary = function(rootDate, period, position)
    {
        var boundary = instance.boundariesByDate[rootDate];

        boundary.removePeriod(position, period);

        if (boundary[position].length === 0) {
            delete instance.boundariesByDate[rootDate];

            for (var i=0; i<instance.boundaries.length; i++) {
                if (instance.boundaries[i].rootDate == rootDate) {
                    instance.boundaries.splice(i, 1);
                    break;
                }
            }
        }
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
        var Period = require('./period');

        var boundary,
            openStatus = false,
            lastDate = null,
            flattenedEra = new Era(),
            period,
            events = [];

        for(var i=0; i<instance.boundaries.length; i++) {
            boundary = instance.boundaries[i];
            Array.prototype.push.apply(events, boundary.right);

            // open period
            if (!openStatus && boundary.left.length === 0) { // nothing before boundary
                openStatus = true;
                lastDate = new Date(boundary.rootDate);
                continue;
            }

            // close period
            if (openStatus && boundary.right.length === 0) { // nothing after boundary
                openStatus = false;

                period = new Period();
                period.dtstart = new Date(lastDate);
                period.dtend = new Date(boundary.rootDate);
                period.events = events;
                flattenedEra.addPeriod(period);

                events = [];
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
     * @return {bool}
     */
    this.substractEra = function(era)
    {
        for(var p=0; p < era.periods.length; p++) {
            era.periods[p]
        }
    };
};
