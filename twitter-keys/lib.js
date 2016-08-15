var VIEW_DATA_PAGE = "https://www.google.com/";
var TEST_PAGE = "https://www.bing.com/";
var NEW_APP_KEY_PAGE = "https://apps.twitter.com/app/new";
var TWITTER_SIGNIN_PAGE = "https://twitter.com/login";
var SIGNUP_VERIFY_PAGE = "https://twitter.com/welcome/phone_signup_verify";
var SIGNUP_EMAIL_VERIFY_PAGE = "https://twitter.com/welcome/add_email";
var SIGNUP_ADD_USER_NAME = "https://twitter.com/account/add_username";
var TWITTER_RE_SIGNIN_PAGE = "https://twitter.com/account/access"; // $('.Button') // "Continue to Twitter"
var APP_HOME_PREFIX = 'https://apps.twitter.com/app/';
var TWITTER_HOMEPAGE = 'https://twitter.com/';
var TWITTER_SIGNUP_PAGE = 'https://twitter.com/signup';
var APP_KEYS_POSTFIX = '/keys';
var APP_HOME_POSTFIX = '/show';
var TWITTER_DOWNLOAD_PAGE = 'https://twitter.com/download';

var ACTION_FOR_TEST = "testPage";
var ACTION_FOR_ASYNC_LOGIN = "asyncLogin";
var ACTION_FOR_TWITTER_RE_SIGNIN_PAGE = "twitterReSignin";
var ACTION_FOR_SAVING_TWITTER_APP_KEY = "";
var ACTION_FOR_TWITTER_SIGNIN_PAGE = "twitterSigninPage";
var ACTION_FOR_TWITTER_HOMEPAGE = "twitterHomePage";
var ACTION_FOR_NEW_APP_KEY_PAGEPAGE = "applyForNewAppKey";
var ACTION_FOR_APP_PAGE = "appPage";
var ACTION_FOR_APP_KEYS_PAGE = "appKeysPage";
var ACTION_FOR_SHOW_STORAGE = "showStorage";
var ACTION_FOR_SIGNUP_PAGE = "signupForTwitter";
var ACTION_FOR_VERIFY_PHONE = "verifyPhoneNumber";
var ACTION_FOR_VERIFY_EMAIL_WHEN_SIGNUP = "verifyEmailForSignup";
var ACTION_FOR_ADD_USERNAME_WHEN_SIGNUP = "addUserNameForSignup";
var ACTION_FOR_TWITTER_DOWNLOAD_PAGE = "twitterDownloadPage";

var ACTION_FOR_SIGNUP_NEW_USER_NAME = "reportSignupingNewUserName";

var DEFAULT_PASSWORD = 'KlUnNu@51324';

function urlToAction(url) {
    if (url === NEW_APP_KEY_PAGE) {
        return ACTION_FOR_NEW_APP_KEY_PAGEPAGE;
    } else if (tryParseAppHomePageUrl(url) != "") {
        return ACTION_FOR_APP_PAGE;
    } else if (tryParseAppKeysPageUrl(url) != "") {
        return ACTION_FOR_APP_KEYS_PAGE;
    } else if (matchUri(url, TWITTER_HOMEPAGE)) {
        return ACTION_FOR_TWITTER_HOMEPAGE;
    } else if (matchUri(url, TEST_PAGE)) {
        return ACTION_FOR_TEST;
    } else if (matchUri(url, TWITTER_SIGNUP_PAGE)) {
        return ACTION_FOR_SIGNUP_PAGE;
    } else if (matchUri(url, TWITTER_RE_SIGNIN_PAGE)) {
        return ACTION_FOR_TWITTER_RE_SIGNIN_PAGE;
    } else if (matchUri(url, SIGNUP_VERIFY_PAGE)) {
        return ACTION_FOR_VERIFY_PHONE;
    } else if (matchUri(url, TWITTER_SIGNIN_PAGE)) {
        return ACTION_FOR_TWITTER_SIGNIN_PAGE;
    } else if (matchUri(url, TWITTER_DOWNLOAD_PAGE)) {
        return ACTION_FOR_TWITTER_DOWNLOAD_PAGE;
    } else if (matchUri(url, SIGNUP_EMAIL_VERIFY_PAGE)) {
        return ACTION_FOR_VERIFY_EMAIL_WHEN_SIGNUP;
    } else if (matchUri(url, SIGNUP_ADD_USER_NAME)) {
        return ACTION_FOR_ADD_USERNAME_WHEN_SIGNUP;
    }
    return "";
}

function matchUri(url, uri) {
    return url == uri || url.startsWith(uri + '?');
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
