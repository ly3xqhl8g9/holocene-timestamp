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
// $("*").replaceText( /1819/g, "1819 [11819 <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]");
// $("*").replaceText( /1783/g, "1783 [11783 <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]");


// #### Extract the text from body and place it into an array
var bodyText = $('body').text();
bodyText = bodyText.replace(/(\r\n|\n|\r)/gm," ");
//console.log(bodyText);

var bodyTextArray = [];
bodyTextArray = $.each(bodyText.split(" ").slice(0,-1), function(index, item) { });
// console.log(bodyTextArray);

function cleanArray(arrayToBeCleaned) {
    // the function cleans the array of empty strings and strings containing only whitespace
    var cleanedArray = new Array();
    for (var i = 0; i < arrayToBeCleaned.length; i++) {
        if (arrayToBeCleaned[i] && /\S/.test(arrayToBeCleaned[i])) {
            cleanedArray.push(arrayToBeCleaned[i]);
        }
  }
  return cleanedArray;
}

cleanedArray = cleanArray(bodyTextArray);
console.log(cleanedArray)


// need to make x arrays:
    // FourDigitsYearBC (10000 BC - 1000 BC),
    // ThreeDigitsYearBC (999 BC - 100 BC),
    // TwoDigitsYearBC (99 BC - 10 BC)
    // OneDigitYearBC (9 BC - 1 BC)
    // OneDigitYearAD (1 AD - 9 AD)
    // TwoDigitsYearAD (10 AD - 99 AD)
    // ThreeDigitsYearAD (1 AD - 999 AD),
    // FourDigitsYearAD (1000 AD - 2100 AD),
    // FourDigitsYear (1000 - 2100),
    // ThreeDigitsSlashThreeDigitsBC (428/427 BC) (maybe not, although)
    // FourDigitsDashFourDigits (1790–1801)
    // FourDigitsDashTwoDigits (1801–06)
    // FourDigitsAndS (1780s)

function makeArrays(arrayToBeChecked) {
    var arrayOfYears = {};
    arrayOfYears["FiveDigitsYearBC"] = [];
    arrayOfYears["FourDigitsYearBC"] = [];
    arrayOfYears["ThreeDigitsYearBC"] = [];
    arrayOfYears["TwoDigitsYearBC"] = [];
    arrayOfYears["OneDigitYearBC"] = [];
    arrayOfYears["OneDigitYearAD"] = [];
    arrayOfYears["OneDigitYearCE"] = [];
    arrayOfYears["TwoDigitsYearAD"] = [];
    arrayOfYears["TwoDigitsYearCE"] = [];
    arrayOfYears["ThreeDigitsYearAD"] = [];
    arrayOfYears["ThreeDigitsYearCE"] = [];
    arrayOfYears["ThreeDigitsYear"] = [];
    arrayOfYears["FourDigitsYearAD"] = [];
    arrayOfYears["FourDigitsAndS"] = [];
    arrayOfYears["FourDigitsDashFourDigits"] = [];
    arrayOfYears["FourDigitsDashTwoDigits"] = [];
    arrayOfYears["FourDigitsYear"] = [];
    for (var i = 0; i < arrayToBeChecked.length; i++) {
        if (/\b\d{5}\b/.test(arrayToBeChecked[i]) && /BC/.test(arrayToBeChecked[i+1])) {
            arrayOfYears["FiveDigitsYearBC"].push(parseInt(/\b\d{5}\b/.exec(arrayToBeChecked[i])[0]));
        } else if (/\b\d{4}\b/.test(arrayToBeChecked[i]) && /BC/.test(arrayToBeChecked[i+1])) {
            arrayOfYears["FourDigitsYearBC"].push(parseInt(/\b\d{4}\b/.exec(arrayToBeChecked[i])[0]));
        } else if (/\b\d{3}\b/.test(arrayToBeChecked[i]) && /BC/.test(arrayToBeChecked[i+1])) {
            arrayOfYears["ThreeDigitsYearBC"].push(parseInt(/\b\d{3}\b/.exec(arrayToBeChecked[i])[0]));
        } else if (/\b\d{2}\b/.test(arrayToBeChecked[i]) && /BC/.test(arrayToBeChecked[i+1])) {
            arrayOfYears["TwoDigitsYearBC"].push(parseInt(/\b\d{2}\b/.exec(arrayToBeChecked[i])[0]));
        } else if (/\b\d{1}\b/.test(arrayToBeChecked[i]) && /BC/.test(arrayToBeChecked[i+1])) {
            arrayOfYears["OneDigitYearBC"].push(parseInt(/\b\d{1}\b/.exec(arrayToBeChecked[i])[0]));
        } else if (/\b\d{1}\b/.test(arrayToBeChecked[i]) && /AD/.test(arrayToBeChecked[i+1])) {
            arrayOfYears["OneDigitYearAD"].push(parseInt(/\b\d{1}\b/.exec(arrayToBeChecked[i])[0]));
        } else if (/\b\d{1}\b/.test(arrayToBeChecked[i]) && /CE/.test(arrayToBeChecked[i+1])) {
            arrayOfYears["OneDigitYearCE"].push(parseInt(/\b\d{1}\b/.exec(arrayToBeChecked[i])[0]));
        } else if (/\b\d{2}\b/.test(arrayToBeChecked[i]) && /AD/.test(arrayToBeChecked[i+1])) {
            arrayOfYears["TwoDigitsYearAD"].push(parseInt(/\b\d{2}\b/.exec(arrayToBeChecked[i])[0]));
        } else if (/\b\d{2}\b/.test(arrayToBeChecked[i]) && /CE/.test(arrayToBeChecked[i+1])) {
            arrayOfYears["TwoDigitsYearCE"].push(parseInt(/\b\d{2}\b/.exec(arrayToBeChecked[i])[0]));
        } else if (/\b\d{3}\b/.test(arrayToBeChecked[i]) && /AD/.test(arrayToBeChecked[i+1])) {
            arrayOfYears["ThreeDigitsYearAD"].push(parseInt(/\b\d{3}\b/.exec(arrayToBeChecked[i])[0]));
        } else if (/\b\d{4}\b/.test(arrayToBeChecked[i]) && /AD/.test(arrayToBeChecked[i+1])) {
            arrayOfYears["FourDigitsYearAD"].push(parseInt(/\b\d{4}\b/.exec(arrayToBeChecked[i])[0]));
        } else if (/\b\d{3}\b/.test(arrayToBeChecked[i]) && /CE/.test(arrayToBeChecked[i+1])) {
            arrayOfYears["ThreeDigitsYearCE"].push(parseInt(/\b\d{3}\b/.exec(arrayToBeChecked[i])[0]));
        } else if (/\b\d{3}\b(?!])/.test(arrayToBeChecked[i])
                    && !/(–|-)/i.test(arrayToBeChecked[i])
                    && !/p+.\s\d{3}/.test(arrayToBeChecked[i])
                    && /(in|by|during|and|year|ca\.|c\.|to|between|around|late|january|february|march|april|may|june|july|august|september|october|november|december)/i.test(arrayToBeChecked[i-1])
                    && !/AD/.test(arrayToBeChecked[i+1])
                    && !/BC/.test(arrayToBeChecked[i+1])) {
            arrayOfYears["ThreeDigitsYear"].push(parseInt(/\b\d{3}\b(?!])/.exec(arrayToBeChecked[i])[0]));
        } else if (/\b\d{4}s/.test(arrayToBeChecked[i])) {
            var fourDigitsAndSValue = /\b\d{4}s/.exec(arrayToBeChecked[i]);
            arrayOfYears["FourDigitsAndS"].push(parseInt(fourDigitsAndSValue[0].slice(0,4)));
        } else if (/\b\d{4}(–|-)\d{4}\b/.test(arrayToBeChecked[i])) {
            var dashFourDigitsArray = [];
            var matchDashFourDigits = /\b(\d{4})–(\d{4})\b/.exec(arrayToBeChecked[i]);
            dashFourDigitsArray[0] = parseInt(RegExp.$1);
            dashFourDigitsArray[1] = parseInt(RegExp.$2);
            arrayOfYears["FourDigitsDashFourDigits"].push(dashFourDigitsArray);
        } else if (/\b\d{4}(–|-)\d{1,2}\b/.test(arrayToBeChecked[i])) {
            var dashTwoDigitsArray = [];
            var matchDashTwoDigits = /\b(\d{4})–(\d{1,2})\b/.exec(arrayToBeChecked[i]);
            dashTwoDigitsArray[0] = parseInt(RegExp.$1);
            dashTwoDigitsArray[1] = parseInt(RegExp.$2);
            arrayOfYears["FourDigitsDashTwoDigits"].push(dashTwoDigitsArray);
        } else if (/\b\d{4}\b/.test(arrayToBeChecked[i]) && !/[a-zA-Z]/.test(arrayToBeChecked[i])
                    && !/BC/.test(arrayToBeChecked[i+1])
                    && !/AD/.test(arrayToBeChecked[i+1])) {
            if (parseInt(/\b\d{4}\b/.exec(arrayToBeChecked[i])[0]) <= 2200 && parseInt(/\b\d{4}\b/.exec(arrayToBeChecked[i])[0]) >= 1000) {
                arrayOfYears["FourDigitsYear"].push(parseInt(/\b\d{4}\b/.exec(arrayToBeChecked[i])[0]));
            }
        }
    }
    return arrayOfYears;
}

arrayOfYears = makeArrays(cleanedArray);
//console.log(arrayOfYears);

function unique(arrayToBeChecked) {
    if (typeof(arrayToBeChecked[0])==="number") {
        return Array.from(new Set(arrayToBeChecked));
    } else if (typeof(arrayToBeChecked[0])==="object") {
        var seen = {};
        return arrayToBeChecked.filter(function(item) {
            return seen.hasOwnProperty(item) ? false : (seen[item] = true);
        });
    }
}

arrayOfYears["FourDigitsAndS"] = unique(arrayOfYears["FourDigitsAndS"]);
arrayOfYears["FourDigitsYear"] = unique(arrayOfYears["FourDigitsYear"]);
arrayOfYears["FourDigitsYearAD"] = unique(arrayOfYears["FourDigitsYearAD"]);
arrayOfYears["FourDigitsDashFourDigits"] = unique(arrayOfYears["FourDigitsDashFourDigits"]);
arrayOfYears["FourDigitsDashTwoDigits"] = unique(arrayOfYears["FourDigitsDashTwoDigits"]);
arrayOfYears["ThreeDigitsYear"] = unique(arrayOfYears["ThreeDigitsYear"]);
arrayOfYears["ThreeDigitsYearAD"] = unique(arrayOfYears["ThreeDigitsYearAD"]);
arrayOfYears["ThreeDigitsYearCE"] = unique(arrayOfYears["ThreeDigitsYearCE"]);
arrayOfYears["TwoDigitsYearAD"] = unique(arrayOfYears["TwoDigitsYearAD"]);
arrayOfYears["TwoDigitsYearCE"] = unique(arrayOfYears["TwoDigitsYearCE"]);
arrayOfYears["OneDigitYearAD"] = unique(arrayOfYears["OneDigitYearAD"]);
arrayOfYears["OneDigitYearCE"] = unique(arrayOfYears["OneDigitYearCE"]);
arrayOfYears["OneDigitYearBC"] = unique(arrayOfYears["OneDigitYearBC"]);
arrayOfYears["TwoDigitsYearBC"] = unique(arrayOfYears["TwoDigitsYearBC"]);
arrayOfYears["ThreeDigitsYearBC"] = unique(arrayOfYears["ThreeDigitsYearBC"]);
arrayOfYears["FourDigitsYearBC"] = unique(arrayOfYears["FourDigitsYearBC"]);
arrayOfYears["FiveDigitsYearBC"] = unique(arrayOfYears["FiveDigitsYearBC"]);
console.log(arrayOfYears);

if (typeof arrayOfYears["FourDigitsYear"] != 'undefined') {
    for(var i = 0; i < arrayOfYears["FourDigitsYear"].length; i++) {
        heYear = arrayOfYears["FourDigitsYear"][i] + 10000;
        //console.log(heYear);
        var regexString = '((?!([–])).|^)\\b(' + arrayOfYears["FourDigitsYear"][i] + ')\\b(?!–)(?!s)(?!\\sAD)(?!\\sBC)'; // combination of lookahead for en-dash, minus, BC, AD, and lookahead for s. ((?!([–])).|^)    ((?!([–|BC\\s|BCE\\s|AD\\s])).|^)- lookbehind for en-dash, not really working
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

if (typeof arrayOfYears["FourDigitsDashFourDigits"] != 'undefined') {
    for(var i = 0; i < arrayOfYears["FourDigitsDashFourDigits"].length; i++) {
        heYearOne = arrayOfYears["FourDigitsDashFourDigits"][i][0] + 10000;
        heYearTwo = arrayOfYears["FourDigitsDashFourDigits"][i][1] + 10000;
        //console.log(heYearOne, heYearTwo);
        var regexString = '\\b(' + arrayOfYears["FourDigitsDashFourDigits"][i][0] + '(–|-)' + arrayOfYears["FourDigitsDashFourDigits"][i][1] + ')\\b';
        //console.log(regexString);
        var regex = new RegExp(regexString, "");
        var replaceString = '$1' + ' [' + heYearOne + '–' + heYearTwo + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
        //var replaceString = heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>';
        //var replaceString = heYear;
        //console.log(replaceString);
        $("*").replaceText(regex, replaceString);
    }
}

if (typeof arrayOfYears["FourDigitsDashTwoDigits"] != 'undefined') {
    for(var i = 0; i < arrayOfYears["FourDigitsDashTwoDigits"].length; i++) {
        heYearOne = arrayOfYears["FourDigitsDashTwoDigits"][i][0] + 10000;
        heYearTwo = arrayOfYears["FourDigitsDashTwoDigits"][i][1];
        //console.log(heYearOne, heYearTwo);
        var regexString = '\\b(' + arrayOfYears["FourDigitsDashTwoDigits"][i][0] + '(–|-)' + arrayOfYears["FourDigitsDashTwoDigits"][i][1] + ')\\b';
        //console.log(regexString);
        var regex = new RegExp(regexString, "");
        var replaceString = '$1' + ' [' + heYearOne + '–' + heYearTwo + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
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

if (typeof arrayOfYears["ThreeDigitsYear"] != 'undefined') {
    for(var i = 0; i < arrayOfYears["ThreeDigitsYear"].length; i++) {
        heYear = arrayOfYears["ThreeDigitsYear"][i] + 10000;
        // console.log(heYear);
        var regexString = '((?!([–])).|^)\\b(' + arrayOfYears["ThreeDigitsYear"][i] + ')\\b(?!–)(?!s)(?!\\sBC)(?!\\sAD)'; // combination of lookbehind and lookahead for en-dash, and lookahead for s
        //console.log(regexString);
        var regex = new RegExp(regexString, "i");
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
        var regexString = '((?!([–])).|^)\\b(' + arrayOfYears["OneDigitYearCE"][i] + '\\sCE)\\b(?!–)(?!s)(?!\\sBC)'; // combination of lookbehind and lookahead for en-dash, and lookahead for s
        //console.log(regexString);
        var regex = new RegExp(regexString, "i");
        var replaceString = ' $3' + ' [' + heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
        //var replaceString = heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>';
        //var replaceString = heYear;
        //console.log(replaceString);
        $("*").replaceText(regex, replaceString);
    }
}

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

//$("*").replaceText(/\b(1783–1816)\b/gi, "$1 [11783–11816 <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>] ");
//$("*").replaceText(/\b(1790–1801)\b/gi, "$1 [11790–11801 <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>] ");
//$("*").replaceText(/([^–]|\b)(1755)([^–]|\b)/gi, "$2 [11755 <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>] ");


// #### Century replacement rules
for(var i = 1; i < 22; i++) {
    if (i < 10) {
        if (i == 1) {
            regexString = '\\b' + i + 'st century' + '\\b';
            //console.log(regexString);
            regex = new RegExp (regexString, "");
            replaceString = i + 'st century ' + ' [10' + i + 'st century <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
            $("*").replaceText(regex, replaceString);
        } else if (i == 2) {
            regexString = '\\b' + i + 'nd century' + '\\b';
            regex = new RegExp (regexString, "");
            replaceString = i + 'nd century ' + ' [10' + i + 'nd century <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
            $("*").replaceText(regex, replaceString);
        } else if (i == 3) {
            regexString = '\\b' + i + 'rd century' + '\\b';
            regex = new RegExp (regexString, "");
            replaceString = i + 'rd century ' + ' [10' + i + 'rd century <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
            $("*").replaceText(regex, replaceString);
        } else {
            regexString = '\\b' + i + 'th century' + '\\b';
            regex = new RegExp (regexString, "");
            replaceString = i + 'th century ' + ' [10' + i + 'th century <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
            $("*").replaceText(regex, replaceString);
        }
    } else {
        if (i == 21) {
            regexString = '\\b' + i + 'st century' + '\\b';
            regex = new RegExp (regexString, "");
            replaceString = i + 'st century ' + ' [1' + i + 'st century <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
            $("*").replaceText(regex, replaceString);
        } else if (i == 22) {
            regexString = '\\b' + i + 'nd century' + '\\b';
            regex = new RegExp (regexString, "");
            replaceString = i + 'nd century ' + ' [1' + i + 'nd century <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
            $("*").replaceText(regex, replaceString);
        } else if (i == 23) {
            regexString = '\\b' + i + 'rd century' + '\\b';
            regex = new RegExp (regexString, "");
            replaceString = i + 'rd century ' + ' [1' + i + 'rd century <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
            $("*").replaceText(regex, replaceString);
        } else {
            regexString = '\\b' + i + 'th century' + '\\b';
            regex = new RegExp (regexString, "");
            replaceString = i + 'th century ' + ' [1' + i + 'th century <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
            $("*").replaceText(regex, replaceString);
        }
    }
}




//  How the years beteen 1000-2017 might appear on wikipedia
//  4 digits between spaces     - e.g. 1755
//  4 digits with a sign after  - e.g. 1819)  or  1783.  or  1783[
//  4 digit with a sign before  - e.g. (1755
//  4 digits dash 4 digits      - e.g. 1790-1801
//  4 digits dash 2 digits      - e.g. 1783-90

//  to solve the 1790s 1930s problem
