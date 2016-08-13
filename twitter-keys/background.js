
// Called when the user clicks on the browser action.
// It won't work if 'default_popup' is specified in manifest.json
//chrome.browserAction.onClicked.addListener(eventHandler);

chrome.runtime.onMessage.addListener(messageHandler);

//for (var i = 0; i < shadow.length - 1; i++) {
//    console.log("adding context menu");
//    var context = shadow[i];
//    var id = chrome.contextMenus.create({"title": "login as " + context.username, "id": context.username, "contexts": ["all"]});
//    console.log("adding context menu :");
//    console.log(id);
//}
//chrome.contextMenus.onClicked.addListener(triggerLoginUser);

chrome.commands.onCommand.addListener(commandHandler);

function commandHandler(command) {
    console.log('Command:', command);
    defaultTask();
}

function messageHandler(request, sender, sendResponse) {
    console.log(request);
    if (request.action === ACTION_FOR_SAVING_TWITTER_APP_KEY) {
        console.log("got it from extension !");
        for (var appId in request.data) {
            var detail = request.data[appId];
            chrome.storage.sync.set(request.data, function() {});
        }
    } else if (request.action === ACTION_FOR_ASYNC_LOGIN) {
        console.log("reeived request for async logging");
        if (sender.tab) {
            console.log("GOOD, request is from tab");
            // Only accept message posted from sender.
            var key = getLocalStorageKeyForLoginTab(sender.tab.id);
            console.log("getting data from storage");
            chrome.storage.local.get(key, function(items) {
                console.log("got data from storage, removing existing data");
                chrome.storage.local.remove(key, function() {});
                console.log("sending data back to tab page");
                chrome.tabs.sendMessage(sender.tab.id, {"action" : ACTION_FOR_ASYNC_LOGIN, data: items[key]});
            });
        } else {
            console.log("reeived ILLEGAL request for async logging, which is not from TAB page");
        }
    } else if (request.action === ACTION_FOR_SIGNUP_NEW_USER_NAME) {
        var data = request['data'];
        var key = getUserPasswdStorageKey(data['username']);
        var newData = {};
        newData[key] = data;
        chrome.storage.sync.set(newData);
    } else {
    }
};
