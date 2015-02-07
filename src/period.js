
/**
 * Representation of a period (timespan)
 *
 */
exports = module.export = function Period()
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
};
