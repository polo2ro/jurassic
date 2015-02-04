'use strict';


function Boundary()
{
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
    }
}
