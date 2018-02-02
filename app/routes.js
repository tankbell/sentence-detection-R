module.exports = function(app) {
  var OpenNLPSentenceDetector = require('./OpenNLPSD.js').OpenNLPSentenceDetector;
  var openSD = new OpenNLPSentenceDetector();
  //var openNLP = require("opennlp");

  app.get('/', function(req,res) {
    res.render('pages/sentDetect');
  });

  app.get('/cancel', function(req, res) {
    res.redirect('/');
  });

  app.get('/goback', function(req, res) {
    res.redirect('/');
  });

  app.post('/sentDetect', function(req, res) {
    var alg  = req.body.algotype;
    var para = req.body.msg;
    //console.log(alg);
    //console.log(para);
    openSD.detect(alg, para, function(err, data) {
      if (err) {
        res.send("Server Error");
      } else {
        res.render('pages/output');
      }
    });

  });
};
