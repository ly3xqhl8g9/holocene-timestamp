chrome.storage.sync.get(['activeOptions', 'insertBefore', 'insertBetween', 'holoceneStyle', 'holoceneAnchor', 'holoceneHeRemove','holoceneReplace'], function(element) {
    if(
        element['activeOptions'] == null
        || element['insertBefore'] == null
        || element['insertBetween'] == null
        || element['holoceneStyle'] == null
        || element['holoceneAnchor'] == null
        || element['holoceneHeRemove'] == null
        || element['holoceneReplace'] == null
    ) {
        // set defatuls
        chrome.storage.sync.set({
            activeOptions: 'onWiki',
            insertBefore: 'after',
            insertBetween: 'brackets',
            holoceneStyle: 'regular',
            holoceneAnchor: 'yesAnchor',
            holoceneHeRemove: 'noRemove',
            holoceneReplace: 'noReplace'
        }, function() {});
    }

    if (element['activeOptions'] == 'off' || element['activeOptions'] == undefined) {
        document.getElementById('extensionOff').setAttribute("checked", "checked");
        document.getElementById('popupTitle').textContent = "The Holocene Epoch Timestamp is";
        document.getElementById('radioButtonOff').style.background = "rgb(12, 57, 87)";
        document.getElementById('radioButtonOnWiki').style.background = "linear-gradient(to right, rgb(29, 78, 144) 50%, rgb(12, 57, 87) 50%)";
        document.getElementById('radioButtonOnSite').style.background = "linear-gradient(to right, rgb(29, 78, 144) 50%, rgb(12, 57, 87) 50%)";
        document.getElementById('underForm').style.display = 'none';
    } else {
        if (element['activeOptions'] == 'onWiki') {
            document.getElementById('extensionOnWiki').setAttribute("checked", "checked");
            document.getElementById('popupTitle').textContent = "The Holocene Epoch Timestamp is active";
            document.getElementById('radioButtonOnWiki').style.background = "rgb(12, 57, 87)";
            document.getElementById('radioButtonOnSite').style.background = "linear-gradient(to right, rgb(29, 78, 144) 50%, rgb(12, 57, 87) 50%)";
            document.getElementById('radioButtonOff').style.background = "linear-gradient(to right, rgb(29, 78, 144) 50%, rgb(12, 57, 87) 50%)";
        } else if (element['activeOptions'] == 'onSite') {
            document.getElementById('extensionOnSite').setAttribute("checked", "checked");
            document.getElementById('popupTitle').textContent = "The Holocene Epoch Timestamp is active";
            document.getElementById('radioButtonOnSite').style.background = "rgb(12, 57, 87)";
            document.getElementById('radioButtonOnWiki').style.background = "linear-gradient(to right, rgb(29, 78, 144) 50%, rgb(12, 57, 87) 50%)";
            document.getElementById('radioButtonOff').style.background = "linear-gradient(to right, rgb(29, 78, 144) 50%, rgb(12, 57, 87) 50%)";
        }

        addHeText(element['insertBefore'],
                  element['insertBetween'],
                  element['holoceneStyle'],
                  element['holoceneAnchor'],
                  element['holoceneHeRemove'],
                  element['holoceneReplace']);
    }
});


function extensionIsOnWiki () {
    chrome.storage.sync.set({activeOptions: 'onWiki'});
    document.getElementById('extensionOnWiki').setAttribute("checked", "checked");
    document.getElementById('popupTitle').textContent = "The Holocene Epoch Timestamp is active";
    document.getElementById('radioButtonOnWiki').style.background = "rgb(12, 57, 87)";
    document.getElementById('radioButtonOnSite').style.background = "linear-gradient(to right, rgb(29, 78, 144) 50%, rgb(12, 57, 87) 50%)";
    document.getElementById('radioButtonOff').style.background = "linear-gradient(to right, rgb(29, 78, 144) 50%, rgb(12, 57, 87) 50%)";

    chrome.storage.sync.get(['activeOptions', 'insertBefore', 'insertBetween', 'holoceneStyle', 'holoceneAnchor', 'holoceneHeRemove','holoceneReplace'], function(element) {
        addHeText(element['insertBefore'],
                  element['insertBetween'],
                  element['holoceneStyle'],
                  element['holoceneAnchor'],
                  element['holoceneHeRemove'],
                  element['holoceneReplace']);
    });
}
document.getElementById('extensionOnWiki').addEventListener('click', function(ev) {
    extensionIsOnWiki();
});
document.getElementById('radioButtonOnWiki').addEventListener('click', function(ev) {
    extensionIsOnWiki();
});


function extensionIsOnSite () {
    chrome.storage.sync.set({activeOptions: 'onSite'});
    document.getElementById('extensionOnWiki').setAttribute("checked", "checked");
    document.getElementById('popupTitle').textContent = "The Holocene Epoch Timestamp is active";
    document.getElementById('radioButtonOnSite').style.background = "rgb(12, 57, 87)";
    document.getElementById('radioButtonOnWiki').style.background = "linear-gradient(to right, rgb(29, 78, 144) 50%, rgb(12, 57, 87) 50%)";
    document.getElementById('radioButtonOff').style.background = "linear-gradient(to right, rgb(29, 78, 144) 50%, rgb(12, 57, 87) 50%)";

    chrome.storage.sync.get(['activeOptions', 'insertBefore', 'insertBetween', 'holoceneStyle', 'holoceneAnchor', 'holoceneHeRemove','holoceneReplace'], function(element) {
        addHeText(element['insertBefore'],
                  element['insertBetween'],
                  element['holoceneStyle'],
                  element['holoceneAnchor'],
                  element['holoceneHeRemove'],
                  element['holoceneReplace']);
    });
}
document.getElementById('extensionOnSite').addEventListener('click', function(ev) {
    extensionIsOnSite();
});
document.getElementById('radioButtonOnSite').addEventListener('click', function(ev) {
    extensionIsOnSite();
});


function extensionIsOff () {
    chrome.storage.sync.set({activeOptions: 'off'});
    document.getElementById('extensionOff').setAttribute("checked", "checked");
    document.getElementById('popupTitle').textContent = "The Holocene Epoch Timestamp is";
    document.getElementById('radioButtonOff').style.background = "rgb(12, 57, 87)";
    document.getElementById('radioButtonOnWiki').style.background = "linear-gradient(to right, rgb(29, 78, 144) 50%, rgb(12, 57, 87) 50%)";
    document.getElementById('radioButtonOnSite').style.background = "linear-gradient(to right, rgb(29, 78, 144) 50%, rgb(12, 57, 87) 50%)";
    document.getElementById('underForm').style.display = 'none';
}
document.getElementById('extensionOff').addEventListener('click', function(ev) {
    extensionIsOff();
});
document.getElementById('radioButtonOff').addEventListener('click', function(ev) {
    extensionIsOff();
});


document.getElementById('adjustOptions').addEventListener('click', function(ev) {
    chrome.runtime.openOptionsPage();
})


function addHeText(insertBeforeParameter = 'after',
                   insertBetweenParameter = 'brackets',
                   holoceneStyleParameter = 'regular',
                   holoceneAnchorParameter = 'yesAnchor',
                   holoceneHeRemoveParameter = 'noRemove',
                   holoceneReplaceParameter = 'noReplace') {
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
        if(holoceneHeRemoveParameter == 'noRemove') {
            var startHoloceneAnchor = ' ';
            var endHoloceneAnchor = '';
        } else {
            var startHoloceneAnchor = '';
            var endHoloceneAnchor = '';
        }
    }

    if (holoceneAnchorParameter == 'yesAnchor' && holoceneHeRemoveParameter == 'yesRemove') {
        var startHoloceneAnchor = '';
        var endHoloceneAnchor = '';
    }

    if (holoceneHeRemoveParameter == 'yesRemove') {
        var holoceneHeMark = '';
    } else if (holoceneHeRemoveParameter == 'noRemove') {
        var holoceneHeMark = 'HE';
    }

    if (holoceneReplaceParameter == 'yesReplace') {
        var holoceneReplace = true;
    } else if (holoceneReplaceParameter == 'noReplace') {
        var holoceneReplace = false;
    }


    var firstHeYear = '12023';
    var secondHeYear = '9602'

    var replaceStringFirstPageStamp = '2023';
    var replaceStringSecondPageStamp = '399 BC';
    var replaceStringFirstHE = startHoloceneStyle + startInsertBetween + firstHeYear + startHoloceneAnchor + holoceneHeMark + endHoloceneAnchor + endInsertBetween + endHoloceneStyle;
    // console.log(replaceStringFirstHE);
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
