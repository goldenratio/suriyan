/**
 * @author: Karthik VJ
 **/

var RequestData = (function()
{
    "use strict";

    /**
     * RequestData
     * @constructor
     */
    function RequestData()
    {
        // default values
        this.types = "instrument=EIT:wavelength=171";
        this.resolution = 2;
        this.start = "";
        this.finish = "";
        this.numImg = 1;
        this.session = "1368516449_24443";
    }

    RequestData.prototype.generatePostData = function()
    {
        var data = "Collection=1&Types="+encodeURIComponent(this.types)+"&Resolution="+this.resolution+"&Display=List&Start="+this.start+"&Finish="+this.finish+"&NumImg="+this.numImg+"&Submit=Search&Session="+this.session+"&.cgifields=Display&.cgifields=Types";
        return data;
    }

    return RequestData;
}());

var NOAAServer = (function()
{
    "use strict";

    var queryURL = "http://sohodata.nascom.nasa.gov/cgi-bin/data_query_search_movie",
        xhr,
        callbackRef;

    /**
     * NOAAServer
     * @constructor
     */
    function NOAAServer()
    {

    }

    NOAAServer.prototype.send = function(data, callback)
    {
        console.log("sending data.. " + data);
        callbackRef = callback;
        xhr = new XMLHttpRequest();
        xhr.open("POST", queryURL, true);
        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xhr.onreadystatechange = onReadyState;
        xhr.send(data);
    };

    var onReadyState = function()
    {
        console.log("state, " + xhr.readyState);
        console.log("status, " + xhr.status);

        if(xhr.readyState == 4)
        {
            if(xhr.status == 200)
            {
                // resposne data
                //console.log(xhr.responseText);
                var responseData = xhr.responseText;
                var pattern = /http:\/\/sohowww(.*?)jpg/g;
                var parsedData = responseData.match(pattern);

                parsedData.reverse();

                console.log(parsedData);
                if(callbackRef != undefined)
                    callbackRef(parsedData);
            }
            else
            {
                // error
                if(callbackRef != undefined)
                    callbackRef(MessageMap.ERROR);

            }
        }

    };

    return NOAAServer;

}());