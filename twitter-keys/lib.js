
var VIEW_DATA_PAGE = "https://www.google.com/";
var NEW_APP_KEY_PAGE = "https://apps.twitter.com/app/new";
var APP_HOME_PREFIX = 'https://apps.twitter.com/app/';
var APP_KEYS_POSTFIX = '/keys';
var APP_HOME_POSTFIX = '/show';

var ACTION_FOR_NEW_APP_KEY_PAGEPAGE = "applyForNewAppKey";
var ACTION_FOR_APP_PAGE = "appPage";
var ACTION_FOR_APP_KEYS_PAGE = "appKeysPage";
var ACTION_FOR_SHOW_STORAGE = "showStorage";

function urlToAction(url) {
    if (url === NEW_APP_KEY_PAGE) {
        return ACTION_FOR_NEW_APP_KEY_PAGEPAGE;
    } else if (tryParseAppHomePageUrl(url) != "") {
        return ACTION_FOR_APP_PAGE;
    } else if (tryParseAppKeysPageUrl(url) != "") {
        return ACTION_FOR_APP_KEYS_PAGE;
    }
    return "";
}

function tryParseAppHomePageUrl(url) {
    if (url.startsWith(APP_HOME_PREFIX)) {
        var id;
        if (url.endsWith(APP_HOME_POSTFIX)) {
            id = url.substring(APP_HOME_PREFIX.length, url.length - APP_HOME_POSTFIX.length);
        } else {
            id = url.substring(APP_HOME_PREFIX.length);
        }
        if (!isNaN(id)) {
            return id;
        }
    }
    return "";
}

function tryParseAppKeysPageUrl(url) {
    if (url.startsWith(APP_HOME_PREFIX)
            && url.endsWith(APP_KEYS_POSTFIX)) {
        var id = url.substring(APP_HOME_PREFIX.length, url.length - APP_KEYS_POSTFIX.length);
        if (!isNaN(id)) {
            return id;
        }
    }
    return "";
}

