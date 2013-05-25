/**
 * @author: Karthik VJ
 */

chrome.browserAction.onClicked.addListener(function(tab) {

    var createData = {};
    createData.url = "index.html";
    createData.width = 800;
    createData.height = 800;
    createData.type = "popup";

    chrome.windows.create(createData, function() {
        console.log("done");
    });
});