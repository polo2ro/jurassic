
/**
 * A list of periods linked with the finish date (left) or start date (right)
 * @param {Date} rootDate   Root date on Era
 */
module.exports = function Boundary(rootDate)
{
    'use strict';

    this.rootDate = rootDate;

    this.left = [];

    this.right = [];

    var b = this;

    /**
     * Add a period on boundary
     * @param {string} position left or right
     * @param {Period} period
     */
    this.addPeriod = function(position, period)
    {
        b[position].push(period);
    };

    /**
     * Remove a period on a boundary (by dates)
     * @param {string} position left or right
     * @param {Period} period
     */
    this.removePeriod = function(position, period)
    {
        for (var i=0; i<b[position].length; i++) {
            if (b[position][i].dtstart === period.dtstart && b[position][i].dtend === period.dtend) {
                b[position].splice(i, 1);
                break;
            }
        }
    }
};
