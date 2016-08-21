function renderPage(data) {
    var table = $('<table/>', {
        id: 'passwd_tbl'
    });
    var tr = $('<tr/>')
        .append($('<th/>', {text: 'username'}))
        .append($('<th/>', {text: 'passwd'}))
        .append($('<th/>', {text: 'operation'}))
        .append($('<th/>', {text: 'comments'}));
    table.append(tr);
    for (var key in data) {
        if (!isUserPasswdStorageKey(key)) {
            continue;
        }
        var context = data[key];
        table.append(newUserNameRow(context));
    }
    $('#content')
        .append($('<button/>', {id: 'sync-btn', text: 'Push local data to Server'}).click(syncLocalToServer))
        .append(table)
        .append(
                $('<div/>')
                    .append($('<button/>', {text: '+'}).click(addNewUserNameInPage))
                    .append($('<button/>', {text: 'Save'}).click(saveUserNameInPage)));
    newProfileConfig(data[STORAGE_KEY_FOR_SIGNUP_INFO]);
    newServerConfig(data[STORAGE_KEY_FOR_SERVER_CONFIG]);
}

function newUserNameRow(context) {
    return $('<tr/>')
        .append($('<td/>').append($('<input/>', {value: get_key(context, 'username')}).attr('size', 15)))
        .append($('<td/>').append($('<input/>', {value: get_key(context, 'passwd')}).attr('size', 20)))
        .append($('<td/>').append($('<button/>', {text: 'Login', 'data-username': get_key(context, 'username')}).click(loginUser)))
        .append($('<td/>').append($('<input/>', {value: get_key(context, 'comment')}).attr('size', 40)));
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

function saveUserNameInPage() {
    var newData = {};
    var table = $('#passwd_tbl');
    var inputs = $('#content > table td > input');
    var NUM_PER_ROW = 3;
    for (var i = 0; i <= inputs.length - NUM_PER_ROW; i+= NUM_PER_ROW) {
        var username = inputs[i].value;
        var passwd = inputs[i+1].value;
        var comment = inputs[i+2].value;
        if (username && passwd) {
            var key = getUserPasswdStorageKey(username);
            newData[key] = {'username': username, 'passwd': passwd, 'comment': comment};
        }
    }
    chrome.storage.sync.get(null, function(items) {
        var toDel = [];
        for (var key in items) {
            if (!isUserPasswdStorageKey(key)) {
                continue;
            }
            if (!(key in newData)) {
                toDel.push(key);
            }
        }
        if (toDel.length > 0) {
            chrome.storage.sync.remove(toDel);
        }
        chrome.storage.sync.set(newData, function() {
            $('#msg').text('Data Saved !');
        });
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
    chrome.storage.sync.get(null, function(data) {
        renderPage(data);
    });
});

