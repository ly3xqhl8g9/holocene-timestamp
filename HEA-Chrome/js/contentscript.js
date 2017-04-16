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
console.log(arrayHasNumbers);


// var cleanArray = [];
//
// for (var i = 0; i< bodyTextArray.Length; i++) {
//     var regex = new RegExp(/ \d{4} /, 'g');
//     if(regex.test(bodyTextArray[i])) {
//         cleanArray += bodyTextArray[i];
//         console.log(bodyTextArray[i]);
//     }
// }


// for (var i = 0; i < bodyTextArray.length; i++) {
//     var regex = new RegExp(/\d{4}+/, "g");
//     if(bodyTextArray[i].indexOf(regex) != -1) {
//         console.log(bodyTextArray[i]);
//     }
// }



// function replace() {
    // Replace logic
    // for (var i = 0; i < textArray.length; i++) {
    //
    //     // console.log(textArray[i]);
    //     var regex = new RegExp(/Oliver/, "g");
    //     if(textArray[i].indexOf(regex) != -1) {
    //         console.log(textArray[i]);
    //     }


        // Define regex for if validation test

    	// if (textArray[i] === "1755") {

            // Test to determine how to add, substract the HE 10,000 years

            // Conversion of textArray[i] to number and operation


    		// var regex = new RegExp (" " + textArray[i] + " ");
    		// $("*").replaceText(regex, " [11755 <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">HE</a>] ");
    		// console.log(i);
    	// }
//     }
// }
//
// replace();








//  How the years beteen 1000-2017 might appear on wikipedia
//  4 digits between spaces     - e.g. 1755
//  4 digits with a sign after  - e.g. 1819)  or  1783.  or  1783[
//  4 digit with a sign before  - e.g. (1755
//  4 digits dash 4 digits      - e.g. 1790-1801
//  4 digits dash 2 digits      - e.g. 1783-90
