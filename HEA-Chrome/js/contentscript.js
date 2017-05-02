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
//console.log(cleanedArray)


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
    arrayOfYears["FourDigitsYearBC"] = [];
    arrayOfYears["ThreeDigitsYearBC"] = [];
    arrayOfYears["TwoDigitsYearBC"] = [];
    arrayOfYears["OneDigitYearBC"] = [];
    arrayOfYears["OneDigitYearAD"] = [];
    arrayOfYears["TwoDigitsYearAD"] = [];
    arrayOfYears["ThreeDigitsYearAD"] = [];
    arrayOfYears["ThreeDigitsYear"] = [];
    arrayOfYears["FourDigitsYearAD"] = [];
    arrayOfYears["FourDigitsAndS"] = [];
    arrayOfYears["FourDigitsDashFourDigits"] = [];
    arrayOfYears["FourDigitsDashTwoDigits"] = [];
    arrayOfYears["FourDigitsYear"] = [];
    for (var i = 0; i < arrayToBeChecked.length; i++) {
        if (/\d{4} BC/.test(arrayToBeChecked[i]) && /BC/.test(arrayToBeChecked[i+1])) {
            arrayOfYears["FourDigitsYearBC"].push(arrayToBeChecked[i]);
        } else if (/\b\d{3}/.test(arrayToBeChecked[i]) && /BC/.test(arrayToBeChecked[i+1])) {
            arrayOfYears["ThreeDigitsYearBC"].push(arrayToBeChecked[i]);
        } else if (/\b\d{2}/.test(arrayToBeChecked[i]) && /BC/.test(arrayToBeChecked[i+1])) {
            arrayOfYears["TwoDigitsYearBC"].push(arrayToBeChecked[i]);
        } else if (/\b\d{1}/.test(arrayToBeChecked[i]) && /BC/.test(arrayToBeChecked[i+1])) {
            arrayOfYears["OneDigitYearBC"].push(arrayToBeChecked[i]);
        } else if (/\b\d{1}/.test(arrayToBeChecked[i]) && /AD/.test(arrayToBeChecked[i+1])) {
            arrayOfYears["OneDigitYearBC"].push(arrayToBeChecked[i]);
        } else if (/\b\d{2}/.test(arrayToBeChecked[i]) && /AD/.test(arrayToBeChecked[i+1])) {
            arrayOfYears["TwoDigitsYearAD"].push(arrayToBeChecked[i]);
        } else if (/\b\d{3}/.test(arrayToBeChecked[i]) && /AD/.test(arrayToBeChecked[i+1])) {
            arrayOfYears["ThreeDigitsYearAD"].push(arrayToBeChecked[i]);
        } else if (/[^\[\-\d]\d{3}[^\[\-\d]/.test(arrayToBeChecked[i]) && !/p+.\s\d{3}/.test(arrayToBeChecked[i])) {
            arrayOfYears["ThreeDigitsYear"].push(arrayToBeChecked[i]);
        } else if (/\d{4}/.test(arrayToBeChecked[i]) && /AD/.test(arrayToBeChecked[i+1])) {
            arrayOfYears["FourDigitsYearAD"].push(arrayToBeChecked[i]);
        } else if (/\b\d{4}s/.test(arrayToBeChecked[i])) {
            var fourDigitsAndSValue = /\b\d{4}s/.exec(arrayToBeChecked[i]);
            arrayOfYears["FourDigitsAndS"].push(parseInt(fourDigitsAndSValue[0].slice(0,4)));
        } else if (/\b\d{4}–\d{4}\b/.test(arrayToBeChecked[i])) {
            var dashFourDigitsArray = [];
            var matchDashFourDigits = /\b(\d{4})–(\d{4})\b/.exec(arrayToBeChecked[i]);
            dashFourDigitsArray[0] = parseInt(RegExp.$1);
            dashFourDigitsArray[1] = parseInt(RegExp.$2);
            arrayOfYears["FourDigitsDashFourDigits"].push(dashFourDigitsArray);
        } else if (/\b\d{4}–\d{1,2}\b/.test(arrayToBeChecked[i])) {
            var dashTwoDigitsArray = [];
            var matchDashTwoDigits = /\b(\d{4})–(\d{1,2})\b/.exec(arrayToBeChecked[i]);
            dashTwoDigitsArray[0] = parseInt(RegExp.$1);
            dashTwoDigitsArray[1] = parseInt(RegExp.$2);
            arrayOfYears["FourDigitsDashTwoDigits"].push(dashTwoDigitsArray);
        } else if (/\b\d{4}\b/.test(arrayToBeChecked[i]) && !/[a-zA-Z]/.test(arrayToBeChecked[i])) {
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
arrayOfYears["FourDigitsDashFourDigits"] = unique(arrayOfYears["FourDigitsDashFourDigits"]);
arrayOfYears["FourDigitsDashTwoDigits"] = unique(arrayOfYears["FourDigitsDashTwoDigits"]);
console.log(arrayOfYears);


for(var i = 0; i < arrayOfYears["FourDigitsYear"].length; i++) {
    heYear = arrayOfYears["FourDigitsYear"][i] + 10000;
    // console.log(heYear);
    var regexString = '\\b(' + arrayOfYears["FourDigitsYear"][i] + ')\\b';
    //console.log(regexstring);
    var regex = new RegExp(regexString, "");
    var replaceString = '$1' + ' [' + heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
    //var replaceString = heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>';
    //var replaceString = heYear;
    //console.log(replaceString);
    $("*").replaceText(regex, replaceString);
}


//$("*").replaceText(/\b(1755)\b/gi, "$1 [11755 <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>] ");


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
