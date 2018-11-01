
const mongoose = require('mongoose');

var Schema = mongoose.Schema;

const mySchema = new Schema({

    "compnos": Number,
    "naturecode": String,
    "incident_type_description": String,
    "main_crimecode": String,
    "reptdistrict": String,
    "reportingarea": Number,
    "fromdate": String,
    "weapontype": String,
    "shooting": Boolean,
    "domestic": Boolean,
    "shift": String,
    "year": Number,
    "month": Number,
    "day_week": String,
    "ucrpart": String,
    "x": Number,
    "y": Number,
    "streetname": String,
    "xstreetname": String,
    "location": String
})

const myModel = mongoose.model('crime', mySchema)

const Handlers = {};

Handlers.accueil = (request, h) => {

    return "Bienvenue dans l'API";
}

Handlers.all = (request, h) => {

    return myModel.find({ incident_type_description: "FORGERY" });
}

Handlers.type = (request, h) => {
    var type = request.params.name
    return myModel.find({ incident_type_description: type });
}

Handlers.weapontype = (request, h) => {
    var type = request.params.name
    return myModel.find({ weapontype: type });
}

Handlers.put = (request, h) => {
    let query = { compnos: 12 }
    myModel.update(query, { compnos: 300 }, { multi: true }, function (err, raw) {
        if (err) return err;
        console.log('The raw response from Mongo was ', raw);
    });

    return "its ok";
}

Handlers.post = (request, h) => {
    const docu = new myModel(
        {
            "compnos": 12,
            "naturecode": "String",
            "incident_type_description": "String",
            "main_crimecode": "String",
            "reptdistrict": "String",
            "reportingarea": 12,
            "fromdate": "String",
            "weapontype": "String",
            "shooting": false,
            "domestic": false,
            "shift": "String",
            "year": 3,
            "month": 2,
            "day_week": "String",
            "ucrpart": "String",
            "x": 4,
            "y": 5,
            "streetname": "String",
            "xstreetname": "String",
            "location": "String"
        })

    docu.save(function (err, docu) {
        if (err) return console.error(err);
        console.log(docu)
        console.log(" saved to crime collection.");
    })
    return "it's ok";
}

Handlers.delete = (request, h) => {
    myModel.deleteMany({ naturecode: 'String' }, function (err) {// deleted at most one tank document, use deleteMany() for many
        if (err) return handleError(err);
        console.log(" deleted from crime collection.");

    });
    return "it's ok";
}

Handlers.putpost = (request, h) => {
    console.log(request.payload)
    return request.payload;
}

Handlers.mongotest = (request, h) => {

    return myModel.find({ year: 2015 })

}

module.exports = Handlers;