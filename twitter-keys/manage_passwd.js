function renderPageWithServerData(response) {
    var table = $('<table/>', {
        id: 'passwd_tbl'
    });
    var tr = $('<tr/>');
    var headerData = response['header']; 
    var emptyRow = {};
    for (var i in headerData) {
        tr.append($('<th/>', {text: headerData[i]}));
        emptyRow[headerData[i]] = '';
    }
    tr.append($('<th/>', {text: 'operation'}))
    table.append(tr);

    var data = response['data'];
    for (var i in data) {
        var context = data[i];
        table.append(newUserNameRow(context));
    }
    $('#content')
        .append($('<button/>', {id: 'sync-btn', text: 'Push local data to Server'}).click(syncLocalToServer))
        .append(table)
        .append(
                $('<div/>')
                    .append($('<button/>', {text: '+'}).click(function() {
                        $('#passwd_tbl').append(newUserNameRow(emptyRow));
                    }))
                    .append($('<button/>', {text: 'Save'}).click(function() {
                        saveUserNameInPage(headerData);
                    })));
}

function newUserNameRow(context) {
    var tr = $('<tr/>');
    for (var key in context) {
        tr.append($('<td/>').append($('<input/>', {value: get_key(context, key)}).attr('size', 20)))
    }
    return tr.append($('<td/>').append($('<button/>', {text: 'Login', 'data-passwd': get_key(context, 'passwd'), 'data-username': get_key(context, 'username')}).click(loginUser)))
}
function addNewUserNameInPage() {
    $('#passwd_tbl').append(newUserNameRow(null));
}

function get_key(map, key) {
    if (map && (key in map)) {
        return map[key];
    }
    return '';
}
function newProfileConfig(data) {
    $('#signup_data')
        .append(document.createTextNode('Gmail account(without @gmail postfix):'))
        .append($('<input/>', {id: 'profile-gmail', value: get_key(data, 'gmail')}).attr('size', 15))
        .append($('<br/>'))
        .append(document.createTextNode('Phone number:'))
        .append($('<input/>', {id: 'profile-phone', value: get_key(data, 'phone-no')}).attr('size', 20))
        .append($('<br/>'))
        .append(document.createTextNode('Full name'))
        .append($('<input/>', {id: 'profile-name', value: get_key(data, 'full-name')}).attr('size', 40))
        .append($('<br/>'))
        .append($('<button/>', {id: 'profile-save', text: 'Save'}).click(saveProfile))
        ;
}

function newServerConfig(data) {
    $('#server_data')
        .append(document.createTextNode('Server url:'))
        .append($('<input/>', {id: 'server-url', value: get_key(data, 'server-url')}).attr('size', 80))
        .append($('<br/>'))
        .append(document.createTextNode('Server AUTH key:'))
        .append($('<input/>', {id: 'server-auth-key', value: get_key(data, 'server-auth-key')}).attr('size', 80))
        .append($('<button/>', {id: 'server-config-save', text: 'Save'}).click(saveServerConfig))
        ;
}

function saveUserNameInPage(headerData) {
    var newData = {};
    var table = $('#passwd_tbl');
    var inputs = $('#content > table td > input');
    var NUM_PER_ROW = headerData.length;
    for (var inputI = 0; inputI <= inputs.length - NUM_PER_ROW; inputI += NUM_PER_ROW) {
        var context = {};
        for (var i = 0; i < headerData.length; i++) {
            var key = headerData[i];
            var val = inputs[inputI + i].value;
            context[key] = val;
        }
        var username = context['username'];
        var passwd = context['passwd']
        var twitter_id = context['twitter_id'];
        if (username && passwd && !isNaN(twitter_id)) {
            var key = getUserPasswdStorageKey(username);
            newData[key] = context;
        } else {
            console.log("ignoring illegal data: " + JSON.stringify(context));
        }
    }
    chrome.storage.sync.set(newData, function() {
        $('#msg').text('Data Saved !');
        syncLocalToServer();
    });
}

function saveProfile(evt) {
    var phone = $('#profile-phone').val();
    var gmail = $('#profile-gmail').val();
    var name = $('#profile-name').val();
    var data = {
        'gmail': gmail,
        'phone-no': phone,
        'full-name': name
    };
    var newData = {};
    newData[STORAGE_KEY_FOR_SIGNUP_INFO] = data;
    chrome.storage.sync.set(newData);
}

function saveServerConfig(evt) {
    var serverUrl = $('#server-url').val();
    var serverAuthKey = $('#server-auth-key').val();
    var data = {
        'server-url': serverUrl,
        'server-auth-key': serverAuthKey
    };
    var newData = {};
    newData[STORAGE_KEY_FOR_SERVER_CONFIG] = data;
    chrome.storage.sync.set(newData, function() {});
}

document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.sync.get([STORAGE_KEY_FOR_SERVER_CONFIG, STORAGE_KEY_FOR_SIGNUP_INFO], function(data) {
        console.log(data);
        newProfileConfig(data[STORAGE_KEY_FOR_SIGNUP_INFO]);
        newServerConfig(data[STORAGE_KEY_FOR_SERVER_CONFIG]);
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
                renderPageWithServerData(r);
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

