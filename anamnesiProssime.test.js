var chakram = require('chakram'),
    expect = chakram.expect;
var config = require('./config');


describe("Anamnesi Prossime endpoint", function() {

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

    it("should be possible to create an anamnesi prossima", function () {
        var entity = {
            "pazienteId": pazienteGlobal.id,
            "consultoId": consultoGlobal.id,
            "primaVolta": "string",
            "tipologia": "string",
            "localizzazione": "string",
            "irradiazione": "string",
            "periodoInsorgenza": "string",
            "durata": "string",
            "familiarita": "string",
            "altreTerapie": "string",
            "varie": "string"
        };

        var resp = chakram.post(config.backendBaseUrl + '/anamnesi-prossime', entity);
        expect(resp).to.have.json(function (created) {
            expect(created.pazienteId).to.equal(pazienteGlobal.id);
            expect(created.consultoId).to.equal(consultoGlobal.id);
            entityGlobal = created;
          });

        return chakram.wait();
    });

    it("should be possible to update an anamnesi prossima", function () {

        var entity = {
            "pazienteId": pazienteGlobal.id,
            "consultoId": consultoGlobal.id,
            "primaVolta": "string 2",
            "tipologia": "string 2",
            "localizzazione": "string 2",
            "irradiazione": "string 2",
            "periodoInsorgenza": "string 2",
            "durata": "string 2",
            "familiarita": "string 2",
            "altreTerapie": "string 2",
            "varie": "string 2"
          }

        var resp = chakram.put(config.backendBaseUrl + "/anamnesi-prossime/" + entityGlobal.consultoId, entity);
        expect(resp).to.have.json(function (updated) {
            expect(updated).to.deep.equal(entity);
            entityGlobal = updated;
          });

        return chakram.wait();        
    });

    it("should be possible to retrieve an anamnesi prossima", function () {
        
        var resp = chakram.get(config.backendBaseUrl + `/pazienti/${pazienteGlobal.id}`);
        return expect(resp).to.have.json(function (paziente) {
            const consulto = paziente.consulti[0];
            expect(consulto.anamnesiProssima).to.deep.equal(entityGlobal);
        });
    });  
    
    it("should be possible to delete an anamnesi prossima", function () {
        
        var resp = chakram.delete(config.backendBaseUrl + "/anamnesi-prossime/" + entityGlobal.consultoId);
        expect(resp).to.have.status(200);
        return chakram.wait(); 
    });     

    it("should be possible to retrieve no valutazione", function () {
        
        var resp = chakram.get(config.backendBaseUrl + `/pazienti/${pazienteGlobal.id}`);
        expect(resp).to.have.json(function (paziente) {
            const consulto = paziente.consulti[0];
            expect(consulto).to.not.have.property('anamnesiProssima');
        });
        return chakram.wait(); 
    });  
});