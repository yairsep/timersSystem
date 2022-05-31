var supertest = require("supertest");
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = supertest.agent("http://localhost:80");
let should = chai.should();

let testId;

describe('GET /timers/:id', () => {
    let timer = {
        hours: 0,
        minutes: 0,
        seconds: 10,
        url: "http://someserver"
    }
    before((done) => {
        server
            .post('/timers')
            .send(timer)
            .end((err, res) => {
                res.status.should.be.eql(200);
                res.body.should.be.a('object');
                res.body.should.have.property('id');
                testId = res.body.id
                done();
            });
    });
    it('Get timer by ID', (done) => {
        server
            .get(`/timers/${testId}`)
            .end((err, res) => {
                res.status.should.be.eql(200);
                res.body.should.be.a('object');
                res.body.should.have.property('id');
                res.body.should.have.property('time_left');
                done();
            });
    });

    it('Get invalid timer ID', (done) => {
        server
            .get(`/timers/-1`)
            .end((err, res) => {
                res.status.should.be.eql(500);
                done();
            });
    });
    let timer2 = {
        hours: 0,
        minutes: 0,
        seconds: 30,
        url: "http://someserver"
    }
    before((done) => {
        server
            .post('/timers')
            .send(timer2)
            .end((err, res) => {
                res.status.should.be.eql(200);
                res.body.should.be.a('object');
                res.body.should.have.property('id');
                testId = res.body.id
                done();
            });
    });

    it('Validate time left of timer', (done) => {
        server
            .get(`/timers/${testId}`)
            .end((err, res) => {
                res.status.should.be.eql(200);
                res.body.should.be.a('object');
                res.body.should.have.property('id');
                res.body.should.have.property('time_left');
                res.body.should.have.property('time_left').gt(0);
                done();
            });
    });
});

after((done) => {
    server
        .delete('/deleteAll')
        .end((err, res) => {
            res.status.should.be.eql(200);
            done();
        });
});

