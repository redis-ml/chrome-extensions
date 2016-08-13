function renderPage(data) {
    var profileData = null;
    var table = $('<table/>', {
        id: 'passwd_tbl'
    });
    var tr = $('<tr/>')
        .append($('<th/>', {text: 'username'}))
        .append($('<th/>', {text: 'passwd'}))
        .append($('<th/>', {text: 'operation'}));
    table.append(tr);
    for (var key in data) {
        if (!isUserPasswdStorageKey(key)) {
            if (key === STORAGE_KEY_FOR_SIGNUP_INFO) {
                profileData = data[key];
            }
            continue;
        }
        var context = data[key];
        var tr = $('<tr/>')
            .append($('<td/>').append($('<input/>', {value: context['username'], size: 40})))
            .append($('<td/>').append($('<input/>', {value: context['passwd'], size: 40})))
            .append($('<td/>').append($('<button/>', {text: 'Login', 'data-username': context['username']}).click(loginUser)));
        table.append(tr);
    }
    $('#content')
        .append(table)
        .append(
                $('<div/>')
                    .append($('<button/>', {text: '+'}).click(addNewUserNameInPage))
                    .append($('<button/>', {text: 'Save'}).click(saveUserNameInPage)));
    newProfileConfig(profileData);
}

function newProfileConfig(data) {
    $('#signup_data')
        .append(document.createTextNode('Gmail account(without @gmail postfix):'))
        .append($('<input/>', {id: 'profile-gmail', value: (data ? data['gmail'] : ''), size: 40}))
        .append($('<br/>'))
        .append(document.createTextNode('Phone number:'))
        .append($('<input/>', {id: 'profile-phone', value: (data ? data['phone-no'] : ''), size: 40}))
        .append($('<br/>'))
        .append(document.createTextNode('Full name'))
        .append($('<input/>', {id: 'profile-name', value: (data ? data['full-name'] : ''), size: 40}))
        .append($('<br/>'))
        .append($('<button/>', {id: 'profile-save', text: 'Save'}).click(saveProfile))
        ;
}

function addNewUserNameInPage() {
    $('#passwd_tbl').append(
        $('<tr/>')
            .append($('<td/>').append($('<input/>', {size: 40})))
            .append($('<td/>').append($('<input/>', {size: 40}))));
}

function saveUserNameInPage() {
    var newData = {};
    var table = $('#passwd_tbl');
    var inputs = $('#content > table td > input');
    for (var i = 0; i < inputs.length - 1; i+= 2) {
        var username = inputs[i].value;
        var passwd = inputs[i+1].value;
        if (username && passwd) {
            var key = getUserPasswdStorageKey(username);
            newData[key] = {'username': username, 'passwd': passwd};
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

document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.sync.get(null, function(data) {
        renderPage(data);
    });
});

