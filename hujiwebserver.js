/**
 * Created by imiri cohen and shirel gazit on 12/22/15.
 */

var hujinet = require("./hujinet");
var fs = require("fs");
var path = require("path");

;/**
 * Server user start method, starts the server.
 * @param port the server port
 * @param rootFloder the server root folder
 * @param callBack(error)
 * @returns {{stop: serverObj.stop}} serverObj expose stop server method and have 2 private properties port and
 * rootFolder both are read only.
 */
var handles = require('./handles');
var serverObj;
function start(port, callBack) {
    var server = hujinet.start(port, callBack);
    serverObj = {
        stop: function () {
            server.close();
        },
        use: function (resource, requestHandler) {
            if (requestHandler)
            {
                handles.setHandle(resource, requestHandler);
            }
            else
            {
                requestHandler = resource;
                resource = '\/';
                handles.setHandle(resource, requestHandler);
            }
        }
    };
    Object.defineProperty(serverObj, "port", {value:port});

    callBack();
    return serverObj;
}

function static(rootFolder)
{
    return function (req, res, next) {
        if((/(\/\/)/).test(req.path))
        {
            res.status(404).send("Bad Request");
        }
        else {
            var slashIdx = req.path.substr(1).indexOf("/");
            var temp = '/';
            if(slashIdx !== -1)
            {
                temp = req.path.substr(slashIdx + 1);

            }
            var fd = path.join(rootFolder, temp);
            fs.readFile(fd, function(err, data)
            {
                if(err)
                {
                    next();
                } else {
                    res.set("Content-Type", fileTypes[path.extname(fd)]);
                    res.send(data);
                }
            });
        }
    }
}

var fileTypes = {
    ".js" : "application/javascript",
    ".tx" : "text/plain",
    ".html" : "text/html",
    ".css" : "text/css",
    ".jpg" : "image/jpeg",
    ".gif" : "image/gif",
    ".json" : "application/json"
};

function myUse() {
    function toString()
    {
        return this();

    }
    var reqHandle = function (req, res, next) {
        if(res) {
            res.send("Number of requests: " + hujinet.getStats().headerNum + "\r\n"
                + "Number of 404 error: " + hujinet.getStats().errorsNum["404"] + "\r\n"
                + "Number of 500 error: " + hujinet.getStats().errorsNum["500"] + "\r\n"
                + "Number of GET: " + hujinet.getStats().methodNum.GET + "\r\n"
                + "Number of POST: " + hujinet.getStats().methodNum.POST + "\r\n"
                + "Number of PUT: " + hujinet.getStats().methodNum.PUT + "\r\n"
                + "Number of DELETE: " + hujinet.getStats().methodNum.DELETE);
        }
        return "This requestHandler take no arguments.\r\nThe purpose of this use is to give some basic statistics of the server" +
            " usage\r\nIt give indication of:\r\n" +
            "The number of requests the server got, the number of errors from 404 and 500,and the number" +
            "of GET, POST, PUT and DELETE methods\r\n" +
            "Usage: hujiwebserver.use(route, hujiwebserver.myUse())";
    }
    reqHandle.toString = toString;

    return reqHandle;
}


exports.start = start;
exports.static = static;
exports.myUse = myUse;
