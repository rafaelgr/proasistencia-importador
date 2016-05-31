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

var insertComercial = function(comercial, server, usuario, password, callback) {
    var connection = getConnection(server, usuario, password);
    sql = "INSERT INTO comerciales SET ?";
    sql = mysql.format(sql, comercial);
    connection.query(sql, function(err, result) {
        closeConnection(connection, callback);
        if (err) {
            return callback(err);
        }
        comercial.comercialId = result.insertId;
        callback(null, comercial);
    });
}

module.exports.importarComerciales = function(dsn, server, usuario, password, callback) {
    sqlany.comerciales(dsn, function(err, result) {
        if (err) {
            console.log(chalk.bold.red(err.message));
        } else {
            comerciales = JSON.parse(result);
            console.log(chalk.bold.green("Importar comerciales"));
            var barOpts = {
                width: 20,
                total: comerciales.length,
                clear: false
            };
            var bar = new ProgressBar(' Importando... [:bar] :percent (:current de :total) Quedan :eta segundos', barOpts);
            async.eachSeries(comerciales, function(comercial, callback2) {
                insertComercial(comercial, server, usuario, password, function(err, res) {
                    bar.tick();
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
