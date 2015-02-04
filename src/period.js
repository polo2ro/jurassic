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
