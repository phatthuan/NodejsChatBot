const { NlpManager } = require('node-nlp');
const manager = new NlpManager({ languages: ['en', 'vi'] });
module.exports = manager