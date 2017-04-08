const MongoClient = require('mongodb').MongoClient;
const Assert = require('assert');
const URL = 'mongodb://hackathon-2017:Jph0uufc0sgKksgujtu5MGZyyKpHoNSIkpMKe234C8aKfuWK6oEOKCf7lk7UuBO5bW3yAbb9IYDICozIV4Ta9Q==@hackathon-2017.documents.azure.com:10250/?ssl=true';
module.exports = {
    
    /**
     * @params: {collectionName: '', identifier: {field: 'value'}}
     */
    findAllDocuments: (params, callback) => {
        MongoClient.connect(URL, (err, db) => {
            Assert.equal(null, err);
            let collection = db.collection(params.collectionName);
            collection.find(params.identifier).toArray((err, docs) => {
                Assert.equal(err, null);
                callback(docs);
            });
            db.close();
        });
    },

    /**
     * @params: {collectionName: '', identifier: {field: 'value'}}
     */
    deleteDocument: (params, callback) => {
        MongoClient.connect(URL, (err, db) => {
            Assert.equal(null, err);
            let collection = db.collection(params.collectionName);
            collection.deleteOne(params.identifier, (err, result) => {
                Assert.equal(err, null);
                Assert.equal(1, result.result.n);
                callback(result);
            });
            db.close();
        });
    },

    /**
     * @params: {collectionName: '', identifier: {field: 'value'}, value: {}}
     */
    updateDocument: (params, callback) => {
        MongoClient.connect(URL, (err, db) => {
            Assert.equal(null, err);
            let collection = db.collection(params.collectionName);
            collection.updateOne(params.identifier, { $set: params.value }, (err, result) => {
                Assert.equal(err, null);
                callback(result);
            });
            db.close();
        });
    },

    /**
     * @params: {collectionName: '', collection: [{user: 1}, {user: 2}, {user: 3}]}
     */
    insertDocuments: (params, callback) => {
        MongoClient.connect(URL, (err, db) => {
            Assert.equal(null, err);
            let collection = db.collection(params.collectionName.toString());
            collection.insertMany(params.collection, (err, result) => {
                Assert.equal(err, null);
                callback(result);
            });
            db.close();
        });
    }

}
