var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS
var sqlany = require('../sqlany/sqlany_db_mysql');
var chalk = require('chalk');
var ProgressBar = require('progress');

// getConnection 
// función auxiliar para obtener una conexión al servidor
// de base de datos.
function getConnection(server, usuario, password) {
    var connection = mysql.createConnection({
        host: server,
        user: usuario,
        password: password,
        database: "proasistencia",
        port: 3306
    });
    connection.connect(function(err) {
        if (err) throw err;
    });
    return connection;
}

// closeConnection
// función auxiliar para cerrar una conexión
function closeConnection(connection) {
    connection.end(function(err) {
        if (err) {
            throw err;
        }
    });
}

var insertEmpresa = function(empresa, server, usuario, password, callback) {
    var connection = getConnection(server, usuario, password);
    sql = "INSERT INTO empresas SET ?";
    sql = mysql.format(sql, empresa);
    connection.query(sql, function(err, result) {
        closeConnection(connection, callback);
        if (err) {
            return callback(err);
        }
        empresa.empresaId = result.insertId;
        callback(null, empresa);
    });
}

module.exports.importarEmpresas = function(dsn, server, usuario, password, callback) {
    sqlany.empresas(dsn, function(err, result) {
        if (err) {
            console.log(chalk.bold.red(err.message));
        } else {
            empresas = JSON.parse(result);
            console.log(chalk.bold.green("Importar empresas"));
            var barOpts = {
                width: 20,
                total: empresas.length,
                clear: false
            };
            var bar2 = new ProgressBar(' Importando... [:bar] :percent Quedan :eta segundos', barOpts);
            async.eachSeries(empresas, function(empresa, callback2) {
                insertEmpresa(empresa, server, usuario, password, function(err, res) {
                    bar2.tick();
                    if (err) {
                        callback2(err);
                    } else {
                        callback2(null);
                    }
                })
            }, function(err) {
                if (err) {
                    callback(err);
                } else {
                    callback(null);
                }
            })
        }
    })
}
