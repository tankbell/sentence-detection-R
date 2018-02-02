var abbr = require('./abbreviations.js').abbr;

var RuleBasedSentenceDetector = function() {};

function isDotLastCharacter(str) {
    return str.indexOf('.', str.length - 1) != -1;
}

function isQMarkLastCharacter(str) {
    return str.indexOf('?', str.length - 1) != -1;
}

function isExclLastCharacter(str) {
    return str.indexOf('!', str.length - 1) != -1;
}

function isDotLastCharacter(str) {
    return str.indexOf('.', str.length - 1) != -1;
}

RuleBasedSentenceDetector.prototype.detect = function(para,
                                                      callback) {
   var sent = para;
   var wordIsAbbr = (abbr.indexOf(sent) > -1);

   var results = [];
   // Check for empty text box
   if (para == null || para.length == 0) {
     callback(null, results);
   }

   //Preprocess newlines and carriage returns and spaces.
   para = para.replace(/(\r\n|\n|\r)/gm," ");
   para = para.replace(/\s+/g," ");
   //Split by dot,q mark and exclamation and add a space.
   para = para.split('.').join('. ');
   para = para.split('?').join('? ');
   para = para.split('!').join('! ');
   //console.log(para);

   //Divide the text into words.
   var tokens = para.trim().match(/\S+|\n/g);

   console.log(tokens);
   //Create a temp string initialized to ""
   //Keep appending words to this temp string.
   //Once we add the word we think is the end of the
   //current sentence(based on some of the rules we define below)
   //push that sentence to the result array.

   //A basic sanity check. If the user entered all spaces, just return empty.
   if (tokens == null || tokens.length == 0) {
     callback(null, results);
   }
   var temp = "";
   var len = tokens.length;

   for (i = 0 ; i < len ; i++) {
     temp = temp + ' ' + tokens[i];
     console.log(temp);
     // Handle cases where dot is my last character.
     if (isDotLastCharacter(tokens[i])) {
         // Check if this word
         // is in our list of abbreviations.
         // If yes this word likely isn't
         // the end of the sentence.
         //example : Mr.XYZ lives at ABC.
         var isAbbr = (abbr.indexOf(tokens[i].toUpperCase()) > -1);
         if (isAbbr === true) {
             continue;
         }

         if (i+1 >= len) {
           results.push(temp);
           temp = "";
           continue;
         }
         // Check if the next word starts with an upper case letter.
         // Most likely this word is the end of the sentence.
         var next = tokens[i+1];
         // Quickly handle cases like "XYZ....right."
         if (next === ".") {
           continue;
         }

         // Handle cases like "I go for a walk at 5 A.M. Its refreshing."
         // The order of all these rules matter.
         // For example if the above sentence is modified to :
         // "I got for a walk at 5 A.M." , then this check would not be hit.
         // Instead the second rule will take care of that.
         // Another example : I train my bot using A.I.
         if (next.length == 2 && next[0].toUpperCase() == next[0] && isDotLastCharacter(next)) {
           continue;
         }

         if (next[0].toUpperCase() == next[0]) {
            results.push(temp);
            temp = "";
            continue;
         }
     } // End isDotLastCharacter

     if (isQMarkLastCharacter(tokens[i])) {
       results.push(temp);
       temp = "";
       continue;
     }

     if (isExclLastCharacter(tokens[i])) {
       results.push(temp);
       temp = "";
       continue;
     }

   }//End for Loop

   callback(null, results);
};

exports.RuleBasedSentenceDetector = RuleBasedSentenceDetector;
