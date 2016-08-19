
// Called when the user clicks on the browser action.
// It won't work if 'default_popup' is specified in manifest.json
//chrome.browserAction.onClicked.addListener(eventHandler);

chrome.runtime.onMessage.addListener(messageHandler);

chrome.commands.onCommand.addListener(commandHandler);

chrome.alarms.onAlarm.addListener(alarmHandler);
chrome.alarms.create("default", {delayInMinutes: 1, periodInMinutes: 10});

function alarmHandler(alarm) {
    if (!alarm) {
        console.log("Unexpected null Alarm object");
        return;
    }
    console.log("got alarm!");
    console.log(alarm);
    if (alarm.name === "default") {
        chrome.tabs.query({url: '*://*.vivintsolar.com/*'}, function(tabs) {
                if (tabs.lengh === 0) {
                    console.log("Found no tabs!!! " + new Date());
                    return;
                }
                var tab = tabs[0];
                var action = urlToAction(tab.url);
                console.log("sending action back: " + action + " at " + new Date());
                chrome.tabs.sendMessage(tab.id, {'action': action});
            });
    }
}

function commandHandler(command) {
    console.log('Command:', command);
    defaultTask();
}

function messageHandler(request, sender, sendResponse) {
    console.log(request);
    var action = request.action;
    console.log("received message: " + JSON.stringify(request) + " at " + new Date());
    if (action === ACTION_FOR_ASYNC_LOGIN) {
        console.log("reeived request for async logging" + new Date());
        if (sender.tab) {
            console.log("GOOD, request is from tab" + new Date());
            // Only accept message posted from sender.
            var key = STORAGE_KEY_FOR_USER_PASSWD;
            console.log("getting data from storage" + new Date());
            chrome.storage.sync.get(key, function(items) {
                console.log("sending data back to tab page" + new Date());
                chrome.tabs.sendMessage(sender.tab.id, {"action" : ACTION_FOR_ASYNC_LOGIN, data: items[key]});
            });
        } else {
            console.log("reeived ILLEGAL request for async logging, which is not from TAB page" + new Date());
        }
    } else if (action === ACTION_FOR_ALERT) {
        console.log("ALERT msg: " + JSON.stringify(request));
        //chrome.notifications.create(action, {type: "basic", message: request.message});
    } else if (action === ACTION_FOR_SAVING_GENERATION_DATA) {
        saveGenerationDataToStorage(request.data);
        console.log("returning data from messageHandler!" + new Date());
        return "OK";
    }
};
