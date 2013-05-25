/**
 * @author: Karthik VJ
 **/

var RequestData = (function() {
    "use strict";

    /**
     * RequestData
     * @constructor
     */
    function RequestData() {
        // default values
        this.types = "instrument=EIT:wavelength=171";
        this.resolution = 2;
        this.start = "";
        this.finish = "";
        /**
         * Nummber of Images, unfortunately string type
         * @type {string}
         */
        this.numImg = "";
        this.session = "1368516449_24443";
    }

    /**
     * Generates post data for NOAA server
     * @return {string}
     * @public
     */
    RequestData.prototype.generatePostData = function() {
        var data = "Collection=1&Types=" + encodeURIComponent(this.types) + "&Resolution=" + this.resolution + "&Display=List&Start=" + this.start + "&Finish=" + this.finish + "&NumImg=" + this.numImg + "&Submit=Search&Session=" + this.session + "&.cgifields=Display&.cgifields=Types";
        return data;
    };

    return RequestData;
}());

var NOAAServer = (function() {
    "use strict";

    var queryURL = "http://sohodata.nascom.nasa.gov/cgi-bin/data_query_search_movie",
        xhr,
        callbackRef,
        onReadyState;

    /**
     * NOAAServer
     * @constructor
     */
    function NOAAServer() {
        console.log("NOAAServer");
    }

    /**
     * Sends request data to NOAA server
     * @param data
     * @param callback
     * @public
     */
    NOAAServer.prototype.send = function(data, callback) {
        console.log("sending data.. " + data);
        callbackRef = callback;
        xhr = new XMLHttpRequest();
        xhr.open("POST", queryURL, true);
        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xhr.onreadystatechange = onReadyState;
        xhr.send(data);
    };

    /**
     * Invoked when XHR state is changed
     * @private
     */
    onReadyState = function() {
        console.log("state, " + xhr.readyState);
        console.log("status, " + xhr.status);

        if(xhr.readyState === 4) {
            if(xhr.status === 200) {
                // resposne data
                //console.log(xhr.responseText);
                var responseData = xhr.responseText,
                    pattern = /http:\/\/sohowww(.*?)jpg/g,
                    parsedData = responseData.match(pattern);

                if(parsedData) {
                    parsedData.reverse();
                }
                else
                {
                    callbackRef(MessageMap.NO_DATA);
                    return;
                }


                console.log(parsedData);
                if(callbackRef !== undefined) {
                    callbackRef(parsedData);
                }
            }
            else {
                // error
                if(callbackRef !== undefined) {
                    callbackRef(MessageMap.ERROR);
                }


            }
        }

    };

    return NOAAServer;

}());