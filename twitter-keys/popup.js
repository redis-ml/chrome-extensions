function renderPage(items) {
    var ul = $('<ul/>');
    for (var key in items) {
        if (!isUserPasswdStorageKey(key)) {
            continue;
        }
        var context = items[key];
        console.log("adding element: " +context.username);
        var a = $('<a/>', {
            text: 'Login:' + context.username,
            'data-username': context.username,
            href: '#'
        }).click(loginUser);
        var li = $('<li/>');
        li.append(a);
        ul.append(li);
        console.log("added element: " +context.username);
        console.log(ul);
    }
    $('#content')
        .append($('<a/>', {
                text: 'Default Task for page',
                href: '#'
            }).click(defaultTask))
        .append($('<hr/>'))
        .append($('<a/>', {
                text: 'View Data',
                href: chrome.extension.getURL("view_keys.html")
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
