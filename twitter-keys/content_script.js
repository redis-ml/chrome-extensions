
console.log("loading content_script.js...");

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("received data from content_script.js");
    console.log(request);
    var action = request["action"];
    main(action, request);
});

function main(action, request) {
    if (action === ACTION_FOR_NEW_APP_KEY_PAGEPAGE) {
        newAppKeyPage();
    } else if (action === ACTION_FOR_APP_PAGE) {
        appPage();
    } else if (action === ACTION_FOR_APP_KEYS_PAGE) {
        appKeysPage();
    } else if (action === ACTION_FOR_SHOW_STORAGE) {
        showStorage(request["data"]);
    } else {
        // Other cases.
        console.log("unknown action:");
        console.log(action);
        return;
    }
}

console.log("registered message handler in content_script.js");

function test() {
    document.write("<html><b>This is atest page</b></html>");
}

function appKeysPage() {
    var url = window.location.href;
    // TODO check if we need to wrap our own JQuery.js
    var key = $('.app-settings > div:eq(0) > span:eq(0)').html();
    var val = $('.app-settings > div:eq(0) > span:eq(1)').html();
    var sec_key = $('.app-settings > div:eq(1) > span:eq(0)').html();
    var sec_val = $('.app-settings > div:eq(1) > span:eq(1)').html();
    var id = tryParseAppKeysPageUrl(url);
    var json = {}
    json[id] = [val, sec_val, key, sec_key];

    chrome.runtime.sendMessage({id: "twitter-app-key", data: json}, function(response) {
          console.log(response);
    });
}

function appPage() {
    var links = document.getElementsByTagName('A');
    for (var i in links) {
        var link = links[i].href;
        if (link.endsWith('/keys')
                && (link.startsWith('/app/')
                   || link.startsWith(APP_HOME_PREFIX))) {
            links[i].click();
            break;
        }
    }
}

function newAppKeyPage() {
    var now = new Date();
    document.getElementById("edit-name").value = "klm" + now.getTime();
    document.getElementById("edit-description").value = "testing for " + now.getTime();
    document.getElementById("edit-url").value = "http://test" + now.getTime() + ".klm-hash.me/";
    document.getElementById("edit-tos-agreement").checked = true;
    document.getElementById("edit-submit").click();
}

function showStorage(data) {
    var html = "<pre>";
    for (var key in data) {
        var val = data[key];
        html += key + "\n" + val[0]+"\n"+val[1]+"\n";
    }
    html += '</pre>';
    console.log(html);
    document.body.innerHTML = html;
}

console.log("registered on load event here handler in content_script.js");
