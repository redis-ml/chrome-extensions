function renderPage(items) {
    var ul = $('<ul/>');
    $('#content')
        .append($('<a/>', {
                text: 'Default Task for page',
                href: '#'
            }).click(function() {
                chrome.tabs.create({"url": HOMEPAGE});
            }))
        .append($('<hr/>'))
        .append($('<a/>', {
                text: 'View Data',
                href: '#'
            }).click(function(e) {
                var url = chrome.extension.getURL("view_keys.html");
                chrome.tabs.create({"url": url});
            }))
        .append($('<hr/>'))
        .append($('<a/>', {
                text: 'Manage passwords',
                href: '#'
            }).click(function(e) {
                var url = chrome.extension.getURL("manage_passwd.html");
                chrome.tabs.create({"url": url});
            }))
        .append($('<hr/>'))
        .append(ul);
}

document.addEventListener('DOMContentLoaded', function () {
    console.log("generating item");
    chrome.storage.sync.get(null, function(items) {
        renderPage(items);
    });
});
