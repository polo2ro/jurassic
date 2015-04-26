
/**
 * Representation of a period (timespan)
 *
 */
module.exports = function Period()
{
    'use strict';

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

    var instance = this;


    /**
     * Get number of days beetween 2 hours in the same day
     *
     * @param {Date} startHour
     * @param {Date} endHour
     * @param {Date} halfdayHour
     *
     * @return {Number}
     */
    instance.getDaysInDay = function(startHour, endHour, halfdayHour)
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
    instance.getDayPeriod = function(day)
    {
        var period = new Period();
        var daystart = new Date(day);
        daystart.setHours(0, 0, 0, 0);

        var dayend = new Date(day);
        dayend.setHours(23, 59, 59, 99);

        if (instance.dtstart.getTime() >= dayend.getTime()) {
            return null;
        }

        if (instance.dtend.getTime() <= daystart.getTime()) {
            return null;
        }


        if (instance.dtstart.getTime() < daystart.getTime()) {
            period.dtstart = daystart;
        } else {
            period.dtstart = new Date(instance.dtstart);
        }

        if (instance.dtend.getTime() > dayend.getTime()) {
            period.dtend = dayend;
        } else {
            period.dtend = new Date(instance.dtend);
        }

        return period;
    };



    /**
     * Get number of days in period with a 0.5 days precision
     * @param {Date} halfday  half-day hour
     * @return {Number}
     */
    instance.getBusinessDays = function(halfday)
    {

        if (null === instance.dtstart || null === instance.dtend) {
            throw new Error('invalid period');
        }

        if (undefined === halfday) {
            halfday = new Date();
            halfday.setHours(12, 0, 0, 0);
        }

        var days = 0;
        var loopPeriod;
        var loop = new Date(instance.dtstart);
        while (loop.getTime() < instance.dtend.getTime()) {
            loopPeriod = instance.getDayPeriod(loop);
            days += instance.getDaysInDay(loopPeriod.dtstart, loopPeriod.dtend, halfday);
            loop.setDate(loop.getDate() + 1);
        }

        return days;
    };
};
