var HOMEPAGE = "http://www.vivintsolar.com/";
var LOGIN_PAGE = "https://account.vivintsolar.com/login";
var DASHBOARD_PAGE = "https://account.vivintsolar.com/dashboard";

var TEST_PAGE = "https://www.bing.com/";

var ACTION_FOR_HOMEPAGE = "homePage";
var ACTION_FOR_LOGIN_PAGE = "loginPage";
var ACTION_FOR_DASHBOARD_PAGE = "dashboardPage";

var ACTION_FOR_ASYNC_LOGIN = "asyncLogin";
var ACTION_FOR_ALERT = "sendingAlert";
var ACTION_FOR_SAVING_GENERATION_DATA = "savingGenerationData";

var ACTION_TO_PAGE = {};
ACTION_TO_PAGE[ACTION_FOR_HOMEPAGE] = HOMEPAGE;
ACTION_TO_PAGE[ACTION_FOR_LOGIN_PAGE] = LOGIN_PAGE;
ACTION_TO_PAGE[ACTION_FOR_DASHBOARD_PAGE] = DASHBOARD_PAGE;

var URL_TO_ACTION = {};
for (var action in ACTION_TO_PAGE) {
    URL_TO_ACTION[ACTION_TO_PAGE[action]] = action;
}
function urlToAction(inputUrl) {
    for (var url in URL_TO_ACTION) {
        if (matchUri(inputUrl, url)) {
            return URL_TO_ACTION[url];
        }
    }
    return "";
}

function matchUri(url, uri) {
    return url == uri || url.startsWith(uri + '?');
}

function sendAlert(msg) {
    chrome.runtime.sendMessage({"action": ACTION_FOR_ALERT, data: msg});
}

function saveGenerationData(data) {
    console.log("Saving data message to background.js " + new Date());
    console.log(data);
    chrome.runtime.sendMessage({"action": ACTION_FOR_SAVING_GENERATION_DATA, 'data': data});
}
function reloadPage() {
    console.log("VS: redirecting to login page." + new Date());
    window.location.href = LOGIN_PAGE;
}

function get_time_str(ts) {
    return new Date(parseInt(ts)).toString();
}

function get_chart(amount) {
    var a = parseInt(amount);
    var ret = ".";
    for (var i = 0; i < a; i++) {
        ret += "=";
    }
    return ret;
}
