# jurassic

A javascript library for manipulating periods. The library contain 2 base objects to handle periods:

* jurassic.Era: a group of periods
* jurassic.Period: a period with a start date and end date

The library has been tested only on node.js

# Methods

Era.addPeriod
-------------
Add a period to Era, accept a period object as parameter

Era.removePeriod
----------------
Remove a periods from era using dates only, if a period with the same dates exists in era, il will be removed.
Accept a period object as parameter

Era.getFlattenedEra
-------------------
Get a new era with all overlapping periods merged as single periods

Era.addEra
----------
Returns a new Era object whose value is the sum of the specified Era object and this instance.

Era.substractPeriod
-------------------
Returns a new Era object whose value is the difference between the specified Period object and this instance.
Accept a period object as parameter

Era.substractEra
----------------
Returns a new Era object whose value is the difference between the specified Era object and this instance.

Era.intersectPeriod
-------------------
Get the intesection of the era with a period. Accept a period object as parameter. This method return an Era object (a list of periods)

Era.intersectEra
----------------
Get the intesection of the specified Era object and this instance. This method return an Era object (a list of periods)


# Example

```javascript
var jurassic = require('jurassic');

var event1 = new jurassic.Period();
event1.dtstart = new Date(2014,0,1);
event1.dtend = new Date(2015,0,1);

var event2 = new jurassic.Period();
event2.dtstart = new Date(2015,0,1);
event2.dtend = new Date(2016,0,1);

var era = new jurassic.Era();
era.addPeriod(event1).addPeriod(event2);
```