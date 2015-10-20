'use strict';
/*jslint node: true */

/**
 * Representation of a list of periods
 * periods must not be overlapped in an Era object
 */
function Era() {


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

}

/**
 * Create period from event object
 * @param {Object}  obj     expanded event
 * @return {Period}
 */
Era.prototype.createPeriod = function(obj)
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
Era.prototype.addPeriod = function(period) {

    var Period = require('./period');

    if (!(period instanceof Period)) {
        period = this.createPeriod(period);
    }

    if (period.dtstart.getTime() >= period.dtend.getTime()) {
        throw new Error('Invalid period');
    }

    this.periods.push(period);
    this.addPeriodBoundary(period.dtstart, period, 'right');
    this.addPeriodBoundary(period.dtend, period, 'left');

    return this;
};

/**
 * Remove a period from era using dates only
 * @param {Period} period
 * @return {Era}
 */
Era.prototype.removePeriod = function(period) {

    var i;

    for (i = 0; i < this.periods.length; i++) {
        if(this.periods[i].dtstart.getTime() === period.dtstart.getTime() && this.periods[i].dtend.getTime() === period.dtend.getTime()) {
            this.periods.splice(i, 1);
            break;
        }
    }

    this.removePeriodBoundary(period.dtstart, period, 'right');
    this.removePeriodBoundary(period.dtend, period, 'left');

    return this;
};




/**
 * Add a period to boundary, create the boundary if necessary
 * @param {Date} rootDate
 * @param {Period} period
 * @param {string} position
 */
Era.prototype.addPeriodBoundary = function(rootDate, period, position)
{
    if (this.boundariesByDate[rootDate] === undefined) {

        var Boundary = require('./boundary');
        var newBoundary = new Boundary(rootDate);

        this.boundariesByDate[rootDate] = newBoundary;
        this.boundaries.push(newBoundary);
    }

    this.boundariesByDate[rootDate].addPeriod(position, period);
};


/**
 * Remove period from boundary, delete the boundary if necessary
 * @param {Date} rootDate
 * @param {Period} period
 * @param {string} position
 */
Era.prototype.removePeriodBoundary = function(rootDate, period, position)
{
    var boundary = this.boundariesByDate[rootDate];

    boundary.removePeriod(position, period);

    if (boundary[position].length === 0) {
        delete this.boundariesByDate[rootDate];

        for (var i=0; i<this.boundaries.length; i++) {
            if (this.boundaries[i].rootDate.getTime() === rootDate.getTime()) {
                this.boundaries.splice(i, 1);
                break;
            }
        }
    }
};


Era.prototype.sortBoundaries = function()
{
    this.boundaries.sort(function(a, b) {

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
Era.prototype.getFlattenedEra = function()
{
    this.sortBoundaries();
    var Period = require('./period');

    var boundary,
        openStatus = false,
        lastDate = null,
        flattenedEra = new Era(),
        period,
        events = [];

    for(var i=0; i<this.boundaries.length; i++) {
        boundary = this.boundaries[i];
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
Era.prototype.addPeriods = function(periods)
{
    for(var i=0; i<periods.length; i++) {
        this.addPeriod(periods[i]);
    }

    return this;
};


/**
 * Add all era periods to the current Era object
 * @param {Era} era
 * @return {Era}
 */
Era.prototype.addEra = function(era)
{
    return this.addPeriods(era.periods);
};




/**
 * Returns a new Era object whose value is the difference between the specified Period object and this instance.
 * @param {Period} period
 * @return {Era}
 */
Era.prototype.subtractPeriod = function(period)
{
    var Period = require('./period.js');
    var era = new Era(), newperiod;

    for(var i=0; i<this.periods.length; i++) {

        if (period.dtstart.getTime() >= this.periods[i].dtend.getTime()) {
            era.addPeriod(this.periods[i]);
            continue;
        }

        if (period.dtend.getTime() <= this.periods[i].dtstart.getTime()) {
            era.addPeriod(this.periods[i]);
            continue;
        }

        if (period.dtend.getTime() > this.periods[i].dtstart.getTime() && period.dtstart > this.periods[i].dtstart) {
            newperiod = new Period();
            newperiod.dtstart = this.periods[i].dtstart;
            newperiod.dtend = period.dtstart;
            era.addPeriod(newperiod);
        }


        if (period.dtstart.getTime() < this.periods[i].dtend.getTime() && period.dtend < this.periods[i].dtend) {
            newperiod = new Period();
            newperiod.dtstart = period.dtend;
            newperiod.dtend = this.periods[i].dtend;
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
Era.prototype.subtractEra = function(era)
{
    var processEra = this;

    for(var p=0; p < era.periods.length; p++) {
        processEra = processEra.subtractPeriod(era.periods[p]);
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
Era.prototype.copyProperties = function(from, to)
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
Era.prototype.intersectPeriod = function(period, copyProperties)
{
    if (undefined === copyProperties) {
        copyProperties = true;
    }

    var Period = require('./period.js');
    var era = new Era(), newperiod;

    for(var i=0; i<this.periods.length; i++) {

        if (period.dtstart.getTime() >= this.periods[i].dtend.getTime()) {
            continue;
        }

        if (period.dtend.getTime() <= this.periods[i].dtstart.getTime()) {
            continue;
        }

        newperiod = new Period();

        if (period.dtstart.getTime() > this.periods[i].dtstart.getTime()) {
            newperiod.dtstart = new Date(period.dtstart);
        } else {
            newperiod.dtstart = new Date(this.periods[i].dtstart);
        }


        if (period.dtend.getTime() < this.periods[i].dtend.getTime()) {
            newperiod.dtend = new Date(period.dtend);
        } else {
            newperiod.dtend = new Date(this.periods[i].dtend);
        }

        if (copyProperties) {
            this.copyProperties(this.periods[i], newperiod);
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
Era.prototype.intersectEra = function(era)
{
    var processEra = new Era();

    for(var p=0; p < era.periods.length; p++) {
        processEra.addEra(this.intersectPeriod(era.periods[p]));
    }

    return processEra;
};

module.exports = Era;
