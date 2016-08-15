
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
    if (action === ACTION_FOR_NEW_APP_KEY_PAGEPAGE) {
        newAppKeyPage();
    } else if (action === ACTION_FOR_APP_PAGE) {
        appPage();
    } else if (action === ACTION_FOR_ASYNC_LOGIN) {
        twitterSignin(request);
    } else if (action === ACTION_FOR_APP_KEYS_PAGE) {
        appKeysPage();
//    } else if (action === ACTION_FOR_SHOW_STORAGE) {
//        showStorage(request["data"]);
    } else if (action === ACTION_FOR_TWITTER_HOMEPAGE) {
        //homePage();
    } else if (action === ACTION_FOR_TWITTER_SIGNIN_PAGE) {
        initiateAsyncTwitterSignin();
    } else if (action === ACTION_FOR_TWITTER_RE_SIGNIN_PAGE) {
        twitterReSignin();
    } else if (action === ACTION_FOR_SIGNUP_PAGE) {
        signupPage(request);
    } else if (action === ACTION_FOR_VERIFY_EMAIL_WHEN_SIGNUP) {
        verifyEmailForSignup(request);
    } else if (action === ACTION_FOR_ADD_USERNAME_WHEN_SIGNUP) {
        addUsernameForSignup();
    } else {
        // Other cases.
        console.log("unknown action:");
        console.log(action);
        return;
    }
}

console.log("registered message handler in content_script.js" + new Date().getTime());

function test() {
    document.write("<html><b>This is atest page</b></html>");
}
function twitterReSignin() {
    var button = $('.Button');
    if (button && button.length == 1) {
        console.log("Found only one button");
        var buttonVal = button.val();
        if (buttonVal == "Start" || buttonVal == "Send code" || buttonVal == "Continue to Twitter") {
            console.log("Clicking start");
            // Start page.
            new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
                button.click();
            });
        }
    }
}
function initiateAsyncTwitterSignin() {
    console.log("initiating async login procedure.");
    chrome.runtime.sendMessage({"action": ACTION_FOR_ASYNC_LOGIN});
}
function twitterSignin(request) {
    if (already_logging_in) {
        console.log("already logging in. This is possible, ignoring..");
        return;
    }
    already_logging_in = true;
    console.log("gettting new data to login");
    console.log(request);
    context = request['data'];
    $('.email-input.js-initial-focus').val(context.username);
    $('.js-password-field').val(context.passwd);
    new Promise((resolve) => setTimeout(resolve, 1500)).then(() => {
        $('button.submit').click();
    });
}
function addUsernameForSignup() {
    var now = new Date();
    var username = "t" + now.getMonth() + "l" + now.getDate() + "l" + now.getHours() + "l" + now.getMinutes() + "l" + now.getSeconds();
    // Report new username for record.
    chrome.runtime.sendMessage({action: ACTION_FOR_SIGNUP_NEW_USER_NAME, data: {'username': username, 'passwd': DEFAULT_PASSWORD}});
    if(!(
                $("#username").val(username))) {
        alert("failed to parse verify email page");
        return;
    }
    new Promise((resolve) => setTimeout(resolve, 3000)).then(() => {
        $("#submit_button").click();
    });
}
function verifyPhone() {
    // Needs Manual input.
    //if (!($("#verify_code").val)) {
    //}
}

function verifyEmailForSignup(request) {
    var data = request['data'];

    var now = new Date();
    var email = data['gmail'] + "+" + now.getMonth() + "-" + now.getDate() + "-" + now.getHours() + "-" + now.getMinutes() + "-" + now.getSeconds() + "@gmail.com";
    if(!(
                $("#email").val(email)
                && $("#submit_button").click())) {
        alert("failed to parse verify email page");
        return;
    }
}

function signupPage(request) {
    var data = request['data'];
    if (!(
                $("#full-name").val(data['full-name'])
                && $("#email").val(data['phone-no'])
                && $("#password").val(DEFAULT_PASSWORD))) {
        alert("Failed to parse signup page, check the parser code ");
        return;
    }
    new Promise((resolve) => setTimeout(resolve, 3000)).then(() => {
        $("#submit_button").click();
    });
}

function homePage() {
    var signUpBtn = $("a.StreamsSignUp");
    if (signUpBtn) {
        signUpBtn.click();
        return;
    }
    var signOutBtn = $("#signout-button > button");
    if (signOutBtn) {
        signOutBton.click();
        return;
    }
    alert("Unrecognized twitter homepage, check the parser code of chrome extension");
}

function appKeysPage() {
    var createBtn = document.getElementById("edit-submit-owner-token");
    if (createBtn) {
        if (createBtn.tagName != "INPUT") {
            alert("Fail to parse page source code, please check. (expecting page without keys)");
            return;
        }
        createBtn.click();
    }
    var links = document.getElementsByClassName("btn");
    var found = false;
    for (var i in links) {
        var link = links[i];
        if (link.innerText.trim() == "Revoke Token Access") {
            found = true;
            break;
        }
    }
    if (!found) {
        alert("Failed to parse page source code, please check. (expecting page with keys)");
        return;
    }
    var url = window.location.href;
    // TODO check if we need to wrap our own JQuery.js
    var key = $('.app-settings > div:eq(0) > span:eq(0)').html();
    var val = $('.app-settings > div:eq(0) > span:eq(1)').html();
    var sec_key = $('.app-settings > div:eq(1) > span:eq(0)').html();
    var sec_val = $('.app-settings > div:eq(1) > span:eq(1)').html();

    var owner_key = $('.app-settings > div:eq(3) > span:eq(0)').html();
    var owner_val = $('.app-settings > div:eq(3) > span:eq(1)').html();

    var token_key = $('.access > div:eq(0) > span:eq(0)').html();
    var token_val = $('.access > div:eq(0) > span:eq(1)').html();
    var token_sec_key = $('.access > div:eq(1) > span:eq(0)').html();
    var token_sec_val = $('.access > div:eq(1) > span:eq(1)').html();
    var id = tryParseAppKeysPageUrl(url);
    var json = {}
    json[id] = [[key, val], [sec_key, sec_val], [token_key, token_val], [token_sec_key, token_sec_val], [owner_key, owner_val]];

    chrome.runtime.sendMessage({action: ACTION_FOR_SAVING_TWITTER_APP_KEY, data: json}, function(response) {
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

$(document).ready(function() {
var action = urlToAction(window.location.href);
if (action == ACTION_FOR_APP_KEYS_PAGE
        || action === ACTION_FOR_TWITTER_SIGNIN_PAGE
        || action === ACTION_FOR_TWITTER_RE_SIGNIN_PAGE) {
    main(action, null);
}
});
console.log("loaded:" + window.location.href);
console.log("registered on load event here handler in content_script.js");
