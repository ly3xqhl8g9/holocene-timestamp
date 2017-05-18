chrome.storage.sync.get('activeOptions', function(element) {
    if (element['activeOptions'] == 'off') {
        document.getElementById('extensionOff').setAttribute("checked", "checked");
    } else {
        document.getElementById('extensionOn').setAttribute("checked", "checked");
    }
    // console.log(element['activeOptions']);
});

// document.getElementById('extensionOn').click(
//     chrome.storage.sync.set({activeOptions: 'onWiki'});
// );

// document.getElementById('extensionOff').click(
//
// );


// chrome.storage.sync.set({activeOptions: 'off'}, function(element) {
//         document.getElementById('extensionOff').click();
// });
//
// chrome.storage.sync.set({activeOptions: 'onWiki'}, function(element) {
//         document.getElementById('extensionOn').click();
// });
