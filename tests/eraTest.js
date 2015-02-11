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




        it('substract period', function() {
            var era = new jurassic.Era();

            var p1 = new jurassic.Period();
            p1.dtstart = new Date(2015, 1, 1);
            p1.dtend = new Date(2015, 1, 7);

            var p2 = new jurassic.Period();
            p2.dtstart = new Date(2015, 1, 5);
            p2.dtend = new Date(2015, 1, 6);

            var p3 = new jurassic.Period();
            p3.dtstart = new Date(2015, 1, 6);
            p3.dtend = new Date(2015, 1, 7);

            era.addPeriod(p1);
            var newEra1 = era.substractPeriod(p2);
            assert.equal(2, newEra1.periods.length);
            assert.equal(5, newEra1.periods[0].dtend.getDate());
            assert.equal(6, newEra1.periods[1].dtstart.getDate());

            var newEra2 = era.substractPeriod(p3);
            assert.equal(1, newEra2.periods.length);
        });



        it('substract era with one period', function() {
            var era1 = new jurassic.Era();
            var era2 = new jurassic.Era();

            var p1 = new jurassic.Period();
            p1.dtstart = new Date(2015, 1, 1);
            p1.dtend = new Date(2015, 1, 7);

            var p2 = new jurassic.Period();
            p2.dtstart = new Date(2015, 1, 5);
            p2.dtend = new Date(2015, 1, 6);

            era1.addPeriod(p1);
            era2.addPeriod(p2);

            var newEra1 = era1.substractEra(era2);
            assert.equal(2, newEra1.periods.length);
        });


        it('substract era with 2 periods on hours', function() {
            var era1 = new jurassic.Era();
            var era2 = new jurassic.Era();

            var p1 = new jurassic.Period();
            p1.dtstart = new Date(2015, 1, 2, 7, 0, 0);
            p1.dtend = new Date(2015, 1, 2, 9, 0, 1);


            var p2 = new jurassic.Period();
            p2.dtstart = new Date(2015, 1, 2, 6, 0, 0);
            p2.dtend = new Date(2015, 1, 2, 10, 30, 0);

            var p3 = new jurassic.Period();
            p3.dtstart = new Date(2015, 1, 2, 8, 0, 0);
            p3.dtend = new Date(2015, 1, 2, 9, 0, 0);

            var p4 = new jurassic.Period();
            p4.dtstart = new Date(2015, 1, 2, 10, 0, 0);
            p4.dtend = new Date(2015, 1, 2, 10, 10, 0);


            era1.addPeriod(p1);
            era1.addPeriod(p2);
            era2.addPeriod(p3);
            era2.addPeriod(p4);

            var newEra = era1.substractEra(era2);
            console.log(newEra.periods);

            assert.equal(5, newEra.periods.length);


        });



        it('Remove period by dates', function() {
            var era1 = new jurassic.Era();


            var p1 = new jurassic.Period();
            p1.dtstart = new Date(2015, 1, 1);
            p1.dtend = new Date(2015, 1, 7);

            var p2 = new jurassic.Period();
            p2.dtstart = new Date(2015, 1, 1);
            p2.dtend = new Date(2015, 1, 7);

            era1.addPeriod(p1);
            era1.removePeriod(p2);

            assert.equal(0, era1.periods.length);

        });
    });
});
