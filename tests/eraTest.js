var assert = require("assert");
var jurassic = require('../src/jurassic');




describe('Era', function() {
    describe('getFlattenedEra()', function() {
        it('should flatten overlapped periods', function() {

            console.log('test');
            console.log(jurassic);

            var era = new jurassic.Era();

            var p1 = new jurassic.Period();
            p1.dtstart = new Date(2015, 1, 1);
            p1.dtend = new Date(2015, 1, 7);

            var p2 = new jurassic.Period();
            p2.dtstart = new Date(2015, 1, 6);
            p2.dtend = new Date(2015, 1, 8);

            era.addPeriod(p1);
            era.addPeriod(p2);

            assert.equal(2, era.periods.length);

            var flattenedEra = era.getFlattenedEra();

            assert.equal(1, flattenedEra.periods.length);

        });
    });
});
