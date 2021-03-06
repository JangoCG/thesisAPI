const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const admin = require('./config').admin
const password = require('./config').password

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

// for local connection
// mongoose.connect("mongodb://localhost:27017/thesisDB", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

// for online connection.
mongoose.connect(`mongodb+srv://${admin}:${password}@cluster0-5vxjv.mongodb.net/thesisAPI`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});




// create db schema
const consumptionSchema = {
    name: String,
    amount: Number,
    month: Number,
    year: Number
};

// create model
const Consumption = mongoose.model("Consumption", consumptionSchema);

app.route("/consumption")
    // for general requests
    .get((req, res) => {
        Consumption.find(function (err, foundRecords) {
            if (!err) {
                res.send(foundRecords);
            } else {
                res.send(err);
            }
        });
    })

    .post((req, res) => {
        const newEntry = new Consumption({
            name: req.body.name,
            amount: req.body.amount,
            month: req.body.month,
            year: req.body.year
        });
        newEntry.save(function (err) {
            if (!err) {
                res.send("Successfully added the record.");
            } else {
                res.send(err);
            }
        });
    })

    .delete((req, res) => {
        Consumption.deleteMany(function (err) {
            if (!err) {
                res.send("Successfully deleted all records.");
            } else {
                res.send(err);
            }
        })
    });

// for specific requests
app.route("/consumption/:parameterVariable")

    .get((req, res) => {
        Consumption.findOne({
            name: req.params.parameterVariable
        }, (err, foundRecords) => {
            if (foundRecords) {
                res.send(foundRecords);
            } else {
                res.send("No records found with that name.");
            }
        });
    })

    .put((req, res) => {
        Consumption.update({
            name: req.params.parameterVariable
        }, {
            name: req.body.name,
            amount: req.body.amount,
            month: req.body.month,
            year: req.body.year,
        }, {
            overwrite: true
        },
            err => {
                if (!err) {
                    res.send("Succesfully updated all records.");
                }
            }
        );
    })

    .patch((req, res) => {
        Consumption.update({
            name: req.params.parameterVariable
        }, {
            $set: req.body
        },
            err => {
                if (!err) {
                    res.send("Succesfully updated the record.")
                } else {
                    res.send(err);
                }
            }
        );
    })

    .delete((req, res) => {
        Consumption.deleteOne({
            name: req.params.parameterVariable
        },
            err => {
                if (!err) {
                    res.send("Succesfully deleted the record.");
                } else {
                    res.send();
                }
            }
        );
    });

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

app.listen(port, function () {
    console.log("Server started on port 3000")
});
