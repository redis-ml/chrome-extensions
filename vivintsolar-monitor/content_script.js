
console.log("loading content_script.js...");

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("received data from content_script.js");
    console.log(request);
    var action = request["action"];
    main(action, request);
});

var already_logging_in = false;

function main(action, request) {
    var url = window.location.href;
    console.log("Taking action: " + action + " in " + url);
    if (action === ACTION_FOR_HOMEPAGE) {
        homePage(request);
    } else if (action === ACTION_FOR_LOGIN_PAGE) {
        loginPage(request);
    } else if (action === ACTION_FOR_ASYNC_LOGIN) {
        asyncLogin(request);
    } else if (action === ACTION_FOR_DASHBOARD_PAGE) {
        dashboardPage(request);
    } else {
        // Other cases.
        console.log("unknown action:");
        console.log(action);
        return;
    }
}
function reloadPage() {
    window.location.reload(true);
}
function dashboardPage(request) {
    console.log("In dashboard page");
    var val = $('[data-reactid=".0.0.3.0.0.0.0.0.1.0.0.1.0"]');
    if (val) {
        var ts = new Date().getTime();
        var amount = val.innerText;
        saveGenerationData({'time': ts, 'amount': amount});
    } else {
        sendAlert('Failed to read data from Dashboard page' + window.location.href);
    }
    window.setInterval(function() {
        reloadPage();
    }, 60000);
    //window.setInterval(function() {
    //    console.log("polling account data");
    //    $.ajax({url: "/api/fusion/accounts"}).done(function(msg) {
    //        console.log("got account data");
    //        var j = msg;
    //        if ('accounts' in j) {
    //            console.log(j['accounts']);
    //            var acct = j['accounts'][0]['account_no'];
    //            var newUrl = '/api/fusion/accounts/' + acct;
    //            console.log("polling account detail data");
    //            $.ajax({url: newUrl}).done(function(msg) {
    //                console.log("got account detail data");
    //                var j = msg;
    //                if ('energyToday' in j) {
    //                    var ts = new Date().getTime();
    //                    var amount = j['energyToday'];
    //                    console.log("saveing energy data");
    //                    saveGenerationData({'time': ts, 'amount': amount});
    //                    return;
    //                }
    //                sendAlert("Failed parse detailed account info from AJAX for: " + textStatus);
    //                reloadPage();
    //            }).fail(function(jqXHR, textStatus) {
    //                sendAlert("Request failed for loading detailed account info from AJAX for: " + textStatus);
    //                reloadPage();
    //            });
    //            return;
    //        }
    //        sendAlert('Failed to parse account data');
    //        reloadPage();
    //    }).fail(function(jqXHR, textStatus) {
    //        sendAlert("Request failed for loading accounts AJAX for: " + textStatus);
    //        reloadPage();
    //    });
    //}, 60000);
}
function loginPage(request) {
    if (request) {
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
        console.log("already logging in. This is possible, ignoring..");
        return;
    }
    already_logging_in = true;

    console.log("gettting new data to login");
    console.log(request);
    context = request['data'];
    if ($("INPUT[data-reactid='.0.0.0.0.0.1.1']").val(context.username).length > 0
            && $("INPUT[data-reactid='.0.0.0.0.0.2.0']").val(context.passwd).length > 0) {
        $("BUTTON[data-reactid='.0.0.0.0.0.4.0']").click();
        new Promise((resolve) => setTimeout(resolve, 100000)).then(() => {
            sendAlert('Login failed for username' + context.username + ' and passwd: ' + contex.passwd);
        });
    }
    $('.email-input.js-initial-focus').val(context.username);
    $('.js-password-field').val(context.passwd);
    new Promise((resolve) => setTimeout(resolve, 1500)).then(() => {
        $('button.submit').click();
    });
}

$(document).ready(function() {
    var action = urlToAction(window.location.href);
    if (action != '') {
        main(action, null);
    }
});
console.log("loaded:" + window.location.href);
console.log("registered on load event here handler in content_script.js");
