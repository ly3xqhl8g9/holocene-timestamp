chrome.storage.sync.get(['activeOptions', 'insertBefore', 'insertBetween', 'holoceneStyle', 'holoceneAnchor', 'holoceneHeRemove','holoceneReplace'], function(element) {
    if (element['activeOptions'] == 'off') {
        document.getElementById('extensionOff').setAttribute("checked", "checked");
        document.getElementById('underForm').style.display = 'none';
    } else {
        document.getElementById('extensionOn').setAttribute("checked", "checked");
        addHeText(element['insertBefore'],
                  element['insertBetween'],
                  element['holoceneStyle'],
                  element['holoceneAnchor'],
                  element['holoceneHeRemove'],
                  element['holoceneReplace']);
    }
});


function extensionIsOn (userActive) {
    chrome.storage.sync.set({activeOptions: 'onWiki'});

    document.getElementById('extensionOn').setAttribute("checked", "checked");

    chrome.storage.sync.get(['activeOptions', 'insertBefore', 'insertBetween', 'holoceneStyle', 'holoceneAnchor', 'holoceneHeRemove','holoceneReplace'], function(element) {

        addHeText(element['insertBefore'],
                  element['insertBetween'],
                  element['holoceneStyle'],
                  element['holoceneAnchor'],
                  element['holoceneHeRemove'],
                  element['holoceneReplace']);
    });
}

document.getElementById('extensionOn').addEventListener('click', function(ev) {
    extensionIsOn();
});


function extensionIsOff () {
    chrome.storage.sync.set({activeOptions: 'off'});

    document.getElementById('extensionOff').setAttribute("checked", "checked");

    document.getElementById('underForm').style.display = 'none';
}

document.getElementById('extensionOff').addEventListener('click', function(ev) {
    extensionIsOff();
});



document.getElementById('adjustOptions').addEventListener('click', function(ev) {
    chrome.runtime.openOptionsPage();
})


function addHeText(insertBeforeParameter,
                   insertBetweenParameter,
                   holoceneStyleParameter,
                   holoceneAnchorParameter,
                   holoceneHeRemoveParamter,
                   holoceneReplaceParameter) {
    if (insertBeforeParameter == 'before') {
        var insertBefore = true;
    } else if (insertBeforeParameter == 'after') {
        var insertBefore = false;
    }

    if (insertBetweenParameter == 'brackets') {
        var startInsertBetween = '[';
        var endInsertBetween = ']';
    } else if (insertBetweenParameter == 'accolades') {
        var startInsertBetween = '{';
        var endInsertBetween = '}';
    } else if (insertBetweenParameter == 'slashes') {
        var startInsertBetween = '/';
        var endInsertBetween = '/';
    } else if (insertBetweenParameter == 'nothing') {
        var startInsertBetween = '';
        var endInsertBetween = '';
    }

    if (holoceneStyleParameter == 'regular') {
        var startHoloceneStyle = '';
        var endHoloceneStyle = '';
    } else if (holoceneStyleParameter == 'italic') {
        var startHoloceneStyle = '<i>';
        var endHoloceneStyle = '</i>';
    }

     if (holoceneAnchorParameter == 'yesAnchor') {
        var startHoloceneAnchor = ' <a href=\"https://en.wikipedia.org/wiki/Holocene_calendar\">';
        var endHoloceneAnchor = '</a>';
    } else if (holoceneAnchorParameter == 'noAnchor') {
        if(holoceneHeRemoveParamter == 'noRemove') {
            var startHoloceneAnchor = ' ';
            var endHoloceneAnchor = '';
        } else {
            var startHoloceneAnchor = '';
            var endHoloceneAnchor = '';
        }
    }

    if (holoceneHeRemoveParamter == 'yesRemove') {
        var holoceneHeMark = '';
    } else if (holoceneHeRemoveParamter == 'noRemove') {
        var holoceneHeMark = 'HE';
    }

    if (holoceneReplaceParameter == 'yesReplace') {
        var holoceneReplace = true;
    } else if (holoceneReplaceParameter == 'noReplace') {
        var holoceneReplace = false;
    }


    var firstHeYear = '12017';
    var secondHeYear = '9602'

    var replaceStringFirstPageStamp = '2017';
    var replaceStringSecondPageStamp = '399 BC';
    var replaceStringFirstHE = startHoloceneStyle + startInsertBetween + firstHeYear + startHoloceneAnchor + holoceneHeMark + endHoloceneAnchor + endInsertBetween + endHoloceneStyle;
    var replaceStringSecondHE = startHoloceneStyle + startInsertBetween + secondHeYear + startHoloceneAnchor + holoceneHeMark + endHoloceneAnchor + endInsertBetween + endHoloceneStyle;

    if (!holoceneReplace) {
        if (!insertBefore) {
            var replaceStringFirst = replaceStringFirstPageStamp + ' ' + replaceStringFirstHE;
            var replaceStringSecond = replaceStringSecondPageStamp + ' ' + replaceStringSecondHE;
        } else {
            var replaceStringFirst = replaceStringFirstHE + ' ' + replaceStringFirstPageStamp;
            var replaceStringSecond = replaceStringSecondHE + ' ' + replaceStringSecondPageStamp;
        }
    } else {
        var replaceStringFirst = replaceStringFirstHE;
        var replaceStringSecond = replaceStringSecondHE;
    }


    document.getElementById('underForm').style.display = 'block';

    var firstHE = document.getElementById('firstHE');
    var secondHE = document.getElementById('secondHE');
    firstHE.innerHTML = replaceStringFirst;
    secondHE.innerHTML = replaceStringSecond;
}
