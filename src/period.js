
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

    this.test = function()
    {

    };
};
