var abbr = require('./abbreviations.js').abbr;
var pos = require('pos');
var tagger = new pos.Tagger();

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
   var w = "";
   for (i = 0; i < tokens.length ; i++) {
     w = w + tokens[i] + ' ';
   }
   //console.log("words " + w);
   var j = 0;
   var posArray = [];
   var words = new pos.Lexer().lex(w);
   var taggedWords = tagger.tag(words);
   for (i in taggedWords) {
     var tw = taggedWords[i];
     if (!/[^a-zA-Z]/.test(tw[0])) {
       //console.log(tw[0] + ' ' + tw[1]);
       posArray[j] = tw[1];
       j = j + 1;
     }
   }

   //console.log('PosArray' + posArray);
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
     temp = temp + tokens[i] + ' ';
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
         //Decimal Numbers.
         if (!isNaN(next)) {
           continue;
         }
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
         if (next.length == 2 && next[0].toUpperCase() == next[0] && isDotLastCharacter(next) &&
             tokens[i].length == 2 && tokens[i].toUpperCase() == tokens[i] && isDotLastCharacter(tokens[i])) {
           continue;
         }

         if (next[0].toUpperCase() == next[0]) {
           //B.H.Obama was a great president
           //Even though O is uppercase there is a relationship
           //between the next token and the part of speech of the
           //subsequent token.
           if (posArray[i+2] === "VBZ" ||
               posArray[i+2] === "VBD" ||
               tokens[i+2] === "who" ||
               tokens[i+2] === "whose") {
             continue;
           }
            if (next.length == 2 && next[0].toUpperCase() == next[0] && isDotLastCharacter(next)) {
              if (tokens[i].length <= 3) {
                continue;
              }
              results.push(temp);
              temp = "";
              continue;
            }

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
