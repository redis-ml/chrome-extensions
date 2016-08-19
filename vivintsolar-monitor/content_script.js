
console.log("VS: loading content_script.js..." + new Date());

// Check if the communication between page and background.js has broken.
var last_message_time = new Date().getTime();
new Promise((resolve) => setTimeout(resolve, 1000000)).then(() => {
    var now = new Date().getTime();
    if (now - last_message_time > 500000) {
        sendAlert('Not having message from background for at least 500s, force reloading');
        reloadPage();
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // Update timestamp first.
    last_message_time = new Date().getTime();

    console.log("VS: received data from content_script.js" + new Date());
    console.log(request);
    var action = request["action"];
    takeAction(action, request);
});

var already_logging_in = false;

function takeAction(action, request) {
    var url = window.location.href;
    console.log("VS: Taking action: " + action + " in " + url);
    if (action === ACTION_FOR_HOMEPAGE) {
        homePage(request);
    } else if (action === ACTION_FOR_LOGIN_PAGE) {
        loginPage(request);
    } else if (action === ACTION_FOR_ASYNC_LOGIN) {
        loginPage(request);
    } else if (action === ACTION_FOR_DASHBOARD_PAGE) {
        dashboardPage(request);
    } else {
        // Other cases.
        console.log("VS: unknown action:" + new Date());
        console.log(action);
        return;
    }
}

function dashboardPage(request) {
    console.log("VS: In dashboard page" + new Date());
    //var val = $('[data-reactid=".0.0.3.0.0.0.0.0.1.0.0.1.0"]');
    //if (val) {
    //    var ts = new Date().getTime();
    //    var amount = val.text();
    //    if (!amount) {
    //        console.log("Failed to parse data from html page. " + new Date());
    //    } else {
    //        saveGenerationData({'amount': amount, 'time': ts});
    //    }
    //} else {
    //    sendAlert('Failed to read data from Dashboard page' + window.location.href);
    //}
    //console.log("VS: setting to reload page in 60s: " + new Date());
    //window.setInterval(function() {
        console.log("VS: polling account data" + new Date());
        $.ajax({url: "/api/fusion/accounts"}).done(function(msg) {
            console.log("VS: got account data" + new Date());
            var j = msg;
            if (typeof(j) === "object" && 'accounts' in j) {
                console.log(j['accounts']);
                var acct = j['accounts'][0]['account_no'];
                var newUrl = '/api/fusion/accounts/' + acct;
                console.log("VS: polling account detail data" + new Date());
                $.ajax({url: newUrl}).done(function(msg) {
                    console.log("VS: got account detail data" + new Date());
                    var j = msg;
                    if (typeof(j) === "object" && 'energyToday' in j) {
                        var ts = new Date().getTime();
                        var amount = j['energyToday'] / 1000.0;
                        console.log("VS: saveing energy data" + new Date());
                        saveGenerationData({'time': ts, 'amount': amount});
                        return;
                    }
                    sendAlert("Failed parse detailed account info from AJAX for: " + textStatus);
                    reloadPage();
                }).fail(function(jqXHR, textStatus) {
                    sendAlert("Request failed for loading detailed account info from AJAX for: " + textStatus);
                    reloadPage();
                });
                return;
            }
            sendAlert('Failed to parse account data');
            reloadPage();
        }).fail(function(jqXHR, textStatus) {
            sendAlert("Request failed for loading accounts AJAX for: " + textStatus);
            reloadPage();
        });
    //}, 60000);
}
function loginPage(request) {
    if (request) {
        asyncLogin(request);
    } else {
        chrome.runtime.sendMessage({"action": ACTION_FOR_ASYNC_LOGIN});
    }
}
function homePage(request) {
    var links = $('A');
    for (var i in links) {
        var link = links[i];
        if (link.href == LOGIN_PAGE) {
            link.click();
        }
    }
}

function asyncLogin(request) {
    if (already_logging_in) {
        console.log("VS: already logging in. This is possible, ignoring.." + new Date());
        return;
    }
    already_logging_in = true;

    console.log("VS: gettting new data to login" + new Date());
    console.log(request);
    context = request['data'];
    if ($("INPUT[data-reactid='.0.0.0.0.0.1.1']").val(context.username).length > 0
            && $("INPUT[data-reactid='.0.0.0.0.0.2.0']").val(context.passwd).length > 0) {
        $("BUTTON[data-reactid='.0.0.0.0.0.4.0']").click();
        new Promise((resolve) => setTimeout(resolve, 100000)).then(() => {
            sendAlert('Login failed for username' + context.username + ' and passwd: ' + context.passwd);
        });
    }
    $('.email-input.js-initial-focus').val(context.username);
    $('.js-password-field').val(context.passwd);
    new Promise((resolve) => setTimeout(resolve, 1500)).then(() => {
        $('button.submit').click();
    });
}

var action = urlToAction(window.location.href);
console.log("VS: intercepted action:" + action + " at " + new Date());
if (action != '') {
    takeAction(action, null);
}
console.log("VS: loaded:" + window.location.href);
console.log("VS: registered on load event here handler in content_script.js" + new Date());
