var chakram = require('chakram'),
    expect = chakram.expect;
var config = require('./config');


describe("Trattamenti endpoint", function() {

    var createdUsers = [];
    var pazienteGlobal = undefined;
    var consultoGlobal = undefined;
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

          var consulto = {
            "id": 0,
            "pazienteId": 0,
            "data": "2017-12-23T17:50:35.283Z",
            "problemaIniziale": "string"
          }
        
        chakram.post(config.backendBaseUrl + '/pazienti', paziente)
            .then(function (createResp) {
                pazienteGlobal = createResp.body;
                consulto.pazienteId = pazienteGlobal.id;
                return chakram.post(config.backendBaseUrl + '/consulti', consulto);
            })            
            .then(function (createResp) {
                consultoGlobal = createResp.body;
                done();
            });;
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

    it("should be possible to create an trattamento", function () {
        var entity = {
            "id": 0,
            "pazienteId": pazienteGlobal.id,
            "consultoId": consultoGlobal.id,
            "data": "2017-12-25T17:02:37.556Z",
            "descrizione": "string"
        };

        var resp = chakram.post(config.backendBaseUrl + '/trattamenti', entity);
        expect(resp).to.have.json(function (created) {
            expect(created.id).to.be.gt(0);
            expect(created.pazienteId).to.equal(pazienteGlobal.id);
            expect(created.consultoId).to.equal(consultoGlobal.id);
            entityGlobal = created;
          });

        return chakram.wait();
    });

    it("should be possible to update an trattamento", function () {

        var entity = {
            "id": entityGlobal.id,
            "pazienteId": pazienteGlobal.id,
            "consultoId": consultoGlobal.id,
            "data": "2018-12-25T17:02:37.556Z",
            "descrizione": "string 2"
          }

        var resp = chakram.put(config.backendBaseUrl + "/trattamenti/" + entityGlobal.id, entity);
        expect(resp).to.have.json(function (updated) {
            expect(updated).to.deep.equal(entity);
            entityGlobal = updated;
          });

        return chakram.wait();        
    });

    it("should be possible to retrieve an trattamento", function () {
        
        var resp = chakram.get(config.backendBaseUrl + `/pazienti/${pazienteGlobal.id}`);
        expect(resp).to.have.json(function (paziente) {
            const consulto = paziente.consulti[0];
            expect(consulto.trattamenti).to.have.length(1);
            expect(consulto.trattamenti[0].id).to.equal(entityGlobal.id);
        });
        return chakram.wait(); 
    });  
    
    it("should be possible to delete an trattamento", function () {
        
        var resp = chakram.delete(config.backendBaseUrl + "/trattamenti/" + entityGlobal.id);
        expect(resp).to.have.status(200);
        return chakram.wait(); 
    });     

    it("should be possible to retrieve no trattamento", function () {
        
        var resp = chakram.get(config.backendBaseUrl + `/pazienti/${pazienteGlobal.id}`);
        expect(resp).to.have.json(function (paziente) {
            const consulto = paziente.consulti[0];
            expect(consulto.trattamenti).to.have.length(0);
        });
        return chakram.wait(); 
    });  
});