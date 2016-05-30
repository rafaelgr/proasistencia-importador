#!/usr/bin/env node

var chalk = require('chalk');
var program = require('commander');
var async = require('async');

var impEmpresas = require('./importadores/imp_empresas');
var impClientes = require('./importadores/imp_clientes');


console.log(chalk.bold.cyan('Importador proasistencia'));

program
    .option('-d, --dsn [dsn]', 'El DSN del ODBC a utilizar')
    .option('-s, --server [host]', 'El host de MYSQL (se supone que el puerto es el 3306)')
    .option('-u, --user [user]', 'Usuario MYSQL')
    .option('-p, --password [password]', 'Contraseña MYSQL')
    .parse(process.argv);

impEmpresas.importarEmpresas(program.dsn, program.server, program.user, program.password, function(err) {
    if (err) {
        console.log(err.message);
    } else {
        console.log(chalk.bold.green("Importar empresas finalizado"));
        impClientes.importarClientes(program.dsn, program.server, program.user, program.password, function(err) {
            if (err) {
                console.log(err.message);
            } else {
                console.log(chalk.bold.green("Importar clientes finalizado"));
            }
        })
    }
})


//
