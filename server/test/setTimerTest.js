var supertest = require("supertest");
let chai = require('chai');
let server = supertest.agent("http://localhost:80");

describe('/POST /timers', () => {
    it('It should Create a new timer', (done) => {
        let timer = {
            hours: 0,
            minutes: 0,
            seconds: 10,
            url: "http://testmoca:5000"
        }
        server
            .post('/timers')
            .send(timer)
            .end((err, res) => {
                res.status.should.be.eql(200);
                res.body.should.be.a('object');
                res.body.should.have.property('id');
                done();
            });
    });
});

describe('POST *500 /timers', () => {
    it('It should Create a new timer', (done) => {
        for (let i = 0; i < 500 ; i++) {
            let timer = {
                hours: 0,
                minutes: 0,
                seconds: Math.random() * 10,
                url: "http://testmoca:5000"
            }
            server
                .post('/timers')
                .send(timer)
                .end((err, res) => {
                    res.status.should.be.eql(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('id');
                });
        }
        done();
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