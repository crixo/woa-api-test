var chakram = require('chakram'),
    expect = chakram.expect;
var config = require('./config');

console.log(config.backendBaseUrl);

describe("Pazienti endpoint", function() {

    var createdUsers = [];
    var createdGlobal = undefined;

    before(function (done) {
        // runs before all tests in this block

        var paziente = {
            "id": 0,
            "cognome": "string",
            "nome": "string",
            "indirizzo": "string",
            "citta": "string",
            "professione": "string",
            "email": "string",
            "telefono": "string",
            "cellulare": "string",
            "prov": "string",
            "cap": "string",
            "dataDiNascita": "2017-12-23T00:00:00"
          };
        
        chakram.post(config.backendBaseUrl + '/pazienti', paziente)
            .then(function (createResp) {
                createdGlobal = createResp.body;
                console.log('before');
                done();
            });

        
        //return chakram.wait();

        // chakram.addMethod("limit", function (respObj, limit) {
        //     expect(respObj).to.have.schema({
        //         required: ["records", "totalRecords"],
        //         properties: {
        //             totalRecords: {type: "integer"},
        //             records: {type: "array"}
        //         }
        //     });
        //     expect(respObj).to.have.json('records', function (records) {
        //         expect(records).to.have.length(limit);
        //     });

        //     //console.log(respObj.body.records);
        //     expect(respObj.body.records).to.have.length(limit);
        // });
    });

    after(function() {
        // runs after all tests in this block
        if(createdGlobal!==undefined){
            console.log(`after -> deleting user ${createdGlobal.id}`);
            chakram.delete(config.backendBaseUrl + "/pazienti/" + createdGlobal.id);
        }

    });

    beforeEach(function() {
        // runs before each test in this block

        var test = this.currentTest;
        var toBeSkipped = [
            //'should be possible to create a paziente',
            //'should be possible to update a paziente'
        ];
        if(toBeSkipped.includes(test.title)){
            this.skip();
        }
    });

    afterEach(function() {
        // runs after each test in this block
        createdUsers.forEach(id => {
            console.log(`deleting user ${id}`);
            chakram.delete(config.backendBaseUrl + "/pazienti/" + id);
        });
    });

  
    it("should support pagination size", function () {
        
        var resp = chakram.get(config.backendBaseUrl + "/pazienti/page/0/10");
        expect(resp).to.have.json('records', function (records) {
            expect(records).to.have.length(10);
        });
        return chakram.wait();
    });

    it("should return 204 for a not existing paziente", function () {
        
        var resp = chakram.get(config.backendBaseUrl + "/pazienti/123456789");
        return expect(resp).to.have.status(204);
    });

    it("should be possible to retrieve a paziente by id", function () {
        
        var resp = chakram.get(config.backendBaseUrl + `/pazienti/${createdGlobal.id}`);
        expect(resp).to.have.json(function (paziente) {
            delete paziente.anamnesiRemote;
            delete paziente.consulti;
            expect(paziente).to.deep.equal(createdGlobal);
        });
        return chakram.wait();
    });    

    it("should be possible to create a paziente", function () {
        expect(createdGlobal.id).to.be.gt(0);
    });

    it("should be possible to update a paziente", function () {

          var pazienteToUpdate = {
            "id": createdGlobal.id,
            "cognome": "string 1",
            "nome": "string 2",
            "indirizzo": "string 3",
            "citta": "string 4",
            "professione": "string 5",
            "email": "string 6",
            "telefono": "string 7",
            "cellulare": "string 8",
            "prov": "string 9",
            "cap": "string 10",
            "dataDiNascita": "2018-12-23T00:00:00Z"
          };          
        
        var promise = chakram.put(config.backendBaseUrl + '/pazienti/'+pazienteToUpdate.id, pazienteToUpdate)
        .then(function (updateResp) {
            var updated = updateResp.body;
            expect(updated.id).to.equal(pazienteToUpdate.id);
            expect(updated).to.deep.equal(pazienteToUpdate);
        });
        return chakram.waitFor([promise]);
    });
});