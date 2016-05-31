var edge = require('edge');


module.exports.empresas = function(dsn, callback) {
    var netLib = edge.func({
        assemblyFile: 'ProNetLib.dll',
        typeName: 'ProNetLib.SQLAny',
        methodName: 'Invoke'
    });

    netLib("empresas#" + dsn, function(err, result) {
        // general error
        if (err) {
            callback(err, null);
            return;
        }
        // specific error
        if (result.indexOf('ERROR') > -1) {
            var error = new Error(result);
            callback(error, null);
            return;
        }
        callback(null, result);
    });
};


module.exports.clientes = function(dsn, callback) {
    var netLib = edge.func({
        assemblyFile: 'ProNetLib.dll',
        typeName: 'ProNetLib.SQLAny',
        methodName: 'Invoke'
    });

    netLib("clientes#" + dsn, function(err, result) {
        // general error
        if (err) {
            callback(err, null);
            return;
        }
        // specific error
        if (result.indexOf('ERROR') > -1) {
            var error = new Error(result);
            callback(error, null);
            return;
        }
        callback(null, result);
    });
};

module.exports.comerciales = function(dsn, callback) {
    var netLib = edge.func({
        assemblyFile: 'ProNetLib.dll',
        typeName: 'ProNetLib.SQLAny',
        methodName: 'Invoke'
    });

    netLib("comerciales#" + dsn, function(err, result) {
        // general error
        if (err) {
            callback(err, null);
            return;
        }
        // specific error
        if (result.indexOf('ERROR') > -1) {
            var error = new Error(result);
            callback(error, null);
            return;
        }
        callback(null, result);
    });
};