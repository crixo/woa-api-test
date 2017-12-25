var chakram = require('chakram'),
    expect = chakram.expect;
var config = require('./config');


describe("AnamnesiRemote endpoint", function() {

    var createdUsers = [];
    var pazienteGlobal = undefined;
    var entityGlobal = undefined;


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

    it("should be possible to create an anamnesi remota", function () {
        var entity = {
            "id": 0,
            "pazienteId": pazienteGlobal.id,
            "data": "2017-12-24T00:00:00",
            "tipoId": 1,
            "descrizione": "string"
          }

        var resp = chakram.post(config.backendBaseUrl + "/anamnesi-remote", entity);
        expect(resp).to.have.json(function (created) {
            expect(created.id).to.be.gt(0);
            expect(created.pazienteId).to.equal(pazienteGlobal.id);
            entityGlobal = created;
          });

        return chakram.wait();
    });

    it("should be possible to update an anamnesi remota", function () {

        var entity = {
            "id": entityGlobal.id,
            "pazienteId": pazienteGlobal.id,
            "data": "2018-12-24T00:00:00",
            "tipoId": 2,
            "descrizione": "string"
          }

        var resp = chakram.put(config.backendBaseUrl + "/anamnesi-remote/" + entityGlobal.id, entity);
        expect(resp).to.have.json(function (updated) {
            expect(updated).to.deep.equal(entity);
            entityGlobal = updated;
          });

        return chakram.wait();        
    });

    it("should be possible to retrieve anamnesi remote", function () {
        
        var resp = chakram.get(config.backendBaseUrl + `/pazienti/${pazienteGlobal.id}`);
        return expect(resp).to.have.json(function (paziente) {
            expect(paziente.anamnesiRemote).to.have.length(1);
            expect(paziente.anamnesiRemote[0].id).to.equal(entityGlobal.id);
        });
    });     
});