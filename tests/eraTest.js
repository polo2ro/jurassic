var assert = require("assert");
var jurassic = require('../src/jurassic');




describe('Era', function() {
    describe('getFlattenedEra()', function() {

        it('add one boundary for two similar dates', function() {

            var era = new jurassic.Era();

            var p1 = new jurassic.Period();
            p1.dtstart = new Date(2015, 1, 1);
            p1.dtend = new Date(2015, 1, 7);

            var p2 = new jurassic.Period();
            p2.dtstart = new Date(2015, 1, 7);
            p2.dtend = new Date(2015, 1, 8);

            era.addPeriod(p1);
            era.addPeriod(p2);

            assert.equal(3, era.boundaries.length);
            assert.equal(1, era.boundaries[0].rootDate.getDate());
            assert.equal(7, era.boundaries[1].rootDate.getDate());
            assert.equal(8, era.boundaries[2].rootDate.getDate());
        });


        it('should flatten overlapped periods', function() {

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
