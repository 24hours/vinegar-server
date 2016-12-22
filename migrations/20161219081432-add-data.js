'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
    dbm = options.dbmigrate;
    type = dbm.dataType;
    seed = seedLink;
};

exports.up = function(db, callback) {
    db.createTable('dataset', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        name: 'string',
        path: 'string'
    }, callback);

    db.createTable('label', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        dataset_id: 'int',
        name: 'string'
    }, callback);

    db.createTable('data', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        dataset_id: 'int',
        name: 'string',
        path: 'string',
    }, callback);

    db.createTable('data_label', {
        label_id: 'int',
        data_id: 'int',
        data: 'string'
    }, callback);

};

exports.down = function(db, callback) {
    db.dropTable('dataset', callback);
    db.dropTable('label', callback);
    db.dropTable('data', callback);
    db.dropTable('data_label', callback);
};

exports._meta = {
  "version": 1
};
