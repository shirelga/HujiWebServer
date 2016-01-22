/**
 * Created by imri choen and shirel gazit on 12/22/15.
 */
var path = require('path');
var net = require("net");
var hujirequestparser = require("./hujirequestparser");
var handles = require("./handles");
var hujiresponse = require("./hujiresponse");
var serverStat;
/**
 * start the server using net, and
 * implmenting partial http protocol
 * @param port the server port
 * @param rootFolder the server root folder
 * @param callback(error)
 * @returns {*} server obj
 */
function start(port, callback) {
    var server = net.createServer(function (socket, err) {
        if(err) {
            callback(err);
            return;
        }

        socket.setTimeout(2000);
        socket.setEncoding("utf8");
        var dataBuff = '';
        /**
         * parse http request and response to it.
         */
        socket.on("data", function (data, err) {
            dataBuff += data;
            if(err) {
                callback(err);
                return;
            }
            handles.reset();
            while(/(\r\n\r\n)/.test(dataBuff)) {
                serverStat.headerNum++;
                var spaceIdx = dataBuff.indexOf("\r\n\r\n");
                var parseData = dataBuff.substr(0, spaceIdx + "\r\n\r\n".length);
                dataBuff = dataBuff.substr(spaceIdx + "\r\n\r\n".length);
                var handleObj = new BuildHandle();
                handleObj.request = hujirequestparser.parse(parseData);

                serverStat.countMethod(handleObj.request.method);

                if (!ParsingTest(handleObj.request))
                {
                    serverStat.errorsNum["500"]++
                    handleObj.response.status(500).send("Bad request");
                }
                handleObj.response = new hujiresponse.Response(socket);
                var handle = handles.findHandle(handleObj.request);
                if(handle === null)
                {
                    handles.reset();
                    serverStat.errorsNum["404"]++
                    handleObj.response.status(404).send("Bad request");
                    dataBuff = dataBuff.substr(spaceIdx + "\r\n\r\n".length);
                }
                else {
                    if ((handleObj.request !== null) && (dataBuff.length >= handleObj.request.contentLen)) {
                        var tempBody = dataBuff.slice(0, handleObj.request.contentLen);
                        switch(handleObj.request.contenttype)
                        {
                            case "application/json":
                                try {
                                    tempBody = JSON.parse(tempBody.toString());
                                }
                                catch(e) {
                                    // Leave it as buffer.
                                }
                                break;
                            case "application/x-www-form-urlencoded":
                                var body = {};
                                var qs = tempBody.toString().split("&");
                                for (var i = 0; i < qs.length; i++) {
                                    var qss = qs[i].split("=", 2);
                                    if (qss.length == 2) {
                                        body[decodeURI(qss[0])] = decodeURI(qss[1]).replace("+", " ");
                                    }
                                }
                                tempBody = body;
                                break;
                        }
                        handleObj.request.body = tempBody;

                        dataBuff = dataBuff.slice(handleObj.request.contentLen);
                        handle(handleObj.request, handleObj.response, handleObj.next);
                    }
                    else {
                        handle(handleObj.request, handleObj.response, handleObj.next);
                        dataBuff = '';
                    }
                }
            }
        });

        socket.on("timeout",function () {
            socket.end();
        });

    }).listen(port);

    server.on("listening", function () {
        handles.reset();
        serverStat = new serverStats();
    });

    return (server);
}
function ParsingTest(req)
{
    if (req.protocol == null)
    {
    return false;
    }
    if (req.host == null)
    {
        return false;
    }
    if (req.path  == null)
    {
        return false;
    }

    return true;
}


function BuildHandle()
{
    var _this = this;
    this.request = {};
    this.response = {};
    this.next = function ()
    {
        var handle = handles.next(_this.request);
        if(handle !== null)
        {
            handle(_this.request, _this.response, _this.next);
        }
        else
        {
            serverStat.errorsNum["404"]++
            _this.response.status(404).send("The requested resource not found");
        }
    };
}

function serverStats()
{
    var _this = this;
    this.headerNum = 0;
    this.errorsNum = {"404": 0, "500": 0};
    this.reqMethodNum = {GET:0, POST:0, PUT:0, DELETE:0};
    this.countMethod = function (method)
    {
        switch (method)
        {
            case "GET":
                _this.reqMethodNum.GET++;
                break;
            case "POST":
                _this.reqMethodNum.POST++;
                break;
            case "PUT":
                _this.reqMethodNum.PUT++;
                break;
            case "DELETE":
                _this.reqMethodNum.DELETE++;
                break;
        }
    }
}

function getStats()
{
    return {headerNum: serverStat.headerNum, errorsNum: serverStat.errorsNum, methodNum: serverStat.reqMethodNum};
}

exports.start = start;
exports.getStats = getStats;


