'use strict';


/**
 * Representation of a period (timespan)
 *
 */
function Period()
{

    /**
     * @var {Date}
     */
    this.dtstart = null;

    /**
     * @var {Date}
     */
    this.dtend = null;

    /**
     * @var {Era}
     */
    this.era = null;

}

/**
 * Get number of days beetween 2 hours in the same day
 *
 * @param {Date} startHour
 * @param {Date} endHour
 * @param {Date} halfdayHour
 *
 * @return {Number}
 */
Period.prototype.getDaysInDay = function(startHour, endHour, halfdayHour)
{
    var start = new Date(startHour);
    var end = new Date(start);
    end.setHours(endHour.getHours(), endHour.getMinutes(), endHour.getSeconds(), endHour.getMilliseconds());

    var halfday = new Date(start);
    halfday.setHours(halfdayHour.getHours(), halfdayHour.getMinutes(), halfdayHour.getSeconds(), halfdayHour.getMilliseconds());

    if (start.getTime() >= end.getTime()) {
        return 0;
    }

    if (end.getTime() <= halfday.getTime()) {
        return 0.5;
    }

    if (start.getTime() >= halfday.getTime()) {
        return 0.5;
    }

    return 1;
};




/**
 * Get a new period on one day (intersection on one day)
 * @param {Date} day
 * @return {Period}
 */
Period.prototype.getDayPeriod = function(day)
{
    var period = new Period();
    var daystart = new Date(day);
    daystart.setHours(0, 0, 0, 0);

    var dayend = new Date(day);
    dayend.setHours(23, 59, 59, 99);

    if (this.dtstart.getTime() >= dayend.getTime()) {
        return null;
    }

    if (this.dtend.getTime() <= daystart.getTime()) {
        return null;
    }


    if (this.dtstart.getTime() < daystart.getTime()) {
        period.dtstart = daystart;
    } else {
        period.dtstart = new Date(this.dtstart);
    }

    if (this.dtend.getTime() > dayend.getTime()) {
        period.dtend = dayend;
    } else {
        period.dtend = new Date(this.dtend);
    }

    return period;
};



/**
 * Get number of days in period with a 0.5 days precision
 * @param {Date} halfday  half-day hour
 * @return {Number}
 */
Period.prototype.getBusinessDays = function(halfday)
{

    if (null === this.dtstart || null === this.dtend) {
        throw new Error('invalid period');
    }

    if (undefined === halfday) {
        halfday = new Date();
        halfday.setHours(12, 0, 0, 0);
    }

    var days = 0;
    var loopPeriod;
    var loop = new Date(this.dtstart);
    while (loop.getTime() < this.dtend.getTime()) {
        loopPeriod = this.getDayPeriod(loop);
        days += this.getDaysInDay(loopPeriod.dtstart, loopPeriod.dtend, halfday);
        loop.setDate(loop.getDate() + 1);
    }

    return days;
};


module.exports = Period;
