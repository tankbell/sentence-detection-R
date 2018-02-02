var openNLP = require("opennlp");

var OpenNLPSentenceDetector = function() {};

OpenNLPSentenceDetector.prototype.detect = function(alg,
                                                    para,
                                                    callback) {
   //console.log("OSD " + alg);
   var sent = para;
   var sentenceDetector = new openNLP().sentenceDetector;
   sentenceDetector.sentDetect(sentence, function(err, results) {
      console.log(results);
    });
};

exports.OpenNLPSentenceDetector = OpenNLPSentenceDetector;
