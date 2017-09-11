// set default options at the start
chrome.storage.sync.get(['activeOptions', 'insertBefore', 'insertBetween', 'holoceneStyle', 'holoceneAnchor', 'holoceneHeRemove', 'holoceneReplace'], function(element) {
    if(element['activeOptions'] == null
        || element['insertBefore'] == null
        || element['insertBetween'] == null
        || element['holoceneStyle'] == null
        || element['holoceneAnchor'] == null
        || element['holoceneHeRemove'] == null
        || element['holoceneReplace'] == null) {
        default_options();
    }
    //console.log(element)
});

// set checked item while window opened
chrome.storage.sync.get(['activeOptions', 'insertBefore', 'insertBetween', 'holoceneStyle', 'holoceneAnchor', 'holoceneHeRemove', 'holoceneReplace'], function(element) {
    var activeOptions = element['activeOptions'];
    var insertBefore = element['insertBefore'];
    var insertBetween = element['insertBetween'];
    var holoceneStyle = element['holoceneStyle'];
    var holoceneAnchor = element['holoceneAnchor'];
    var holoceneHeRemove = element['holoceneHeRemove'];
    var holoceneReplace = element['holoceneReplace'];

    document.getElementById(activeOptions).setAttribute("checked", "checked");
    document.getElementById(insertBefore).setAttribute("checked", "checked");
    document.getElementById(insertBetween).setAttribute("checked", "checked");
    document.getElementById(holoceneStyle).setAttribute("checked", "checked");
    document.getElementById(holoceneAnchor).setAttribute("checked", "checked");
    document.getElementById(holoceneHeRemove).setAttribute("checked", "checked");
    document.getElementById(holoceneReplace).setAttribute("checked", "checked");

    if (document.getElementById('yesReplace').hasAttribute("checked")) {
        document.getElementById('after').setAttribute("disabled", "disabled");
        document.getElementById('before').setAttribute("disabled", "disabled");
    }

    if (document.getElementById('yesRemove').hasAttribute("checked")) {
        document.getElementById('yesAnchor').setAttribute("disabled", "disabled");
        document.getElementById('noAnchor').setAttribute("disabled", "disabled");
    }

    if(document.getElementById('off').hasAttribute("checked")) {
        document.getElementById('after').setAttribute("disabled", "disabled");
        document.getElementById('before').setAttribute("disabled", "disabled");
        document.getElementById('brackets').setAttribute("disabled", "disabled");
        document.getElementById('accolades').setAttribute("disabled", "disabled");
        document.getElementById('slashes').setAttribute("disabled", "disabled");
        document.getElementById('nothing').setAttribute("disabled", "disabled");
        document.getElementById('regular').setAttribute("disabled", "disabled");
        document.getElementById('italic').setAttribute("disabled", "disabled");
        document.getElementById('yesAnchor').setAttribute("disabled", "disabled");
        document.getElementById('noAnchor').setAttribute("disabled", "disabled");
        document.getElementById('noRemove').setAttribute("disabled", "disabled");
        document.getElementById('yesRemove').setAttribute("disabled", "disabled");
        document.getElementById('noReplace').setAttribute("disabled", "disabled");
        document.getElementById('yesReplace').setAttribute("disabled", "disabled");
    }
});


function save_options () {
    var activeOptionsForm = document.querySelector('input[name="activeOptionsForm"]:checked').value;
    var insertBeforeAfterForm = document.querySelector('input[name="insertBeforeAfterForm"]:checked').value;
    var insertBetweenForm = document.querySelector('input[name="insertBetweenForm"]:checked').value;
    var holoceneStyleForm = document.querySelector('input[name="holoceneStyleForm"]:checked').value;
    var holoceneAnchorTag = document.querySelector('input[name="holoceneAnchorTag"]:checked').value;
    var holoceneHeRemove = document.querySelector('input[name="holoceneHeRemove"]:checked').value;
    var holoceneReplaceForm = document.querySelector('input[name="holoceneReplaceForm"]:checked').value;

    chrome.storage.sync.set({
        activeOptions: activeOptionsForm,
        insertBefore: insertBeforeAfterForm,
        insertBetween: insertBetweenForm,
        holoceneStyle: holoceneStyleForm,
        holoceneAnchor: holoceneAnchorTag,
        holoceneHeRemove: holoceneHeRemove,
        holoceneReplace: holoceneReplaceForm
    }, function() {
        var status = document.getElementById('status-save');
        status.textContent = 'Options are saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });

    chrome.storage.sync.get(['activeOptions', 'insertBefore', 'insertBetween', 'holoceneStyle', 'holoceneAnchor', 'holoceneHeRemove','holoceneReplace'], function(element) {
        var activeOptions = element['activeOptions'];
        var insertBefore = element['insertBefore'];
        var insertBetween = element['insertBetween'];
        var holoceneStyle = element['holoceneStyle'];
        var holoceneAnchor = element['holoceneAnchor'];
        var holoceneHeRemove = element['holoceneHeRemove'];
        var holoceneReplace = element['holoceneReplace'];

        document.getElementById(activeOptions).setAttribute("checked", "checked");
        document.getElementById(insertBefore).setAttribute("checked", "checked");
        document.getElementById(insertBetween).setAttribute("checked", "checked");
        document.getElementById(holoceneStyle).setAttribute("checked", "checked");
        document.getElementById(holoceneAnchor).setAttribute("checked", "checked");
        document.getElementById(holoceneHeRemove).setAttribute("checked", "checked");
        document.getElementById(holoceneReplace).setAttribute("checked", "checked");
    });

}
document.getElementById('btn-save').addEventListener('click', function(ev) {
    save_options();
    setTimeout(function() {
        location.reload();
    }, 750);
});



function default_options () {
    chrome.storage.sync.set({
        activeOptions: 'onWiki',
        insertBefore: 'after',
        insertBetween: 'brackets',
        holoceneStyle: 'regular',
        holoceneAnchor: 'yesAnchor',
        holoceneHeRemove: 'noRemove',
        holoceneReplace: 'noReplace'
    }, function() {
        var status = document.getElementById('status-default');
        status.textContent = 'Options are default.';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });

    chrome.storage.sync.get(['activeOptions', 'insertBefore', 'insertBetween', 'holoceneStyle', 'holoceneAnchor', 'holoceneHeRemove', 'holoceneReplace'], function(element) {
        var activeOptions = element['activeOptions'];
        var insertBefore = element['insertBefore'];
        var insertBetween = element['insertBetween'];
        var holoceneStyle = element['holoceneStyle'];
        var holoceneAnchor = element['holoceneAnchor'];
        var holoceneHeRemove = element['holoceneHeRemove'];
        var holoceneReplace = element['holoceneReplace'];

        document.getElementById(activeOptions).setAttribute("checked", "checked");
        document.getElementById(insertBefore).setAttribute("checked", "checked");
        document.getElementById(insertBetween).setAttribute("checked", "checked");
        document.getElementById(holoceneStyle).setAttribute("checked", "checked");
        document.getElementById(holoceneAnchor).setAttribute("checked", "checked");
        document.getElementById(holoceneHeRemove).setAttribute("checked", "checked");
        document.getElementById(holoceneReplace).setAttribute("checked", "checked");
    });
}
document.getElementById('btn-reset').addEventListener('click', function(ev) {
    default_options();
    setTimeout(function() {
        location.reload();
    }, 750);
});



function enableDisableOptions () {
    // disable insertBeforeAfterForm when click yesReplace
    document.getElementById('yesReplace').addEventListener('click', function () {
        document.getElementById('after').setAttribute("disabled", "disabled");
        document.getElementById('before').setAttribute("disabled", "disabled");
    });
    // enable insertBeforeAfterForm when click noReplace
    document.getElementById('noReplace').addEventListener('click', function () {
        document.getElementById('after').removeAttribute("disabled", "disabled");
        document.getElementById('before').removeAttribute("disabled", "disabled");
    });


    // disable holoceneAnchorTag when click yesRemove
    document.getElementById('yesRemove').addEventListener('click', function () {
        document.getElementById('yesAnchor').setAttribute("disabled", "disabled");
        document.getElementById('noAnchor').setAttribute("disabled", "disabled");
    });
    // enable holoceneAnchorTag when click noRemove
    document.getElementById('noRemove').addEventListener('click', function () {
        document.getElementById('yesAnchor').removeAttribute("disabled", "disabled");
        document.getElementById('noAnchor').removeAttribute("disabled", "disabled");
    });


    // disable options when click off
    document.getElementById('off').addEventListener('click', function () {
        document.getElementById('after').setAttribute("disabled", "disabled");
        document.getElementById('before').setAttribute("disabled", "disabled");
        document.getElementById('brackets').setAttribute("disabled", "disabled");
        document.getElementById('accolades').setAttribute("disabled", "disabled");
        document.getElementById('slashes').setAttribute("disabled", "disabled");
        document.getElementById('nothing').setAttribute("disabled", "disabled");
        document.getElementById('regular').setAttribute("disabled", "disabled");
        document.getElementById('italic').setAttribute("disabled", "disabled");
        document.getElementById('yesAnchor').setAttribute("disabled", "disabled");
        document.getElementById('noAnchor').setAttribute("disabled", "disabled");
        document.getElementById('noRemove').setAttribute("disabled", "disabled");
        document.getElementById('yesRemove').setAttribute("disabled", "disabled");
        document.getElementById('noReplace').setAttribute("disabled", "disabled");
        document.getElementById('yesReplace').setAttribute("disabled", "disabled");
    });
    // enable options when click onWiki/onSite
    document.getElementById('onWiki').addEventListener('click', function () {
        document.getElementById('after').removeAttribute("disabled", "disabled");
        document.getElementById('before').removeAttribute("disabled", "disabled");
        document.getElementById('brackets').removeAttribute("disabled", "disabled");
        document.getElementById('accolades').removeAttribute("disabled", "disabled");
        document.getElementById('slashes').removeAttribute("disabled", "disabled");
        document.getElementById('nothing').removeAttribute("disabled", "disabled");
        document.getElementById('regular').removeAttribute("disabled", "disabled");
        document.getElementById('italic').removeAttribute("disabled", "disabled");
        document.getElementById('yesAnchor').removeAttribute("disabled", "disabled");
        document.getElementById('noAnchor').removeAttribute("disabled", "disabled");
        document.getElementById('noRemove').removeAttribute("disabled", "disabled");
        document.getElementById('yesRemove').removeAttribute("disabled", "disabled");
        document.getElementById('noReplace').removeAttribute("disabled", "disabled");
        document.getElementById('yesReplace').removeAttribute("disabled", "disabled");
    });
    document.getElementById('onSite').addEventListener('click', function () {
        document.getElementById('after').removeAttribute("disabled", "disabled");
        document.getElementById('before').removeAttribute("disabled", "disabled");
        document.getElementById('brackets').removeAttribute("disabled", "disabled");
        document.getElementById('accolades').removeAttribute("disabled", "disabled");
        document.getElementById('slashes').removeAttribute("disabled", "disabled");
        document.getElementById('nothing').removeAttribute("disabled", "disabled");
        document.getElementById('regular').removeAttribute("disabled", "disabled");
        document.getElementById('italic').removeAttribute("disabled", "disabled");
        document.getElementById('yesAnchor').removeAttribute("disabled", "disabled");
        document.getElementById('noAnchor').removeAttribute("disabled", "disabled");
        document.getElementById('noRemove').removeAttribute("disabled", "disabled");
        document.getElementById('yesRemove').removeAttribute("disabled", "disabled");
        document.getElementById('noReplace').removeAttribute("disabled", "disabled");
        document.getElementById('yesReplace').removeAttribute("disabled", "disabled");
    });
}
enableDisableOptions();

// chrome.storage.sync.get(null, function(element) {
//     console.log(element);
// });
//
// chrome.storage.sync.clear();
