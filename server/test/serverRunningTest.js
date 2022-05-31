var supertest = require("supertest");
let chai = require('chai');
let server = supertest.agent("http://localhost:80");

describe("Server is up test", function () {

    it("Should return Server is running! msg", function (done) {

        server.get("/")
            .expect("Content-type", /json/)
            .expect(200)
            .end(function (err, res) {
                res.body.message.should.equal("Server is running!");
                done();
            });
    });

});