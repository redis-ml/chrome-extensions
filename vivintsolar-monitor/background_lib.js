var STORAGE_KEY_FOR_USER_PASSWD = "shadow:";
var STORAGE_KEY_FOR_GENERATION_DATA = "generation-data";

var MAX_STORED_DATA_POINTS = 200;

var HTML_ID_KEYS_TABLE = 'keysTbl';
var HTML_ID_KEYS_USER_NAME = 'keysUserName';
var HTML_ID_KEYS_PASSWD = 'keysPasswd';

function eventHandler(tab) {
    //chrome.tabs.create({url: chrome.extension.getURL("tab.html")}, loadHomePage);
    console.log("you clicked the button in " + tab.url);
}

function defaultTask() {
    chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {
        // since only one tab should be active and in the current window at once
        // the return variable should only have one entry
        var activeTab = arrayOfTabs[0];
        eventHandler(activeTab);
    });
}

function sendSingleAction(tab, action) {
  chrome.tabs.sendMessage(tab.id, {"action" : action});
}

function saveGenerationDataToStorage(data) {
    var key = STORAGE_KEY_FOR_GENERATION_DATA;
    chrome.storage.sync.get(key, function(items) {
        var item = items[key];
        if (!item) {
            item = [];
        }
        while (item.length > MAX_STORED_DATA_POINTS - 1) {
            item.shift();
        }
        item.push(data);
        var newData = {};
        newData[key] = item;
        chrome.storage.sync.set(newData);
    });
}
function isUserPasswdStorageKey(key) {
    return key && key.startsWith(STORAGE_KEY_FOR_USER_PASSWD);
}

function get_val_from_entry(map, key) {
    if (map && (key in map)) {
        return map[key];
    }
    return '';
}
function showStorage(parentElement, fullData) {
    var data = fullData[STORAGE_KEY_FOR_USER_PASSWD];
    var header = $('<div/>')
        .append($('<span/>', {text: 'Username:'}))
        .append($('<input/>', {id: HTML_ID_KEYS_USER_NAME, value: get_val_from_entry(data, 'username')}))
        .append($('<br/>'))
        .append($('<span/>', {text: 'Password:'}))
        .append($('<input/>', {id: HTML_ID_KEYS_PASSWD, value: get_val_from_entry(data, 'passwd')}))
        .append($('<br/>'))
        .append($('<button/>', {text: 'Save'}).click(function(e) {
            var username = $('#'+HTML_ID_KEYS_USER_NAME).val();
            var password = $('#'+HTML_ID_KEYS_PASSWD).val();
            var newData = {};
            newData[STORAGE_KEY_FOR_USER_PASSWD] = {'username': username, 'passwd': password};
            chrome.storage.sync.set(newData);
        }))
        ;
    parentElement.append(header);

    var table = $('<table/>')
        .append($('<tr/>')
                .append($('<th/>', {text: 'time'}))
                .append($('<th/>', {text: 'timestamp'}))
                .append($('<th/>', {text: 'value(kwh)'}))
                .append($('<th/>', {text: 'chart'})));
    var list = fullData[STORAGE_KEY_FOR_GENERATION_DATA];
    for (var i in list) {
        var item = list[i];
        var ts = get_val_from_entry(item,'time');
        var timeStr = get_time_str(ts);
        var amount = get_val_from_entry(item, 'amount');
        var chart = get_chart(amount);
        table.append($('<tr/>')
            .append($('<td/>', {text: timeStr}))
            .append($('<td/>', {text: ts}))
            .append($('<td/>', {text: amount}))
            .append($('<td/>', {text: chart}))
        );
    }
    parentElement.append(table);
}
