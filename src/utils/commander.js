const { Command } = require('commander')

const program = new Command()

program
    .option('--mode <mode>', 'modo de trabajo de mi server', 'production')
    .parse()

module.exports = program