var STORAGE_KEY_FOR_USER_PASSWD = "shadow:";
var STORAGE_KEY_FOR_OAUTH_KEY = "oauthKey:";
var STORAGE_KEY_FOR_SIGNUP_INFO = "signupInfo";

var HTML_ID_KEYS_TABLE = 'keysTbl';

function eventHandler(tab) {
    //chrome.tabs.create({url: chrome.extension.getURL("tab.html")}, loadHomePage);
    console.log("you clicked the button in " + tab.url);
    if (tab.url === VIEW_DATA_PAGE) {
        //var new_url = chrome.extension.getURL("view_keys.html");
        //chrome.tabs.create({url: new_url}, applyForNewAppKey);
    } else {
        var action = urlToAction(tab.url);
        if (action === "" || action === ACTION_FOR_TWITTER_HOMEPAGE) {
            chrome.tabs.create({url: NEW_APP_KEY_PAGE}, applyForNewAppKey);
        } else if (action === ACTION_FOR_SIGNUP_PAGE || action === ACTION_FOR_VERIFY_EMAIL_WHEN_SIGNUP) {
            chrome.storage.sync.get(STORAGE_KEY_FOR_SIGNUP_INFO, function(items) {
                if (items) {
                    chrome.tabs.sendMessage(tab.id, {"action" : action, data: items[STORAGE_KEY_FOR_SIGNUP_INFO]});
                }
            });
        } else if (action === ACTION_FOR_TEST) {
            // For Test only
            //var new_url = chrome.extension.getURL("view_keys.html");
            //chrome.tabs.create({url: new_url}, applyForNewAppKey);
        } else {
            sendSingleAction(tab, action);
        }
    }
}

function defaultTask() {
    chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {
        // since only one tab should be active and in the current window at once
        // the return variable should only have one entry
        var activeTab = arrayOfTabs[0];
        eventHandler(activeTab);
    });
}

function triggerLoginUser(context) {
    if (context) {
        console.log("get context" + JSON.stringify(context));
        chrome.tabs.create({url: TWITTER_SIGNIN_PAGE}, function(tab) {
            console.log('sending data to page:' + new Date().getTime() + " , " + JSON.stringify(context));
            var data = {};
            data[getLocalStorageKeyForLoginTab(tab.id)] = context;
            chrome.storage.local.set(data, function() {
                chrome.tabs.sendMessage(tab.id, {"action" : ACTION_FOR_ASYNC_LOGIN, 'data': context});
            });
        });
    } else {
        console.log("Unknonw parameter " + context);
    }
}

function applyForNewAppKey(tab) {
    sendSingleAction(tab, ACTION_FOR_NEW_APP_KEY_PAGEPAGE);
}

function sendSingleAction(tab, action) {
  chrome.tabs.sendMessage(tab.id, {"action" : action});
}

function getLocalStorageKeyForLoginTab(tabId) {
    return 'tab:'+tabId+',login';
}

function isOauthStorageKey(key) {
    return !isNaN(key) || (key && key.startsWith(STORAGE_KEY_FOR_OAUTH_KEY));
}
function getOauthStorageKey(key) {
    return STORAGE_KEY_FOR_OAUTH_KEY + key;
}
function isUserPasswdStorageKey(key) {
    return key && key.startsWith(STORAGE_KEY_FOR_USER_PASSWD);
}
function getUserPasswdStorageKey(id) {
    return STORAGE_KEY_FOR_USER_PASSWD + id;
}

function loginUser(event) {
    console.log("click something");
    var username = $(this).attr('data-username');
    console.log("got username:" + username);
    var key = getUserPasswdStorageKey(username);
    chrome.storage.sync.get(key, function(item) {
        var context = item[key];
        triggerLoginUser(context);
    });
}

function showStorage(parentElement, data) {
    var table = $('<table/>', {id: HTML_ID_KEYS_TABLE});
    var header = $('<tr/>');
    var headerInitiated = false;
    for (var key in data) {
        if (!isOauthStorageKey(key)) {
            continue;
        }
        var vals = data[key];
        var tr = $('<tr/>');
        for (var i in vals) {
            var v = vals[i];
            if (!headerInitiated) {
                header.append($('<th/>', {text: v[0]}));
            }
            tr.append($('<td/>', {text: v[1]}));
        }
        if (!headerInitiated) {
            headerInitiated = true;
            table.append(header);
        }
        table.append(tr);
    }
    parentElement.append(table);
    console.log(table);
}
