var express = require('express');
const manager = require(__base + "/middlewares/chatbot/languageManager")
const History = require(__base+"models/history")
const axios = require('axios');
const API_KEY = '47638bfd01cb0f9f12ab16cb1da0a220';
var router = express.Router();

function requireLogin(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect('/login');
  }
}
router.get('/',requireLogin, function (req, res, next) {
  res.render('index',{name: req.user.name});
});

router.get('/logout', function(req, res) {
  req.logout(err =>{
    if (err) {
      console.log(err);
    }
    res.redirect('/login');
  })
});

router.post('/', async (req, res) => {
  let question = req.body.question
  let language
  await axios.post('https://ws.detectlanguage.com/0.2/detect', {
    q: question,
  }, {
    headers: {
      'Authorization': 'Bearer ' + API_KEY,
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    language = response.data.data.detections[0].language;
  }).catch((error) => {
    console.error(error);
  });
  const result = await manager.process(language, question);
  res.json(result.answer)
})

router.post('/save',async (req, res)=>{
  const question = req.body.question
  const answer = req.body.answer
  const history = new History({
    user: req.user._id,
    question: question,
    answer: answer
  })
  history.save()
})

router.get('/history',async(req, res)=>{
  const history = await History.find({user: req.user._id}).exec()
  const questionAndAnswer = []
  const answer = []
  history.forEach(item => {
    questionAndAnswer.push({question: item.question, answer: item.answer});
  });
  res.json({questionAndAnswer})
})

module.exports = router;
