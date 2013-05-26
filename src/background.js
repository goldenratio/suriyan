/**
 * @author: Karthik VJ
 */

var windowID = -1;

var createData = {};
createData.url = "index.html";
createData.width = 800;
createData.height = 800;
createData.type = "popup";

chrome.browserAction.onClicked.addListener(function(tab) {

    //console.log("windowID, " + windowID);

    if(windowID === -1) {
       launchViewer();
    }
    else {

        chrome.windows.get(windowID, function(window){
            //console.log(window);
            if(window === undefined) {
                launchViewer();
            }
            else {
                switchViewer();
            }
        });

    }

});

chrome.windows.onRemoved.addListener(onWindowClose);

function onWindowClose(id)
{
    if(id === windowID) {
        windowID = -1;
    }
}

function launchViewer()
{
    chrome.windows.create(createData, function() {
        //console.log("done");
    });
}

function switchViewer()
{
    chrome.windows.update(windowID, {focused: true}, function(){
        //console.log("switch done");
    });
}

function updateWindowID(id)
{
    //console.log("new window id, " + id);
    windowID = id;
}