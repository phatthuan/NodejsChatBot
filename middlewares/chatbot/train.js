const Dictionary = require(__base + '/models/dictionary')

module.exports = async function trainNlpManager(manager) {
    const dictionaries = await Dictionary.find({});

    for (const dictionary of dictionaries) {
        for (const word of dictionary.words) {
            manager.addDocument(dictionary.language, word.question, word.intent);
            manager.addAnswer(dictionary.language, word.intent, word.answer);
        }
    }

    await manager.train();
    manager.save();
}