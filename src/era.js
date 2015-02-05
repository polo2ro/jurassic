

/**
 * Representation of a list of periods
 * periods must not be overlapped in an Era object
 */
function Era()
{
    'use strict';

    /**
     * All periods
     */
    this.periods = [];

    /**
     * Boundaries indexed by date
     */
    this.boundaries = {};

    var instance = this;


    /**
     * Get the list of periods keys in intersections with the specified Period object
     * @param {Period} period
     * @return {Array}
     */
    this.getPeriodIntersectionskeys = function(period)
    {
        var r = [];

        for (var i=0; i<instance.periods.length; i++) {
            if (instance.periods[i].dtstart >= period.dtend || instance.periods[i].dtend <= period.dtstart) {
                continue;
            }

            r.push(i);
        }

        return r;
    };

    /**
     * Get the list of periods keys in intersections with the specified Era object
     * @param {Era} era
     * @return {Array}
     */
    this.getEraIntersectionsKeys = function(era)
    {
        var r = [];

        for (var i=0; i<era.periods.length; i++) {

            Array.prototype.push.apply(
                r,
                instance.getPeriodIntersectionskeys(instance.periods[i])
            );
        }

        return r;
    };



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
        if (instance.boundaries[rootDate] === undefined) {
            instance.boundaries[rootDate] = new Boundary();
        }

        instance.boundaries[rootDate].addPeriod(position, period);
    };



    /**
     * Returns a new Era object whose value is the sum of the specified Era object and this instance.
     * @param {Era} era
     * @return {Era}
     */
    this.addEra = function(era)
    {
        var i;
        var r = new Era();

        var sourceConflicts = instance.getEraIntersectionsKeys(era);
        var targetConflicts = era.getEraIntersectionsKeys(instance);

        for(i=0; i<instance.periods.length; i++) {
            if (-1 === sourceConflicts.indexOf(i)) {
                r.push(instance.periods[i]);
            }
        }

        for(i=0; i<era.periods.length; i++) {
            if (-1 === targetConflicts.indexOf(i)) {
                r.push(era.periods[i]);
            }
        }

        // TODO: merge conflicts periods


    };

    /**
     * Returns a new Era object whose value is the difference between the specified Era object and this instance.
     * @param {Era} era
     * @return {Era}
     */
    this.substractEra = function(era)
    {

    };
}
