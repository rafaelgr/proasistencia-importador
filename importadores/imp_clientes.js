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

var insertCliente = function(cliente, server, usuario, password, callback) {
    var connection = getConnection(server, usuario, password);
    sql = "INSERT INTO clientes SET ?";
    sql = mysql.format(sql, cliente);
    connection.query(sql, function(err, result) {
        closeConnection(connection, callback);
        if (err) {
            return callback(err);
        }
        cliente.clienteId = result.insertId;
        callback(null, cliente);
    });
}

module.exports.importarClientes = function(dsn, server, usuario, password, callback) {
    sqlany.clientes(dsn, function(err, result) {
        if (err) {
            console.log(chalk.bold.red(err.message));
        } else {
            clientes = JSON.parse(result);
            console.log(chalk.bold.green("Importar clientes"));
            var barOpts = {
                width: 20,
                total: clientes.length,
                clear: false
            };
            var bar = new ProgressBar(' Importando... [:bar] :percent (:current de :total) Quedan :eta segundos', barOpts);
            async.eachSeries(clientes, function(cliente, callback2) {
                insertCliente(cliente, server, usuario, password, function(err, res) {
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
