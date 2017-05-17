function save_options () {
    var activeOptionsForm = document.querySelector('input[name="activeOptionsForm"]:checked').value;

    chrome.storage.sync.set({
        active: activeOptionsForm
    }, function() {
        var status = document.getElementById('status-save');
        status.textContent = 'Options saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });

    chrome.storage.sync.get('active', function(element) {
        var el = element['active'];
        document.getElementById(el).setAttribute("checked", "checked");
    });

}
document.getElementById('btn-save').addEventListener('click', save_options);


function default_options () {
    chrome.storage.sync.set({
        active: 'onWiki'
    }, function() {
        var status = document.getElementById('status-default');
        status.textContent = 'Options reverted to default.';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });

    chrome.storage.sync.get('active', function(element) {
        var el = element['active'];
        document.getElementById(el).setAttribute("checked", "checked");
    });
}
document.getElementById('btn-reset').addEventListener('click', default_options);


chrome.storage.sync.get('active', function(element) {
    var el = element['active'];
    document.getElementById(el).setAttribute("checked", "checked");
});
