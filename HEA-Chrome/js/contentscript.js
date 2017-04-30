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

function hasNumbers(arrayToBeChecked) {
    // the function checks if array element has numbers
    var arrayHasNumbers = new Array();
    for (var i = 0; i < arrayToBeChecked.length; i++) {
        if (/\d/.test(arrayToBeChecked[i])) {
            arrayHasNumbers.push(arrayToBeChecked[i]);
        }
    }
    return arrayHasNumbers;
}

arrayHasNumbers = hasNumbers(cleanedArray);
//console.log(arrayHasNumbers);


function withFourNumbers(arrayToBeChecked) {
    // the function checks if array element has 4 and only 4 numbers
    var arrayWithFourNumbers = new Array();
    for (var i = 0; i < arrayToBeChecked.length; i++) {
        if (/\b(\d{4})\b/.test(arrayToBeChecked[i])) {
            arrayWithFourNumbers.push(RegExp.$1);
        }
        if (/\d{4}s/.test(arrayToBeChecked[i])) {
            arrayWithFourNumbers.push(RegExp.$1.slice(0,3));
        }
    }
    return arrayWithFourNumbers;
}

arrayWithFourNumbers = withFourNumbers(arrayHasNumbers);
console.log(arrayWithFourNumbers);

for(var i = 0; i < arrayWithFourNumbers.length; i++) {
    if (arrayWithFourNumbers[i] > 1000 && arrayWithFourNumbers[i] < 2100) {
        heYear = parseInt(arrayWithFourNumbers[i]) + 10000;
        // console.log(heYear);
        var regexstring = '\\b(' + arrayWithFourNumbers[i] + ')\\b';
        //console.log(regexstring);
        var regex = new RegExp(regexstring, "");
        //var replaceString = '$1' + ' [' + heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>]';
        //var replaceString = heYear + ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>';
        var replaceString = heYear;
        //console.log(replaceString);
        $("*").replaceText(regex, replaceString);
    }
}


//$("*").replaceText(/\b(1755)\b/gi, "$1 [11755 <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>] ");





//  How the years beteen 1000-2017 might appear on wikipedia
//  4 digits between spaces     - e.g. 1755
//  4 digits with a sign after  - e.g. 1819)  or  1783.  or  1783[
//  4 digit with a sign before  - e.g. (1755
//  4 digits dash 4 digits      - e.g. 1790-1801
//  4 digits dash 2 digits      - e.g. 1783-90
