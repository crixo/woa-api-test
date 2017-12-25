var chakram = require('chakram'),
    expect = chakram.expect;
var config = require('./config');


describe("Consulti endpoint", function() {

    var createdUsers = [];
    var pazienteGlobal = undefined;
    var consultoGlobal = undefined;


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
                pazienteGlobal = createResp.body;
                done();
            });
    });

    after(function() {
        // runs after all tests in this block
        if(pazienteGlobal!==undefined){
            console.log(`after -> deleting user ${pazienteGlobal.id}`);
            chakram.delete(config.backendBaseUrl + "/pazienti/" + pazienteGlobal.id);
        }

    });

    beforeEach(function() {
        // runs before each test in this block
    });

    afterEach(function() {
        // runs after each test in this block
    });

    it("should be possible to create a consulto", function () {
        var consulto = {
            "id": 0,
            "pazienteId": pazienteGlobal.id,
            "data": "2017-12-23T17:50:35.283Z",
            "problemaIniziale": "string"
          }

        var resp = chakram.post(config.backendBaseUrl + "/consulti", consulto);
        expect(resp).to.have.json(function (created) {
            expect(created.id).to.be.gt(0);
            expect(created.pazienteId).to.equal(pazienteGlobal.id);
            consultoGlobal = created;
          });

        return chakram.wait();
    });

    it("should be possible to update a consulto", function () {

        var consulto = {
            "id": consultoGlobal.id,
            "pazienteId": pazienteGlobal.id,
            "data": "2018-12-23T17:50:35.283Z",
            "problemaIniziale": "string 2"
          }

        var resp = chakram.put(config.backendBaseUrl + "/consulti/" + consultoGlobal.id, consulto);
        expect(resp).to.have.json(function (updated) {
            expect(updated).to.deep.equal(consulto);
            consultoGlobal = updated;
          });

        return chakram.wait();        
    });

    it("should be possible to retrieve consulti", function () {
        
        var resp = chakram.get(config.backendBaseUrl + `/pazienti/${pazienteGlobal.id}`);
        return expect(resp).to.have.json(function (paziente) {
            expect(paziente.consulti).to.have.length(1);
            expect(paziente.consulti[0].id).to.equal(consultoGlobal.id);
        });
    });     
});