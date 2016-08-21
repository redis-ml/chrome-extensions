
chrome.storage.sync.get(STORAGE_KEY_FOR_SERVER_CONFIG, function(data) {
    console.log(data);
    var serverUrl = data[STORAGE_KEY_FOR_SERVER_CONFIG]['server-url'];
    var serverAuth = data[STORAGE_KEY_FOR_SERVER_CONFIG]['server-auth-key'];
    post_to_server(
        serverUrl,
        {
            "action": 'showApiKeys',
            "auth_key": serverAuth
        })
    .success(function(responseData, textStatus, jqXHR) {
        var r = JSON.parse(responseData);
        if (r['status'] === 'OK') {
            showServerKeys($('#keys'), r);
        } else {
            $('#keys').append(document.createTextNode('Server side failed to generate key data. Refresh page later.'))
        }
            $('#keys').append(document.createTextNode('The following keys are NOT uploaded to server yet.'))
        showStorage($('#keys'), data);
    }).error(function (responseData, textStatus, errorThrown) {
        $('#keys').append(document.createTextNode('Failed to load data from Server side. Refresh page later.'))
        console.log(errorThrown);
        console.log(responseData);
        console.log('POST failed.');
    });
});
