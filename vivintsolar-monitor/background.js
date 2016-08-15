
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
    var action = request.action;
    if (action === ACTION_FOR_ASYNC_LOGIN) {
        console.log("reeived request for async logging");
        if (sender.tab) {
            console.log("GOOD, request is from tab");
            // Only accept message posted from sender.
            var key = STORAGE_KEY_FOR_USER_PASSWD;
            console.log("getting data from storage");
            chrome.storage.sync.get(key, function(items) {
                console.log("sending data back to tab page");
                chrome.tabs.sendMessage(sender.tab.id, {"action" : ACTION_FOR_ASYNC_LOGIN, data: items[key]});
            });
        } else {
            console.log("reeived ILLEGAL request for async logging, which is not from TAB page");
        }
    } else if (action === ACTION_FOR_ALERT) {
        chrome.notification.create(action, {message: request.message});
    } else if (action === ACTION_FOR_SAVING_GENERATION_DATA) {
        saveGenerationDataToStorage(request.data);
    }
};
