// chrome.storage.sync.get(null, function(element) {
//     console.log(element);
// });
//
// chrome.storage.sync.clear();


// set default options at the start
chrome.storage.sync.get(['activeOptions', 'insertBefore', 'insertBetween', 'holoceneStyle', 'holoceneAnchor', 'holoceneReplace'], function(element) {
    if(element['activeOptions'] == null
        || element['insertBefore'] == null
        || element['insertBetween'] == null
        || element['holoceneStyle'] == null
        || element['holoceneAnchor'] == null
        || element['holoceneReplace'] == null) {
        default_options();
    }
    console.log(element)
});

// set checked item while window opened
chrome.storage.sync.get(['activeOptions', 'insertBefore', 'insertBetween', 'holoceneStyle', 'holoceneAnchor', 'holoceneReplace'], function(element) {
    var activeOptions = element['activeOptions'];
    var insertBefore = element['insertBefore'];
    var insertBetween = element['insertBetween'];
    var holoceneStyle = element['holoceneStyle'];
    var holoceneAnchor = element['holoceneAnchor'];
    var holoceneReplace = element['holoceneReplace'];

    document.getElementById(activeOptions).setAttribute("checked", "checked");
    document.getElementById(insertBefore).setAttribute("checked", "checked");
    document.getElementById(insertBetween).setAttribute("checked", "checked");
    document.getElementById(holoceneStyle).setAttribute("checked", "checked");
    document.getElementById(holoceneAnchor).setAttribute("checked", "checked");
    document.getElementById(holoceneReplace).setAttribute("checked", "checked");
});



function save_options () {
    var activeOptionsForm = document.querySelector('input[name="activeOptionsForm"]:checked').value;
    var insertBeforeAfterForm = document.querySelector('input[name="insertBeforeAfterForm"]:checked').value;
    var insertBetweenForm = document.querySelector('input[name="insertBetweenForm"]:checked').value;
    var holoceneStyleForm = document.querySelector('input[name="holoceneStyleForm"]:checked').value;
    var holoceneAnchorTag = document.querySelector('input[name="holoceneAnchorTag"]:checked').value;
    var holoceneReplaceForm = document.querySelector('input[name="holoceneReplaceForm"]:checked').value;

    chrome.storage.sync.set({
        activeOptions: activeOptionsForm,
        insertBefore: insertBeforeAfterForm,
        insertBetween: insertBetweenForm,
        holoceneStyle: holoceneStyleForm,
        holoceneAnchor: holoceneAnchorTag,
        holoceneReplace: holoceneReplaceForm
    }, function() {
        var status = document.getElementById('status-save');
        status.textContent = 'Options are saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });

    chrome.storage.sync.get(['activeOptions', 'insertBefore', 'insertBetween', 'holoceneStyle', 'holoceneAnchor', 'holoceneReplace'], function(element) {
        var activeOptions = element['activeOptions'];
        var insertBefore = element['insertBefore'];
        var insertBetween = element['insertBetween'];
        var holoceneStyle = element['holoceneStyle'];
        var holoceneAnchor = element['holoceneAnchor'];
        var holoceneReplace = element['holoceneReplace'];

        document.getElementById(activeOptions).setAttribute("checked", "checked");
        document.getElementById(insertBefore).setAttribute("checked", "checked");
        document.getElementById(insertBetween).setAttribute("checked", "checked");
        document.getElementById(holoceneStyle).setAttribute("checked", "checked");
        document.getElementById(holoceneAnchor).setAttribute("checked", "checked");
        document.getElementById(holoceneReplace).setAttribute("checked", "checked");
    });

}
document.getElementById('btn-save').addEventListener('click', save_options);


function default_options () {
    chrome.storage.sync.set({
        activeOptions: 'onWiki',
        insertBefore: 'after',
        insertBetween: 'brackets',
        holoceneStyle: 'regular',
        holoceneAnchor: 'yesAnchor',
        holoceneReplace: 'noReplace'
    }, function() {
        var status = document.getElementById('status-default');
        status.textContent = 'Options are default.';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });

    chrome.storage.sync.get(['activeOptions', 'insertBefore', 'insertBetween', 'holoceneStyle', 'holoceneAnchor', 'holoceneReplace'], function(element) {
        var activeOptions = element['activeOptions'];
        var insertBefore = element['insertBefore'];
        var insertBetween = element['insertBetween'];
        var holoceneStyle = element['holoceneStyle'];
        var holoceneAnchor = element['holoceneAnchor'];
        var holoceneReplace = element['holoceneReplace'];

        document.getElementById(activeOptions).setAttribute("checked", "checked");
        document.getElementById(insertBefore).setAttribute("checked", "checked");
        document.getElementById(insertBetween).setAttribute("checked", "checked");
        document.getElementById(holoceneStyle).setAttribute("checked", "checked");
        document.getElementById(holoceneAnchor).setAttribute("checked", "checked");
        document.getElementById(holoceneReplace).setAttribute("checked", "checked");
    });
}
document.getElementById('btn-reset').addEventListener('click', default_options);
