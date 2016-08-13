
chrome.storage.sync.get(null, function(data) {
    console.log(data);
    showStorage(data);
});
