var openNLP = require("opennlp");

var OpenNLPSentenceDetector = function() {};

OpenNLPSentenceDetector.prototype.detect = function(alg,
                                                    para,
                                                    callback) {
   //console.log("OSD " + alg);
   var sent = para;
   var sentenceDetector = new openNLP().sentenceDetector;
   sentenceDetector.sentDetect(para, function(err, results) {
      for (i = 0; i < results.length; i++) {
          results[i] = results[i].replace(/(\r\n|\n|\r)/gm," ");
          results[i] = results[i].replace(/\s+/g," ");
      }
      callback(null, results);
    });
};

exports.OpenNLPSentenceDetector = OpenNLPSentenceDetector;
