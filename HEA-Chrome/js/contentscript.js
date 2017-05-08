// ##########################################################################
// ### Ben Alman's replaceText plugin
// ### http://www.benalman.com/projects/jquery-replacetext-plugin/
$.fn.replaceText = function( search, replace, text_only ) {
    return this.each(function(){
        var node = this.firstChild,
            val,
            new_val,
            remove = [];
        if ( node ) {
            do {
                if ( node.nodeType === 3 ) {
                    val = node.nodeValue;
                    new_val = val.replace( search, replace );
                    if ( new_val !== val ) {
                        if ( !text_only && /</.test( new_val ) ) {
                            $(node).before( new_val );
                            remove.push( node );
                        } else {
                            node.nodeValue = new_val;
                        }
                    }
                }
            } while ( node = node.nextSibling );
        }
        remove.length && $(remove).remove();
    });
};

// ### test the replaceText function
//$("*").replaceText( /1755/g, "1755 [11755 <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]");



// ##########################################################################
// #### Extract the text from body and place it into an array
var bodyText = $('body').text();
bodyText = bodyText.replace(/(\r\n|\n|\r)/gm," ");
//console.log(bodyText);

var bodyTextArray = [];
bodyTextArray = $.each(bodyText.split(" ").slice(0,-1), function(index, item) { });
// console.log(bodyTextArray);



// ##########################################################################
// #### simple clean
// function cleanArray(arrayToBeCleaned) {
//     // the function cleans the array of empty strings and strings containing only whitespace
//     var cleanedArray = new Array();
//     for (var i = 0; i < arrayToBeCleaned.length; i++) {
//         if (arrayToBeCleaned[i] && /\S/.test(arrayToBeCleaned[i])) {
//             cleanedArray.push(arrayToBeCleaned[i]);
//         }
//   }
//   return cleanedArray;
// }
//
// cleanedArray = cleanArray(bodyTextArray);
// console.log(cleanedArray)



// ##########################################################################
// #### keep in array i, i+1, i-1 if i has one or more numbers
function cleanArray(arrayToBeCleaned) {
    // the function cleans the array of empty strings and strings containing only whitespace
    var firstCleanArray = new Array();
    var secondCleanArray = new Array();
    for (var i = 0; i < arrayToBeCleaned.length; i++) {
        if (/\b\d+\b/.test(arrayToBeCleaned[i]) && /\S/.test(arrayToBeCleaned[i]) && !/\d+]/.test(arrayToBeCleaned[i]) && !/p+\.\s\d+/.test(arrayToBeCleaned[i])) {
            firstCleanArray.push(arrayToBeCleaned[i-1]);
            firstCleanArray.push(arrayToBeCleaned[i]);
            firstCleanArray.push(arrayToBeCleaned[i+1]);
        }
    }
    for (var i = 0; i < firstCleanArray.length; i++) {
        if (firstCleanArray[i] !== firstCleanArray[i+1] && firstCleanArray[i] !== firstCleanArray[i+2] && /\S/.test(firstCleanArray[i])) {
            secondCleanArray.push(firstCleanArray[i]);
        }
    }
    return secondCleanArray;
}

var cleanedArray = cleanArray(bodyTextArray);
console.log(cleanedArray)



// ##########################################################################
// #### make array of arrays to contain the detected numbers that are years
function makeArrays(arrayToBeChecked) {
    var arrayOfYears = {};

    arrayOfYears["FiveDigitsYearBCE"] = [];
    arrayOfYears["FiveDigitsYearBC"] = [];

    arrayOfYears["FourDigitsYear"] = [];
    arrayOfYears["FourDigitsYearAD"] = [];
    arrayOfYears["FourDigitsYearCE"] = [];
    arrayOfYears["FourDigitsAndS"] = [];
    arrayOfYears["FourDigitsDashFourDigits"] = [];
    arrayOfYears["FourDigitsDashOneTwoDigits"] = [];
    arrayOfYears["FourDigitsYearBCE"] = [];
    arrayOfYears["FourDigitsYearBC"] = [];

    arrayOfYears["ThreeDigitsYearAD"] = [];
    arrayOfYears["ThreeDigitsYearCE"] = [];
    arrayOfYears["ThreeDigitsYear"] = [];
    arrayOfYears["ThreeDigitsDashThreeDigits"] = [];
    arrayOfYears["ThreeDigitsDashOneTwoDigits"] = [];
    arrayOfYears["ThreeDigitsYearBCE"] = [];
    arrayOfYears["ThreeDigitsYearBC"] = [];

    arrayOfYears["TwoDigitsYearAD"] = [];
    arrayOfYears["TwoDigitsYearCE"] = [];
    arrayOfYears["TwoDigitsDashOneTwoDigitsAD"] = [];
    arrayOfYears["TwoDigitsDashOneTwoDigitsCE"] = [];
    arrayOfYears["TwoDigitsYearBCE"] = [];
    arrayOfYears["TwoDigitsYearBC"] = [];

    arrayOfYears["OneDigitYearAD"] = [];
    arrayOfYears["OneDigitYearCE"] = [];
    arrayOfYears["OneDigitYearBC"] = [];
    arrayOfYears["OneDigitYearBCE"] = [];

    for (var i = 0; i < arrayToBeChecked.length; i++) {
        if (/\b\d{5}\b/.test(arrayToBeChecked[i]) && /BCE/.test(arrayToBeChecked[i+1])) {
            arrayOfYears["FiveDigitsYearBCE"].push(parseInt(/\b\d{5}\b/.exec(arrayToBeChecked[i])[0]));
        } else if (/\b\d{5}\b/.test(arrayToBeChecked[i]) && /BC/.test(arrayToBeChecked[i+1])) {
            arrayOfYears["FiveDigitsYearBC"].push(parseInt(/\b\d{5}\b/.exec(arrayToBeChecked[i])[0]));
        } else if (/\b\d{4}\b/.test(arrayToBeChecked[i]) && /BCE/.test(arrayToBeChecked[i+1])) {
            arrayOfYears["FourDigitsYearBCE"].push(parseInt(/\b\d{4}\b/.exec(arrayToBeChecked[i])[0]));
        } else if (/\b\d{4}\b/.test(arrayToBeChecked[i]) && /BC/.test(arrayToBeChecked[i+1])) {
            arrayOfYears["FourDigitsYearBC"].push(parseInt(/\b\d{4}\b/.exec(arrayToBeChecked[i])[0]));
        } else if (/\b\d{3}\b/.test(arrayToBeChecked[i]) && /BCE/.test(arrayToBeChecked[i+1])) {
            arrayOfYears["ThreeDigitsYearBCE"].push(parseInt(/\b\d{3}\b/.exec(arrayToBeChecked[i])[0]));
        } else if (/\b\d{3}\b/.test(arrayToBeChecked[i]) && /BC/.test(arrayToBeChecked[i+1])) {
            arrayOfYears["ThreeDigitsYearBC"].push(parseInt(/\b\d{3}\b/.exec(arrayToBeChecked[i])[0]));
        } else if (/\b\d{2}\b/.test(arrayToBeChecked[i]) && /BCE/.test(arrayToBeChecked[i+1])) {
            arrayOfYears["TwoDigitsYearBCE"].push(parseInt(/\b\d{2}\b/.exec(arrayToBeChecked[i])[0]));
        } else if (/\b\d{2}\b/.test(arrayToBeChecked[i]) && /BC/.test(arrayToBeChecked[i+1])) {
            arrayOfYears["TwoDigitsYearBC"].push(parseInt(/\b\d{2}\b/.exec(arrayToBeChecked[i])[0]));
        } else if (/\b\d{1}\b/.test(arrayToBeChecked[i]) && /BCE/.test(arrayToBeChecked[i+1])) {
            arrayOfYears["OneDigitYearBCE"].push(parseInt(/\b\d{1}\b/.exec(arrayToBeChecked[i])[0]));
        } else if (/\b\d{1}\b/.test(arrayToBeChecked[i]) && /BC/.test(arrayToBeChecked[i+1])) {
            arrayOfYears["OneDigitYearBC"].push(parseInt(/\b\d{1}\b/.exec(arrayToBeChecked[i])[0]));
        } else if (/\b\d{1}\b/.test(arrayToBeChecked[i]) && /AD/.test(arrayToBeChecked[i+1])) {
            arrayOfYears["OneDigitYearAD"].push(parseInt(/\b\d{1}\b/.exec(arrayToBeChecked[i])[0]));
        } else if (/\b\d{1}\b/.test(arrayToBeChecked[i]) && /CE/.test(arrayToBeChecked[i+1])) {
            arrayOfYears["OneDigitYearCE"].push(parseInt(/\b\d{1}\b/.exec(arrayToBeChecked[i])[0]));
        } else if (/\b\d{2}(–|-)\d{1,2}\b/.test(arrayToBeChecked[i])
                    && !/p+\.\s\d{2}/.test(arrayToBeChecked[i])
                    && !/p+\.\s/.test(arrayToBeChecked[i-1])
                    && /AD/.test(arrayToBeChecked[i+1])) {
            var twoDashOneTwoDigitsArrayAD = [];
            var matchTwoDashOneTwoDigitsAD = /\b(\d{2})(–|-)(\d{1,2})\b/.exec(arrayToBeChecked[i]);
            twoDashOneTwoDigitsArrayAD[0] = parseInt(RegExp.$1);
            twoDashOneTwoDigitsArrayAD[1] = parseInt(RegExp.$3);
            arrayOfYears["TwoDigitsDashOneTwoDigitsAD"].push(twoDashOneTwoDigitsArrayAD);
        } else if (/\b\d{2}(–|-)\d{1,2}\b/.test(arrayToBeChecked[i])
                    && !/p+\.\s\d{2}/.test(arrayToBeChecked[i])
                    && !/p+\.\s/.test(arrayToBeChecked[i-1])
                    && /CE/.test(arrayToBeChecked[i+1])) {
            var twoDashOneTwoDigitsArrayCE = [];
            var matchTwoDashOneTwoDigitsCE = /\b(\d{2})(–|-)(\d{1,2})\b/.exec(arrayToBeChecked[i]);
            twoDashOneTwoDigitsArrayCE[0] = parseInt(RegExp.$1);
            twoDashOneTwoDigitsArrayCE[1] = parseInt(RegExp.$3);
            arrayOfYears["TwoDigitsDashOneTwoDigitsCE"].push(twoDashOneTwoDigitsArrayCE);
        } else if (/\b\d{2}\b/.test(arrayToBeChecked[i]) && /AD/.test(arrayToBeChecked[i+1])) {
            arrayOfYears["TwoDigitsYearAD"].push(parseInt(/\b\d{2}\b/.exec(arrayToBeChecked[i])[0]));
        } else if (/\b\d{2}\b/.test(arrayToBeChecked[i]) && /CE/.test(arrayToBeChecked[i+1])) {
            arrayOfYears["TwoDigitsYearCE"].push(parseInt(/\b\d{2}\b/.exec(arrayToBeChecked[i])[0]));
        } else  if (/\b\d{3}\b/.test(arrayToBeChecked[i]) && /AD/.test(arrayToBeChecked[i+1])) {
            arrayOfYears["ThreeDigitsYearAD"].push(parseInt(/\b\d{3}\b/.exec(arrayToBeChecked[i])[0]));
        } else if (/\b\d{3}\b/.test(arrayToBeChecked[i]) && /CE/.test(arrayToBeChecked[i+1])) {
            arrayOfYears["ThreeDigitsYearCE"].push(parseInt(/\b\d{3}\b/.exec(arrayToBeChecked[i])[0]));
        } else if (/\b\d{4}\b/.test(arrayToBeChecked[i]) && /AD/.test(arrayToBeChecked[i+1])) {
            arrayOfYears["FourDigitsYearAD"].push(parseInt(/\b\d{4}\b/.exec(arrayToBeChecked[i])[0]));
        } else if (/\b\d{4}\b/.test(arrayToBeChecked[i]) && /CE/.test(arrayToBeChecked[i+1])) {
            arrayOfYears["FourDigitsYearCE"].push(parseInt(/\b\d{4}\b/.exec(arrayToBeChecked[i])[0]));
        } else if (/\b\d{3}\b(?!])(?!:)/.test(arrayToBeChecked[i])
                    && !/(–|-)/i.test(arrayToBeChecked[i])
                    && !/p+\.\s\d{3}/.test(arrayToBeChecked[i])
                    && !/p+\.\s/.test(arrayToBeChecked[i-1])
                    && /(in|by|during|year|ca\.|c\.|late|january|february|march|april|may|june|july|august|september|october|november|december)/i.test(arrayToBeChecked[i-1])
                    && !/AD/.test(arrayToBeChecked[i+1])
                    && !/BC/.test(arrayToBeChecked[i+1])) {
            arrayOfYears["ThreeDigitsYear"].push(parseInt(/\b\d{3}\b/.exec(arrayToBeChecked[i])[0]));
        } else if (/\b\d{3}(–|-)\d{3}\b/.test(arrayToBeChecked[i])
                    && !/p+\.\s\d{3}/.test(arrayToBeChecked[i])
                    && !/p+\.\s/.test(arrayToBeChecked[i-1])) {
            var dashThreeDigitsArray = [];
            var matchDashThreeDigits = /\b(\d{3})(–|-)(\d{3})\b/.exec(arrayToBeChecked[i]);
            dashThreeDigitsArray[0] = parseInt(RegExp.$1);
            dashThreeDigitsArray[1] = parseInt(RegExp.$3);
            arrayOfYears["ThreeDigitsDashThreeDigits"].push(dashThreeDigitsArray);
        } else if (/\b\d{3}(–|-)\d{1,2}\b/.test(arrayToBeChecked[i])
                    && !/p+\.\s\d{1,2}/.test(arrayToBeChecked[i])
                    && !/p+\.\s/.test(arrayToBeChecked[i-1])) {
            var threeDashOneTwoDigitsArray = [];
            var matchThreeDashTwoDigits = /\b(\d{3})(–|-)(\d{1,2})\b/.exec(arrayToBeChecked[i]);
            threeDashOneTwoDigitsArray[0] = parseInt(RegExp.$1);
            threeDashOneTwoDigitsArray[1] = parseInt(RegExp.$3);
            arrayOfYears["ThreeDigitsDashOneTwoDigits"].push(threeDashOneTwoDigitsArray);
        } else if (/\b\d{4}s/.test(arrayToBeChecked[i])) {
            var fourDigitsAndSValue = /\b\d{4}s/.exec(arrayToBeChecked[i]);
            arrayOfYears["FourDigitsAndS"].push(parseInt(fourDigitsAndSValue[0].slice(0,4)));
        } else if (/\b\d{4}(–|-)\d{4}\b/.test(arrayToBeChecked[i])) {
            var dashFourDigitsArray = [];
            var matchDashFourDigits = /\b(\d{4})(–|-)(\d{4})\b/.exec(arrayToBeChecked[i]);
            dashFourDigitsArray[0] = parseInt(RegExp.$1);
            dashFourDigitsArray[1] = parseInt(RegExp.$3);
            arrayOfYears["FourDigitsDashFourDigits"].push(dashFourDigitsArray);
        } else if (/\b\d{4}(–|-)\d{1,2}\b/.test(arrayToBeChecked[i])) {
            var fourDashOneTwoDigitsArray = [];
            var matchFourDashTwoDigits = /\b(\d{4})(–|-)(\d{1,2})\b/.exec(arrayToBeChecked[i]);
            fourDashOneTwoDigitsArray[0] = parseInt(RegExp.$1);
            fourDashOneTwoDigitsArray[1] = parseInt(RegExp.$3);
            arrayOfYears["FourDigitsDashOneTwoDigits"].push(fourDashOneTwoDigitsArray);
        } else if (/\b\d{4}\b/.test(arrayToBeChecked[i]) && !/[a-zA-Z]/.test(arrayToBeChecked[i])
                    && !/BC/.test(arrayToBeChecked[i+1])
                    && !/AD/.test(arrayToBeChecked[i+1])) {
            if (parseInt(/\b\d{4}\b/.exec(arrayToBeChecked[i])[0]) <= 2200 && parseInt(/\b\d{4}\b/.exec(arrayToBeChecked[i])[0]) >= 1000) {
                arrayOfYears["FourDigitsYear"].push(parseInt(/\b\d{4}\b/.exec(arrayToBeChecked[i])[0]));
            }
        }
    }

    // #### for testing
    // for (var i = 0; i < arrayToBeChecked.length; i++) {
    //     if (/\b\d{3}\b/.test(arrayToBeChecked[i])
    //                && !/(–|-)/i.test(arrayToBeChecked[i])
    //                && !/p+.\s\d{3}/.test(arrayToBeChecked[i])
    //                && !/p+.\s\d{3}/.test(arrayToBeChecked[i-1])
    //                && /(in|by|during|year|ca\.|c\.|late|january|february|march|april|may|june|july|august|september|october|november|december)/i.test(arrayToBeChecked[i-1])
    //                && !/AD/.test(arrayToBeChecked[i+1])
    //                && !/BC/.test(arrayToBeChecked[i+1])) {
    //        arrayOfYears["ThreeDigitsYear"].push(parseInt(/\b\d{3}\b/.exec(arrayToBeChecked[i])[0]));
    //    }
    // }

    return arrayOfYears;
}

arrayOfYears = makeArrays(cleanedArray);
//console.log(arrayOfYears);



// ##########################################################################
// #### making items from the array of arrays unique
function unique(arrayToBeChecked) {
    if (typeof arrayToBeChecked != 'undefined') {
        if (typeof(arrayToBeChecked[0])==="number") {
            return Array.from(new Set(arrayToBeChecked));
        } else if (typeof(arrayToBeChecked[0])==="object") {
            var seen = {};
            return arrayToBeChecked.filter(function(item) {
                return seen.hasOwnProperty(item) ? false : (seen[item] = true);
            });
        }
    }
}


arrayOfYears["FiveDigitsYearBC"] = unique(arrayOfYears["FiveDigitsYearBC"]);
arrayOfYears["FiveDigitsYearBCE"] = unique(arrayOfYears["FiveDigitsYearBCE"]);

arrayOfYears["FourDigitsYear"] = unique(arrayOfYears["FourDigitsYear"]);
arrayOfYears["FourDigitsYearAD"] = unique(arrayOfYears["FourDigitsYearAD"]);
arrayOfYears["FourDigitsAndS"] = unique(arrayOfYears["FourDigitsAndS"]);
arrayOfYears["FourDigitsDashFourDigits"] = unique(arrayOfYears["FourDigitsDashFourDigits"]);
arrayOfYears["FourDigitsDashOneTwoDigits"] = unique(arrayOfYears["FourDigitsDashOneTwoDigits"]);
arrayOfYears["FourDigitsYearBC"] = unique(arrayOfYears["FourDigitsYearBC"]);
arrayOfYears["FourDigitsYearBCE"] = unique(arrayOfYears["FourDigitsYearBCE"]);

arrayOfYears["ThreeDigitsYear"] = unique(arrayOfYears["ThreeDigitsYear"]);
arrayOfYears["ThreeDigitsYearAD"] = unique(arrayOfYears["ThreeDigitsYearAD"]);
arrayOfYears["ThreeDigitsYearCE"] = unique(arrayOfYears["ThreeDigitsYearCE"]);
arrayOfYears["ThreeDigitsDashThreeDigits"] = unique(arrayOfYears["ThreeDigitsDashThreeDigits"]);
arrayOfYears["ThreeDigitsDashOneTwoDigits"] = unique(arrayOfYears["ThreeDigitsDashOneTwoDigits"]);
arrayOfYears["ThreeDigitsYearBC"] = unique(arrayOfYears["ThreeDigitsYearBC"]);
arrayOfYears["ThreeDigitsYearBCE"] = unique(arrayOfYears["ThreeDigitsYearBCE"]);

arrayOfYears["TwoDigitsYearAD"] = unique(arrayOfYears["TwoDigitsYearAD"]);
arrayOfYears["TwoDigitsYearCE"] = unique(arrayOfYears["TwoDigitsYearCE"]);
arrayOfYears["TwoDigitsDashOneTwoDigitsAD"] = unique(arrayOfYears["TwoDigitsDashOneTwoDigitsAD"]);
arrayOfYears["TwoDigitsDashOneTwoDigitsCE"] = unique(arrayOfYears["TwoDigitsDashOneTwoDigitsCE"]);
arrayOfYears["TwoDigitsYearBC"] = unique(arrayOfYears["TwoDigitsYearBC"]);
arrayOfYears["TwoDigitsYearBCE"] = unique(arrayOfYears["TwoDigitsYearBCE"]);

arrayOfYears["OneDigitYearAD"] = unique(arrayOfYears["OneDigitYearAD"]);
arrayOfYears["OneDigitYearCE"] = unique(arrayOfYears["OneDigitYearCE"]);
arrayOfYears["OneDigitYearBC"] = unique(arrayOfYears["OneDigitYearBC"]);
arrayOfYears["OneDigitYearBCE"] = unique(arrayOfYears["OneDigitYearBCE"]);

console.log(arrayOfYears);



// ##########################################################################
// #### replacement rules based on the years that are in the arrays of arrays

// #### Five Digits
if (typeof arrayOfYears["FiveDigitsYearBC"] != 'undefined') {
    for(var i = 0; i < arrayOfYears["FiveDigitsYearBC"].length; i++) {
        if (arrayOfYears["FiveDigitsYearBC"][i] < 10001) {
            heYear = 10001 - arrayOfYears["FiveDigitsYearBC"][i];
            // console.log(heYear);
            var regexString = '((?!([–])).|^)\\b(' + arrayOfYears["FiveDigitsYearBC"][i] + '\\sBC)\\b(?!–)(?!s)'; // combination of lookbehind and lookahead for en-dash, and lookahead for s
            //console.log(regexString);
            var regex = new RegExp(regexString, "i");
            var replaceString = ' $3' + ' [' + heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
            //var replaceString = heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>';
            //var replaceString = heYear;
            //console.log(replaceString);
            $("*").replaceText(regex, replaceString);
        } else  {
            heYear = arrayOfYears["FiveDigitsYearBC"][i] - 10000;
            // console.log(heYear);
            var regexString = '((?!([–])).|^)\\b(' + arrayOfYears["FiveDigitsYearBC"][i] + '\\sBC)\\b(?!–)(?!s)'; // combination of lookbehind and lookahead for en-dash, and lookahead for s
            //console.log(regexString);
            var regex = new RegExp(regexString, "i");
            var replaceString = ' $3' + ' [' + heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">BHE</a>]';
            //var replaceString = heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>';
            //var replaceString = heYear;
            //console.log(replaceString);
            $("*").replaceText(regex, replaceString);
        }
    }
}

if (typeof arrayOfYears["FiveDigitsYearBCE"] != 'undefined') {
    for(var i = 0; i < arrayOfYears["FiveDigitsYearBCE"].length; i++) {
        if (arrayOfYears["FiveDigitsYearBCE"][i] < 10001) {
            heYear = 10001 - arrayOfYears["FiveDigitsYearBCE"][i];
            // console.log(heYear);
            var regexString = '((?!([–])).|^)\\b(' + arrayOfYears["FiveDigitsYearBCE"][i] + '\\sBCE)\\b(?!–)(?!s)'; // combination of lookbehind and lookahead for en-dash, and lookahead for s
            //console.log(regexString);
            var regex = new RegExp(regexString, "i");
            var replaceString = ' $3' + ' [' + heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
            //var replaceString = heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>';
            //var replaceString = heYear;
            //console.log(replaceString);
            $("*").replaceText(regex, replaceString);
        } else  {
            heYear = arrayOfYears["FiveDigitsYearBCE"][i] - 10000;
            // console.log(heYear);
            var regexString = '((?!([–])).|^)\\b(' + arrayOfYears["FiveDigitsYearBCE"][i] + '\\sBCE)\\b(?!–)(?!s)'; // combination of lookbehind and lookahead for en-dash, and lookahead for s
            //console.log(regexString);
            var regex = new RegExp(regexString, "i");
            var replaceString = ' $3' + ' [' + heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">BHE</a>]';
            //var replaceString = heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>';
            //var replaceString = heYear;
            //console.log(replaceString);
            $("*").replaceText(regex, replaceString);
        }
    }
}


// #### Four Digits
// #### AD/CE
if (typeof arrayOfYears["FourDigitsYear"] != 'undefined') {
    for(var i = 0; i < arrayOfYears["FourDigitsYear"].length; i++) {
        heYear = arrayOfYears["FourDigitsYear"][i] + 10000;
        //console.log(heYear);
        var regexString = '((?!([–])).|^)\\b(' + arrayOfYears["FourDigitsYear"][i] + ')\\b(?!–)(?!s)(?!\\sAD)(?!\\sCE)(?!\\sBC)'; // combination of lookahead for en-dash, minus, BC, AD, and lookahead for s. ((?!([–])).|^)    ((?!([–|BC\\s|BCE\\s|AD\\s])).|^)- lookbehind for en-dash, not really working
        //console.log(regexString);
        var regex = new RegExp(regexString, "i");
        //console.log(regex);
        var replaceString = ' $3' + ' [' + heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
        //var replaceString = heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>';
        //var replaceString = heYear;
        //console.log(replaceString);
        $("*").replaceText(regex, replaceString);
    }
}

if (typeof arrayOfYears["FourDigitsYearAD"] != 'undefined') {
    for(var i = 0; i < arrayOfYears["FourDigitsYearAD"].length; i++) {
        heYear = arrayOfYears["FourDigitsYearAD"][i] + 10000;
        // console.log(heYear);
        var regexString = '((?!([–])).|^)\\b(' + arrayOfYears["FourDigitsYearAD"][i] + '\\sAD)\\b(?!–)(?!s)(?!\\sBC)'; // combination of lookbehind and lookahead for en-dash, and lookahead for s
        //console.log(regexString);
        var regex = new RegExp(regexString, "i");
        var replaceString = ' $3' + ' [' + heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
        //var replaceString = heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>';
        //var replaceString = heYear;
        //console.log(replaceString);
        $("*").replaceText(regex, replaceString);
    }
}

if (typeof arrayOfYears["FourDigitsYearCE"] != 'undefined') {
    for(var i = 0; i < arrayOfYears["FourDigitsYearCE"].length; i++) {
        heYear = arrayOfYears["FourDigitsYearCE"][i] + 10000;
        // console.log(heYear);
        var regexString = '((?!([–])).|^)\\b(' + arrayOfYears["FourDigitsYearCE"][i] + '\\sCE)\\b(?!–)(?!s)(?!\\sBC)'; // combination of lookbehind and lookahead for en-dash, and lookahead for s
        //console.log(regexString);
        var regex = new RegExp(regexString, "i");
        var replaceString = ' $3' + ' [' + heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
        //var replaceString = heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>';
        //var replaceString = heYear;
        //console.log(replaceString);
        $("*").replaceText(regex, replaceString);
    }
}

if (typeof arrayOfYears["FourDigitsAndS"] != 'undefined') {
    for(var i = 0; i < arrayOfYears["FourDigitsAndS"].length; i++) {
        heYear = arrayOfYears["FourDigitsAndS"][i] + 10000;
        // console.log(heYear);
        var regexString = arrayOfYears["FourDigitsAndS"][i] + 's';
        var regex = new RegExp(regexString, "");
        var replaceString = arrayOfYears["FourDigitsAndS"][i] + 's' + ' [' + heYear + 's' + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
        //var replaceString = heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>';
        //var replaceString = heYear;
        //console.log(replaceString);
        $("*").replaceText(regex, replaceString);
    }
}

if (typeof arrayOfYears["FourDigitsDashFourDigits"] != 'undefined') {
    for(var i = 0; i < arrayOfYears["FourDigitsDashFourDigits"].length; i++) {
        if (arrayOfYears["FourDigitsDashFourDigits"][i][0] < 2200) {
            heYearOne = arrayOfYears["FourDigitsDashFourDigits"][i][0] + 10000;
            heYearTwo = arrayOfYears["FourDigitsDashFourDigits"][i][1] + 10000;
            //console.log(heYearOne, heYearTwo);
            var regexString = '((?!([–|-])).|^)\\b(' + arrayOfYears["FourDigitsDashFourDigits"][i][0] + '(–|-)' + arrayOfYears["FourDigitsDashFourDigits"][i][1] + ')\\b(?!\\sBC)(?!\\sBCE)(?!-\\d+-\\d+-\\d+)';
            //console.log(regexString);
            var regex = new RegExp(regexString, "");
            var replaceString = ' $3' + ' [' + heYearOne + '–' + heYearTwo + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
            //var replaceString = heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>';
            //var replaceString = heYear;
            //console.log(replaceString);
            $("*").replaceText(regex, replaceString);
        }
    }
}

if (typeof arrayOfYears["FourDigitsDashOneTwoDigits"] != 'undefined') {
    for(var i = 0; i < arrayOfYears["FourDigitsDashOneTwoDigits"].length; i++) {
        if (arrayOfYears["FourDigitsDashOneTwoDigits"][i][0] < 2200) {
            heYearOne = arrayOfYears["FourDigitsDashOneTwoDigits"][i][0] + 10000;
            heYearTwo = arrayOfYears["FourDigitsDashOneTwoDigits"][i][1];
            //console.log(heYearOne, heYearTwo);
            var regexString = '\\b(' + arrayOfYears["FourDigitsDashOneTwoDigits"][i][0] + '(–|-)' + arrayOfYears["FourDigitsDashOneTwoDigits"][i][1] + ')\\b(?!\\sBC)(?!\\sBCE)(?!-\\d+-\\d+-\\d+)';
            //console.log(regexString);
            var regex = new RegExp(regexString, "");
            var replaceString = '$1' + ' [' + heYearOne + '–' + heYearTwo + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
            //var replaceString = heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>';
            //var replaceString = heYear;
            //console.log(replaceString);
            $("*").replaceText(regex, replaceString);
        }
    }
}

// #### BC/BCE
if (typeof arrayOfYears["FourDigitsYearBC"] != 'undefined') {
    for(var i = 0; i < arrayOfYears["FourDigitsYearBC"].length; i++) {
        heYear = 10001 - arrayOfYears["FourDigitsYearBC"][i];
        // console.log(heYear);
        var regexString = '((?!([–])).|^)\\b(' + arrayOfYears["FourDigitsYearBC"][i] + '\\sBC)\\b(?!–)(?!s)'; // combination of lookbehind and lookahead for en-dash, and lookahead for s
        //console.log(regexString);
        var regex = new RegExp(regexString, "i");
        var replaceString = ' $3' + ' [' + heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
        //var replaceString = heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>';
        //var replaceString = heYear;
        //console.log(replaceString);
        $("*").replaceText(regex, replaceString);
    }
}

if (typeof arrayOfYears["FourDigitsYearBCE"] != 'undefined') {
    for(var i = 0; i < arrayOfYears["FourDigitsYearBCE"].length; i++) {
        heYear = 10001 - arrayOfYears["FourDigitsYearBCE"][i];
        // console.log(heYear);
        var regexString = '((?!([–])).|^)\\b(' + arrayOfYears["FourDigitsYearBCE"][i] + '\\sBCE)\\b(?!–)(?!s)'; // combination of lookbehind and lookahead for en-dash, and lookahead for s
        //console.log(regexString);
        var regex = new RegExp(regexString, "i");
        var replaceString = ' $3' + ' [' + heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
        //var replaceString = heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>';
        //var replaceString = heYear;
        //console.log(replaceString);
        $("*").replaceText(regex, replaceString);
    }
}


// #### Three Digits
// #### AD/CE
if (typeof arrayOfYears["ThreeDigitsYear"] != 'undefined') {
    for(var i = 0; i < arrayOfYears["ThreeDigitsYear"].length; i++) {
        heYear = arrayOfYears["ThreeDigitsYear"][i] + 10000;
        // console.log(heYear);
        var regexString = '((?!([–|-])).|^)\\b(' + arrayOfYears["ThreeDigitsYear"][i] + ')\\b(?!–)(?!])(?!s)(?!\\sBC)(?!\\sBCE)(?!\\sAD)(?!\\sCE)'; // combination of lookbehind and lookahead for en-dash, and lookahead for s
        //console.log(regexString);
        var regex = new RegExp(regexString, "i");
        var replaceString = ' $3' + ' [' + heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
        //var replaceString = heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>';
        //var replaceString = heYear;
        //console.log(replaceString);
        $("*").replaceText(regex, replaceString);
    }
}

if (typeof arrayOfYears["ThreeDigitsYearAD"] != 'undefined') {
    for(var i = 0; i < arrayOfYears["ThreeDigitsYearAD"].length; i++) {
        heYear = arrayOfYears["ThreeDigitsYearAD"][i] + 10000;
        // console.log(heYear);
        var regexString = '((?!([–])).|^)\\b(' + arrayOfYears["ThreeDigitsYearAD"][i] + '\\sAD)\\b(?!–)(?!s)(?!\\sBC)'; // combination of lookbehind and lookahead for en-dash, and lookahead for s
        //console.log(regexString);
        var regex = new RegExp(regexString, "i");
        var replaceString = ' $3' + ' [' + heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
        //var replaceString = heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>';
        //var replaceString = heYear;
        //console.log(replaceString);
        $("*").replaceText(regex, replaceString);
    }
}

if (typeof arrayOfYears["ThreeDigitsYearCE"] != 'undefined') {
    for(var i = 0; i < arrayOfYears["ThreeDigitsYearCE"].length; i++) {
        heYear = arrayOfYears["ThreeDigitsYearCE"][i] + 10000;
        // console.log(heYear);
        var regexString = '((?!([–])).|^)\\b(' + arrayOfYears["ThreeDigitsYearCE"][i] + '\\sCE)\\b(?!–)(?!s)(?!\\sBC)'; // combination of lookbehind and lookahead for en-dash, and lookahead for s
        //console.log(regexString);
        var regex = new RegExp(regexString, "i");
        var replaceString = ' $3' + ' [' + heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
        //var replaceString = heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>';
        //var replaceString = heYear;
        //console.log(replaceString);
        $("*").replaceText(regex, replaceString);
    }
}

if (typeof arrayOfYears["ThreeDigitsDashThreeDigits"] != 'undefined') {
    for(var i = 0; i < arrayOfYears["ThreeDigitsDashThreeDigits"].length; i++) {
        heYearOne = arrayOfYears["ThreeDigitsDashThreeDigits"][i][0] + 10000;
        heYearTwo = arrayOfYears["ThreeDigitsDashThreeDigits"][i][1] + 10000;
        //console.log(heYearOne, heYearTwo);
        var regexString = '((?!([–|-|:])).|^)\\b(' + arrayOfYears["ThreeDigitsDashThreeDigits"][i][0] + '(–|-)' + arrayOfYears["ThreeDigitsDashThreeDigits"][i][1] + ')\\b(?!\\sBC)(?!\\sBCE)(?!-\\d+-\\d+)';
        //console.log(regexString);
        var regex = new RegExp(regexString, "");
        var replaceString = '$3' + ' [' + heYearOne + '–' + heYearTwo + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
        //var replaceString = heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>';
        //var replaceString = heYear;
        //console.log(replaceString);
        $("*").replaceText(regex, replaceString);
    }
}

if (typeof arrayOfYears["ThreeDigitsDashOneTwoDigits"] != 'undefined') {
    for(var i = 0; i < arrayOfYears["ThreeDigitsDashOneTwoDigits"].length; i++) {
        heYearOne = arrayOfYears["ThreeDigitsDashOneTwoDigits"][i][0] + 10000;
        heYearTwo = arrayOfYears["ThreeDigitsDashOneTwoDigits"][i][1];
        //console.log(heYearOne, heYearTwo);
        var regexString = '((?!([–|-])).|^)\\b(' + arrayOfYears["ThreeDigitsDashOneTwoDigits"][i][0] + '(–|-)' + arrayOfYears["ThreeDigitsDashOneTwoDigits"][i][1] + ')\\b(?!\\sBC)(?!\\sBCE)(?!-\\d+-\\d+-\\d+)';
        //console.log(regexString);
        var regex = new RegExp(regexString, "");
        var replaceString = '$3' + ' [' + heYearOne + '–' + heYearTwo + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
        //var replaceString = heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>';
        //var replaceString = heYear;
        //console.log(replaceString);
        $("*").replaceText(regex, replaceString);
    }
}

// #### BC/BCE
if (typeof arrayOfYears["ThreeDigitsYearBC"] != 'undefined') {
    for(var i = 0; i < arrayOfYears["ThreeDigitsYearBC"].length; i++) {
        heYear = 10001 - arrayOfYears["ThreeDigitsYearBC"][i];
        // console.log(heYear);
        var regexString = '((?!([–])).|^)\\b(' + arrayOfYears["ThreeDigitsYearBC"][i] + '\\sBC)\\b(?!–)(?!s)'; // combination of lookbehind and lookahead for en-dash, and lookahead for s
        //console.log(regexString);
        var regex = new RegExp(regexString, "i");
        var replaceString = ' $3' + ' [' + heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
        //var replaceString = heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>';
        //var replaceString = heYear;
        //console.log(replaceString);
        $("*").replaceText(regex, replaceString);
    }
}

if (typeof arrayOfYears["ThreeDigitsYearBCE"] != 'undefined') {
    for(var i = 0; i < arrayOfYears["ThreeDigitsYearBCE"].length; i++) {
        heYear = 10001 - arrayOfYears["ThreeDigitsYearBCE"][i];
        // console.log(heYear);
        var regexString = '((?!([–])).|^)\\b(' + arrayOfYears["ThreeDigitsYearBCE"][i] + '\\sBCE)\\b(?!–)(?!s)'; // combination of lookbehind and lookahead for en-dash, and lookahead for s
        //console.log(regexString);
        var regex = new RegExp(regexString, "i");
        var replaceString = ' $3' + ' [' + heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
        //var replaceString = heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>';
        //var replaceString = heYear;
        //console.log(replaceString);
        $("*").replaceText(regex, replaceString);
    }
}


// #### Two Digits
// #### AD/CE
if (typeof arrayOfYears["TwoDigitsYearAD"] != 'undefined') {
    for(var i = 0; i < arrayOfYears["TwoDigitsYearAD"].length; i++) {
        heYear = arrayOfYears["TwoDigitsYearAD"][i] + 10000;
        // console.log(heYear);
        var regexString = '((?!([–])).|^)\\b(' + arrayOfYears["TwoDigitsYearAD"][i] + '\\sAD)\\b(?!–)(?!s)(?!\\sBC)'; // combination of lookbehind and lookahead for en-dash, and lookahead for s
        //console.log(regexString);
        var regex = new RegExp(regexString, "i");
        var replaceString = ' $3' + ' [' + heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
        //var replaceString = heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>';
        //var replaceString = heYear;
        //console.log(replaceString);
        $("*").replaceText(regex, replaceString);
    }
}

if (typeof arrayOfYears["TwoDigitsYearCE"] != 'undefined') {
    for(var i = 0; i < arrayOfYears["TwoDigitsYearCE"].length; i++) {
        heYear = arrayOfYears["TwoDigitsYearCE"][i] + 10000;
        // console.log(heYear);
        var regexString = '((?!([–])).|^)\\b(' + arrayOfYears["TwoDigitsYearCE"][i] + '\\sCE)\\b(?!–)(?!s)(?!\\sBC)'; // combination of lookbehind and lookahead for en-dash, and lookahead for s
        //console.log(regexString);
        var regex = new RegExp(regexString, "i");
        var replaceString = ' $3' + ' [' + heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
        //var replaceString = heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>';
        //var replaceString = heYear;
        //console.log(replaceString);
        $("*").replaceText(regex, replaceString);
    }
}

if (typeof arrayOfYears["TwoDigitsDashOneTwoDigitsAD"] != 'undefined') {
    for(var i = 0; i < arrayOfYears["TwoDigitsDashOneTwoDigitsAD"].length; i++) {
        heYearOne = arrayOfYears["TwoDigitsDashOneTwoDigitsAD"][i][0] + 10000;
        heYearTwo = arrayOfYears["TwoDigitsDashOneTwoDigitsAD"][i][1];
        //console.log(heYearOne, heYearTwo);
        var regexString = '\\b(' + arrayOfYears["TwoDigitsDashOneTwoDigitsAD"][i][0] + '(–|-)' + arrayOfYears["TwoDigitsDashOneTwoDigitsAD"][i][1] + ')\\b(?!\\sBC)(?!\\sBCE)(?!\\sCE)(?=\\sAD)';
        //console.log(regexString);
        var regex = new RegExp(regexString, "");
        var replaceString = '$1' + ' [' + heYearOne + '–' + heYearTwo + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
        //var replaceString = heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>';
        //var replaceString = heYear;
        //console.log(replaceString);
        $("*").replaceText(regex, replaceString);
    }
}

if (typeof arrayOfYears["TwoDigitsDashOneTwoDigitsCE"] != 'undefined') {
    for(var i = 0; i < arrayOfYears["TwoDigitsDashOneTwoDigitsCE"].length; i++) {
        heYearOne = arrayOfYears["TwoDigitsDashOneTwoDigitsCE"][i][0] + 10000;
        heYearTwo = arrayOfYears["TwoDigitsDashOneTwoDigitsCE"][i][1];
        //console.log(heYearOne, heYearTwo);
        var regexString = '\\b(' + arrayOfYears["TwoDigitsDashOneTwoDigitsCE"][i][0] + '(–|-)' + arrayOfYears["TwoDigitsDashOneTwoDigitsCE"][i][1] + ')\\b(?!\\sBC)(?!\\sBCE)(?!\\sAD)(?=\\sCE)';
        //console.log(regexString);
        var regex = new RegExp(regexString, "");
        var replaceString = '$1' + ' [' + heYearOne + '–' + heYearTwo + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
        //var replaceString = heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>';
        //var replaceString = heYear;
        //console.log(replaceString);
        $("*").replaceText(regex, replaceString);
    }
}

// #### BC/BCE
if (typeof arrayOfYears["TwoDigitsYearBC"] != 'undefined') {
    for(var i = 0; i < arrayOfYears["TwoDigitsYearBC"].length; i++) {
        heYear = 10001 - arrayOfYears["TwoDigitsYearBC"][i];
        // console.log(heYear);
        var regexString = '((?!([–])).|^)\\b(' + arrayOfYears["TwoDigitsYearBC"][i] + '\\sBC)\\b(?!–)(?!s)'; // combination of lookbehind and lookahead for en-dash, and lookahead for s
        //console.log(regexString);
        var regex = new RegExp(regexString, "i");
        var replaceString = ' $3' + ' [' + heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
        //var replaceString = heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>';
        //var replaceString = heYear;
        //console.log(replaceString);
        $("*").replaceText(regex, replaceString);
    }
}

if (typeof arrayOfYears["TwoDigitsYearBCE"] != 'undefined') {
    for(var i = 0; i < arrayOfYears["TwoDigitsYearBCE"].length; i++) {
        heYear = 10001 - arrayOfYears["TwoDigitsYearBCE"][i];
        // console.log(heYear);
        var regexString = '((?!([–])).|^)\\b(' + arrayOfYears["TwoDigitsYearBCE"][i] + '\\sBCE)\\b(?!–)(?!s)'; // combination of lookbehind and lookahead for en-dash, and lookahead for s
        //console.log(regexString);
        var regex = new RegExp(regexString, "i");
        var replaceString = ' $3' + ' [' + heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
        //var replaceString = heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>';
        //var replaceString = heYear;
        //console.log(replaceString);
        $("*").replaceText(regex, replaceString);
    }
}

// #### One Digit
// #### AD/CE
if (typeof arrayOfYears["OneDigitYearAD"] != 'undefined') {
    for(var i = 0; i < arrayOfYears["OneDigitYearAD"].length; i++) {
        heYear = arrayOfYears["OneDigitYearAD"][i] + 10000;
        // console.log(heYear);
        var regexString = '((?!([–])).|^)\\b(' + arrayOfYears["OneDigitYearAD"][i] + '\\sAD)\\b(?!–)(?!s)(?!\\sBC)'; // combination of lookbehind and lookahead for en-dash, and lookahead for s
        //console.log(regexString);
        var regex = new RegExp(regexString, "i");
        var replaceString = ' $3' + ' [' + heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
        //var replaceString = heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>';
        //var replaceString = heYear;
        //console.log(replaceString);
        $("*").replaceText(regex, replaceString);
    }
}

if (typeof arrayOfYears["OneDigitYearCE"] != 'undefined') {
    for(var i = 0; i < arrayOfYears["OneDigitYearCE"].length; i++) {
        heYear = arrayOfYears["OneDigitYearCE"][i] + 10000;
        // console.log(heYear);
        var regexString = '((?!([–|-])).|^)\\b(' + arrayOfYears["OneDigitYearCE"][i] + '\\sCE)\\b(?!–)(?!s)(?!\\sBC)'; // combination of lookbehind and lookahead for en-dash, and lookahead for s
        //console.log(regexString);
        var regex = new RegExp(regexString, "i");
        var replaceString = ' $3' + ' [' + heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
        //var replaceString = heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>';
        //var replaceString = heYear;
        //console.log(replaceString);
        $("*").replaceText(regex, replaceString);
    }
}

// #### BC/BCE
if (typeof arrayOfYears["OneDigitYearBC"] != 'undefined') {
    for(var i = 0; i < arrayOfYears["OneDigitYearBC"].length; i++) {
        heYear = 10001 - arrayOfYears["OneDigitYearBC"][i];
        // console.log(heYear);
        var regexString = '((?!([–])).|^)\\b(' + arrayOfYears["OneDigitYearBC"][i] + '\\sBC)\\b(?!–)(?!s)'; // combination of lookbehind and lookahead for en-dash, and lookahead for s
        //console.log(regexString);
        var regex = new RegExp(regexString, "i");
        var replaceString = ' $3' + ' [' + heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
        //var replaceString = heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>';
        //var replaceString = heYear;
        //console.log(replaceString);
        $("*").replaceText(regex, replaceString);
    }
}

if (typeof arrayOfYears["OneDigitYearBCE"] != 'undefined') {
    for(var i = 0; i < arrayOfYears["OneDigitYearBCE"].length; i++) {
        heYear = 10001 - arrayOfYears["OneDigitYearBCE"][i];
        // console.log(heYear);
        var regexString = '((?!([–])).|^)\\b(' + arrayOfYears["OneDigitYearBCE"][i] + '\\sBCE)\\b(?!–)(?!s)'; // combination of lookbehind and lookahead for en-dash, and lookahead for s
        //console.log(regexString);
        var regex = new RegExp(regexString, "i");
        var replaceString = ' $3' + ' [' + heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
        //var replaceString = heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>';
        //var replaceString = heYear;
        //console.log(replaceString);
        $("*").replaceText(regex, replaceString);
    }
}



// ##########################################################################
// #### Century replacement rules
for(var i = 1; i < 25; i++) {
    if (i < 10) {
        if (i == 1) {
            regexString = '\\b' + i + 'st century' + '\\b(?!\\sBC)';
            regexStringDash = '\\b' + i + 'st-century' + '\\b(?!\\sBC)';
            regexStringBC = '\\b' + i + 'st century' + '\\b\\sBCE?';
            regexStringBCDash = '\\b' + i + 'st-century' + '\\b\\sBCE?';
            regex = new RegExp (regexString, "");
            regexDash = new RegExp (regexStringDash, "");
            regexBC = new RegExp (regexStringBC, "");
            regexBCDash = new RegExp (regexStringBCDash, "");
            centuryBC = 100 - i;
            replaceString = i + 'st century' + ' [10' + i + 'st century <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
            replaceStringDash = i + 'st-century' + ' [10' + i + 'st century <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
            replaceStringBC = i + 'st century BC' + ' [' + centuryBC + 'th century <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
            replaceStringBCDash = i + 'st-century BC' + ' [' + centuryBC + 'th century <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
            $("*").replaceText(regex, replaceString);
            $("*").replaceText(regexDash, replaceStringDash);
            $("*").replaceText(regexBC, replaceStringBC);
            $("*").replaceText(regexBCDash, replaceStringBCDash);
        } else if (i == 2) {
            regexString = '\\b' + i + 'nd century' + '\\b(?!\\sBC)';
            regexStringDash = '\\b' + i + 'nd-century' + '\\b(?!\\sBC)';
            regexStringBC = '\\b' + i + 'nd century' + '\\b\\sBCE?';
            regexStringBCDash = '\\b' + i + 'nd-century' + '\\b\\sBCE?';
            regex = new RegExp (regexString, "");
            regexDash = new RegExp (regexStringDash, "");
            regexBC = new RegExp (regexStringBC, "");
            regexBCDash = new RegExp (regexStringBCDash, "");
            centuryBC = 100 - i;
            replaceString = i + 'nd century' + ' [10' + i + 'nd century <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
            replaceStringDash = i + 'nd-century' + ' [10' + i + 'nd century <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
            replaceStringBC = i + 'nd century BC' + ' [' + centuryBC + 'th century <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
            replaceStringBCDash = i + 'nd-century BC' + ' [' + centuryBC + 'th century <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
            $("*").replaceText(regex, replaceString);
            $("*").replaceText(regexDash, replaceStringDash);
            $("*").replaceText(regexBC, replaceStringBC);
            $("*").replaceText(regexBCDash, replaceStringBCDash);
        } else if (i == 3) {
            regexString = '\\b' + i + 'rd century' + '\\b(?!\\sBC)';
            regexStringDash = '\\b' + i + 'rd-century' + '\\b(?!\\sBC)';
            regexStringBC = '\\b' + i + 'rd century' + '\\b\\sBCE?';
            regexStringBCDash = '\\b' + i + 'rd-century' + '\\b\\sBCE?';
            regex = new RegExp (regexString, "");
            regexDash = new RegExp (regexStringDash, "");
            regexBC = new RegExp (regexStringBC, "");
            regexBCDash = new RegExp (regexStringBCDash, "");
            centuryBC = 100 - i;
            replaceString = i + 'rd century' + ' [10' + i + 'rd century <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
            replaceStringDash = i + 'rd-century' + ' [10' + i + 'rd century <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
            replaceStringBC = i + 'rd century BC' + ' [' + + centuryBC + 'th century <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
            replaceStringBCDash = i + 'rd-century BC' + ' [' + + centuryBC + 'th century <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
            $("*").replaceText(regex, replaceString);
            $("*").replaceText(regexDash, replaceStringDash);
            $("*").replaceText(regexBC, replaceStringBC);
            $("*").replaceText(regexBCDash, replaceStringBCDash);
        } else {
            regexString = '\\b' + i + 'th century' + '\\b(?!\\sBC)';
            regexStringDash = '\\b' + i + 'th-century' + '\\b(?!\\sBC)';
            regexStringBC = '\\b' + i + 'th century' + '\\b\\sBCE?';
            regexStringBCDash = '\\b' + i + 'th-century' + '\\b\\sBCE?';
            regex = new RegExp (regexString, "");
            regexDash = new RegExp (regexStringDash, "");
            regexBC = new RegExp (regexStringBC, "");
            regexBCDash = new RegExp (regexStringBCDash, "");
            centuryBC = 100 - i;
            replaceString = i + 'th century' + ' [10' + i + 'th century <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
            replaceStringDash = i + 'th-century' + ' [10' + i + 'th century <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
            replaceStringBC = i + 'th century BC' + ' [' + centuryBC + 'th century <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
            replaceStringBCDash = i + 'th-century BC' + ' [' + centuryBC + 'th century <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
            $("*").replaceText(regex, replaceString);
            $("*").replaceText(regexDash, replaceStringDash);
            $("*").replaceText(regexBC, replaceStringBC);
            $("*").replaceText(regexBCDash, replaceStringBCDash);
        }
    } else {
        if (i == 21) {
            regexString = '\\b' + i + 'st century' + '\\b(?!\\sBC)';
            regexStringDash = '\\b' + i + 'st-century' + '\\b(?!\\sBC)';
            regexStringBC = '\\b' + i + 'st century' + '\\b\\sBCE?';
            regexStringBCDash = '\\b' + i + 'st-century' + '\\b\\sBCE?';
            regex = new RegExp (regexString, "");
            regexDash = new RegExp (regexStringDash, "");
            regexBC = new RegExp (regexStringBC, "");
            regexBCDash = new RegExp (regexStringBCDash, "");
            centuryBC = 100 - i;
            replaceString = i + 'st century' + ' [1' + i + 'st century <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
            replaceStringDash = i + 'st-century' + ' [1' + i + 'st century <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
            replaceStringBC = i + 'st century BC' + ' [' + centuryBC + 'th century <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
            replaceStringBCDash = i + 'st-century BC' + ' [' + centuryBC + 'th century <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
            $("*").replaceText(regex, replaceString);
            $("*").replaceText(regexDash, replaceStringDash);
            $("*").replaceText(regexBC, replaceStringBC);
            $("*").replaceText(regexBCDash, replaceStringBCDash);
        } else if (i == 22) {
            regexString = '\\b' + i + 'nd century' + '\\b(?!\\sBC)';
            regexStringDash = '\\b' + i + 'nd-century' + '\\b(?!\\sBC)';
            regexStringBC = '\\b' + i + 'nd century' + '\\b\\sBCE?';
            regexStringBCDash = '\\b' + i + 'nd-century' + '\\b\\sBCE?';
            regex = new RegExp (regexString, "");
            regexDash = new RegExp (regexStringDash, "");
            regexBC = new RegExp (regexStringBC, "");
            regexBCDash = new RegExp (regexStringBCDash, "");
            centuryBC = 100 - i;
            replaceString = i + 'nd century' + ' [1' + i + 'nd century <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
            replaceStringDash = i + 'nd-century' + ' [1' + i + 'nd century <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
            replaceStringBC = i + 'nd century BC' + ' [' + centuryBC + 'th century <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
            replaceStringBCDash = i + 'nd-century BC' + ' [' + centuryBC + 'th century <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
            $("*").replaceText(regex, replaceString);
            $("*").replaceText(regexDash, replaceStringDash);
            $("*").replaceText(regexBC, replaceStringBC);
            $("*").replaceText(regexBCDash, replaceStringBCDash);
        } else if (i == 23) {
            regexString = '\\b' + i + 'rd century' + '\\b(?!\\sBC)';
            regexStringDash = '\\b' + i + 'rd-century' + '\\b(?!\\sBC)';
            regexStringBC = '\\b' + i + 'rd century' + '\\b\\sBCE?';
            regexStringBCDash = '\\b' + i + 'rd-century' + '\\b\\sBCE?';
            regex = new RegExp (regexString, "");
            regex = new RegExp (regexStringDash, "");
            regexBC = new RegExp (regexStringBC, "");
            regexBC = new RegExp (regexStringBCDash, "");
            centuryBC = 100 - i;
            replaceString = i + 'rd century' + ' [1' + i + 'rd century <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
            replaceStringDash = i + 'rd-century' + ' [1' + i + 'rd century <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
            replaceStringBC = i + 'rd century BC' + ' [' + centuryBC + 'th century <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
            replaceStringBCDash = i + 'rd-century BC' + ' [' + centuryBC + 'th century <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
            $("*").replaceText(regex, replaceString);
            $("*").replaceText(regexDash, replaceStringDash);
            $("*").replaceText(regexBC, replaceStringBC);
            $("*").replaceText(regexBCDash, replaceStringBCDash);
        } else {
            regexString = '\\b' + i + 'th century' + '\\b(?!\\sBC)';
            regexStringDash = '\\b' + i + 'th-century' + '\\b(?!\\sBC)';
            regexStringBC = '\\b' + i + 'th century' + '\\b\\sBC';
            regexStringBCDash = '\\b' + i + 'th-century' + '\\b\\sBC';
            regex = new RegExp (regexString, "");
            regexDash = new RegExp (regexStringDash, "");
            regexBC = new RegExp (regexStringBC, "");
            regexBCDash = new RegExp (regexStringBCDash, "");
            centuryBC = 100 - i;
            replaceString = i + 'th century' + ' [1' + i + 'th century <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
            replaceStringDash = i + 'th-century' + ' [1' + i + 'th century <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
            replaceStringBC = i + 'th century BC' + ' [' + centuryBC + 'th century <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
            replaceStringBCDash = i + 'th-century BC' + ' [' + centuryBC + 'th century <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
            $("*").replaceText(regex, replaceString);
            $("*").replaceText(regexDash, replaceStringDash);
            $("*").replaceText(regexBC, replaceStringBC);
            $("*").replaceText(regexBCDash, replaceStringBCDash);
        }
    }
}
