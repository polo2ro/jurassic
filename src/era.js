/*jslint node: true */

/**
 * Representation of a list of periods
 * periods must not be overlapped in an Era object
 */
module.exports = function Era() {
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
     * Create period from event object
     * @param {Object}  obj     expanded event
     * @return {Period}
     */
    this.createPeriod = function(obj)
    {
        var Period = require('./period');



        var p = new Period();
        for(var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                p[prop] = obj[prop];
            }
        }


        if (!(p.dtstart instanceof Date)) {
            p.dtstart = new Date(p.dtstart);
        }

        if (!(p.dtend instanceof Date)) {
            p.dtend = new Date(p.dtend);
        }

        return p;
    };


    /**
     * Add a period to Era
     * If the given object is not a Period instance, a new Period instance will be creted from it
     *
     * @var {Period|object} period
     * @return {Era}
     */
    this.addPeriod = function(period) {

        var Period = require('./period');

        if (!(period instanceof Period)) {
            period = this.createPeriod(period);
        }

        if (period.dtstart.getTime() >= period.dtend.getTime()) {
            throw new Error('Invalid period');
        }

        instance.periods.push(period);
        instance.addPeriodBoundary(period.dtstart, period, 'right');
        instance.addPeriodBoundary(period.dtend, period, 'left');

        return instance;
    };

    /**
     * Remove a period from era using dates only
     * @param {Period} period
     * @return {Era}
     */
    this.removePeriod = function(period) {

        var i;

        for (i = 0; i < instance.periods.length; i++) {
            if(instance.periods[i].dtstart.getTime() === period.dtstart.getTime() && instance.periods[i].dtend.getTime() === period.dtend.getTime()) {
                instance.periods.splice(i, 1);
                break;
            }
        }

        instance.removePeriodBoundary(period.dtstart, period, 'right');
        instance.removePeriodBoundary(period.dtend, period, 'left');

        return instance;
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
                if (instance.boundaries[i].rootDate.getTime() === rootDate.getTime()) {
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
     * Add all periods to the current Era object
     * @param {Array} periods
     * @return {Era}
     */
    this.addPeriods = function(periods)
    {
        for(var i=0; i<periods.length; i++) {
            instance.addPeriod(periods[i]);
        }

        return instance;
    };


    /**
     * Add all era periods to the current Era object
     * @param {Era} era
     * @return {Era}
     */
    this.addEra = function(era)
    {
        return this.addPeriods(era.periods);
    };





    /**
     * Returns a new Era object whose value is the difference between the specified Period object and this instance.
     * @param {Period} period
     * @return {Era}
     */
    this.substractPeriod = function(period)
    {
        var Period = require('./period.js');
        var era = new Era(), newperiod;

        for(var i=0; i<instance.periods.length; i++) {

            if (period.dtstart.getTime() >= instance.periods[i].dtend.getTime()) {
                era.addPeriod(instance.periods[i]);
                continue;
            }

            if (period.dtend.getTime() <= instance.periods[i].dtstart.getTime()) {
                era.addPeriod(instance.periods[i]);
                continue;
            }

            if (period.dtend.getTime() > instance.periods[i].dtstart.getTime() && period.dtstart > instance.periods[i].dtstart) {
                newperiod = new Period();
                newperiod.dtstart = instance.periods[i].dtstart;
                newperiod.dtend = period.dtstart;
                era.addPeriod(newperiod);
            }


            if (period.dtstart.getTime() < instance.periods[i].dtend.getTime() && period.dtend < instance.periods[i].dtend) {
                newperiod = new Period();
                newperiod.dtstart = period.dtend;
                newperiod.dtend = instance.periods[i].dtend;
                era.addPeriod(newperiod);
            }
        }

        return era;
    };


    /**
     * Returns a new Era object whose value is the difference between the specified Era object and this instance.
     * @param {Era} era
     * @return {Era}
     */
    this.substractEra = function(era)
    {
        var processEra = instance;

        for(var p=0; p < era.periods.length; p++) {
            processEra = processEra.substractPeriod(era.periods[p]);
        }

        return processEra;
    };


    /**
     * Copy properties from one period to another
     * if property allready exists, nothing is modified
     * @param {Period} from
     * @param {Period} to
     *
     */
    this.copyProperties = function(from, to)
    {
        for(var prop in from) {
            if (to[prop] === undefined) {
                to[prop] = from[prop];
            }
        }
    };


    /**
     * Get the intesection of the era with a period
     * @param {Period} period
     * @param {Boolean} copyProperties      Copy properties of the era period into the new period (default true)
     * @return {Era}
     */
    this.intersectPeriod = function(period, copyProperties)
    {
        if (undefined === copyProperties) {
            copyProperties = true;
        }

        var Period = require('./period.js');
        var era = new Era(), newperiod;

        for(var i=0; i<instance.periods.length; i++) {

            if (period.dtstart.getTime() >= instance.periods[i].dtend.getTime()) {
                continue;
            }

            if (period.dtend.getTime() <= instance.periods[i].dtstart.getTime()) {
                continue;
            }

            newperiod = new Period();

            if (period.dtstart.getTime() > instance.periods[i].dtstart.getTime()) {
                newperiod.dtstart = new Date(period.dtstart);
            } else {
                newperiod.dtstart = new Date(instance.periods[i].dtstart);
            }


            if (period.dtend.getTime() < instance.periods[i].dtend.getTime()) {
                newperiod.dtend = new Date(period.dtend);
            } else {
                newperiod.dtend = new Date(instance.periods[i].dtend);
            }

            if (copyProperties) {
                instance.copyProperties(instance.periods[i], newperiod);
            }

            era.addPeriod(newperiod);
        }

        return era;
    };



    /**
     * Get the intesection of the specified Era object and this instance
     * @param {Era} era
     * @return {Era}
     */
    this.intersectEra = function(era)
    {
        var processEra = new Era();

        for(var p=0; p < era.periods.length; p++) {
            processEra.addEra(instance.intersectPeriod(era.periods[p]));
        }

        return processEra;
    };
};
