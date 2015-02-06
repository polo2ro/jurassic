/**
 * A list of periods linked with the finish date (left) or start date (right)
 * @param {Date} rootDate   Root date on Era
 */
function Boundary(rootDate)
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
}
