
// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(eventHandler);
chrome.runtime.onMessage.addListener(messageHandler);

function eventHandler(tab) {
    //chrome.tabs.create({url: chrome.extension.getURL("tab.html")}, loadHomePage);
    console.log("you clicked the button in " + tab.url);
    if (tab.url === VIEW_DATA_PAGE) {
        chrome.storage.sync.get(null, function(items) {
            console.log("all items:");
            console.log(items);
            // Data must be copied out before sending to content file.
            var data = {};
            for (var key in items) {
                var val = items[key];
                var arr = [];
                for (var i in val) {
                    arr.push(val[i]);
                }
                data[key] = arr;
            }
            sendAllData(tab, data);
        });
    } else {
        var action = urlToAction(tab.url);
        if (action === "") {
            chrome.tabs.create({url: NEW_APP_KEY_PAGE}, applyForNewAppKey);
        } else {
            sendSingleAction(tab, action);
        }
    }
}

function messageHandler(request, sender, sendResponse) {
    console.log(request);
    if (request.id == "twitter-app-key") {
        console.log("got it from extension !");
        for (var appId in request.data) {
            var detail = request.data[appId];
            chrome.storage.sync.set(request.data, function() {
                console.log(request.data)
                chrome.tabs.create({url: VIEW_DATA_PAGE}, eventHandler);
            });
        }
    }
};

function applyForNewAppKey(tab) {
    sendSingleAction(tab, ACTION_FOR_NEW_APP_KEY_PAGEPAGE);
}

function sendSingleAction(tab, action) {
  chrome.tabs.sendMessage(tab.id, {"action" : action});
}

function sendAllData(tab, data) {
  var post = {"data": data, "action": ACTION_FOR_SHOW_STORAGE};
  console.log("send data:");
  console.log(post);
  chrome.tabs.sendMessage(tab.id, post);
}
