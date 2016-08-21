function renderPage(items) {
    var ul = $('<ul/>');
    for (var key in items) {
        var context = items[key];
        console.log("adding element: " +context.username);
        var a = $('<a/>', {
            text: 'Login:' + context.username,
            'data-username': context.username,
            'data-passwd': context.passwd,
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
    chrome.storage.sync.get(STORAGE_KEY_FOR_SERVER_CONFIG, function(data) {
        console.log(data);
        var serverUrl = data[STORAGE_KEY_FOR_SERVER_CONFIG]['server-url'];
        var serverAuth = data[STORAGE_KEY_FOR_SERVER_CONFIG]['server-auth-key'];
        post_to_server(
            serverUrl,
            {
                "action": 'showTestingAccounts',
                "auth_key": serverAuth
            })
        .success(function(responseData, textStatus, jqXHR) {
            var r = JSON.parse(responseData);
            if (r['status'] === 'OK') {
                renderPage(r['data']);
            } else {
                $('#content').append(document.createTextNode('Server side failed to generate key data. Refresh page later.'))
            }
        }).error(function (responseData, textStatus, errorThrown) {
            $('#content').append(document.createTextNode('Failed to load data from Server side. Refresh page later.'))
            console.log(errorThrown);
            console.log(responseData);
            console.log('POST failed.');
        });
    });
});
