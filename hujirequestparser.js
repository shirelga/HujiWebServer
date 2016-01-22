/**
 * Created by imri choen and shirel gazit on 12/22/15.
 */

/**
 * Parse the http request from the server
 * @param string the request
 * @returns {{header: null, url: null, http: null, connection: null, contentLen: null, ver: null, fileType: null}}
 */
var url = require('url');

function parse(string) {

    var fileTypes = {
        "js" : "application/javascript",
        "tx" : "text/plain",
        "html" : "text/html",
        "css" : "text/css",
        "jpg" : "image/jpeg",
        "gif" : "image/gif",
        "json" : "application/json"
    };

    //it should have the following properties. params, query,
    // method, cookies, path, host, protocol, get(), param() and is() . body
    // the description of each property can be found here:
    var HttpRequest =
    {
        contenttype: "",
        params: {},
        method: null,
        query: {},
        cookies: {},
        path: null,
        host: null,
        protocol: null,
        get: function (field) {
            return this.contenttype;
        },
        param: function (name) {
            if (HttpRequest.params[name] !== undefined) {
                return HttpRequest.params[name];
            }
            if (HttpRequest.query[name] !== undefined) {
                return HttpRequest.query[name];
            }
            //TODO return value?
            return null;
        },
        is: function (type) {
            //console.log("\n$$$$$$$$$"+type+"$$$$$$$$$\n");
            //console.log("\n$$$$$$$$$"+this.contenttype+"$$$$$$$$$\n");
            if (fileTypes[type] === this.contenttype) {

                return true;
            }
            if (type===this.contenttype){
                 return true;
                }
            return false;
        },
        body: null
    };

    var str = string.split(/\r\s*\n/);
    for (var ln in str) {

        if (/^(GET)|^(POST)|^(PUT)|^(DELETE)/.test(str[ln])) {
            //console.log("\npath:"+str[ln]);
            request(str[ln], HttpRequest);
        }

        if (/^(Host:)/.test(str[ln])) {

            requestHost(str[ln], HttpRequest)
        }

        if (/^(Connection:)/.test(str[ln])) {
            requestConnection(str[ln], HttpRequest)
        }
        if (/^(Content-Length:)/.test(str[ln])) {
            HttpRequest.contentLen = parseInt(str[ln].split(/\s/)[1]);
        }

        if (/^(Content-Type:)/.test(str[ln])) {

            tmp1 = str[ln].split(':')[1];
            tmp2 = tmp1.split(';')[0];
            tmp3 = tmp2.substr(1);
            HttpRequest.contenttype = (tmp3);
        }

        if (/^(Cookie:)/.test(str[ln])) {
            requestCookies(str[ln],HttpRequest);
        }
    }
    //console.log(HttpRequest);

    return (HttpRequest);

};

    exports.parse = parse;

    /**
     * Parse the get request
     * @param str request lin
     * @param HttpReq HttpRequest obj
     */
    function request(str, HttpReq) {

        var curLine = str.split(/\s/)
        HttpReq.method = curLine[0];
        HttpReq.path = (curLine[1].split('?'))[0];
        //TODO: is it ok:
        HttpReq.query = url.parse(curLine[1],true).query;

        //TODO need to check http
        tmp = curLine[2];
        if(!(/^HTTP/.test(tmp)))
        {
            console.log("\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n")
            HttpReq.protocol = null;

        }
        else
        {
            HttpReq.protocol = "http";
        }




        //var temp =  curLine[1];
        //console.log(temp);
        //var parsUrl = url.parse(temp);
        //console.log();
        //console.log(parsUrl);


        //var req = str.split(/\s/);
        //var fileTypeLength;
        //HttpReq.header = req[0];
        //HttpReq.url = req[1];
        //HttpReq.http = req[2];
        //if(HttpReq.http === 'HTTP/1.0' || HttpReq.http === 'HTTP/1.1') {
        //    HttpReq.ver = (req[2].split(/\//)[1]).split(/\./)[1];
        //} else {
        //    HttpReq.http = null;
        //    HttpReq.ver = null;
        //}
        //fileTypeLength = HttpReq.url.split(/\./).length;
        //HttpReq.fileType = HttpReq.url.split(/\./)[fileTypeLength - 1];
    }

    /**
     * parse the Connection line, keep-alive/close
     * @param str the request lin
     * @param HttpReq HttpRequest obj
     */
    function requestConnection(str, HttpReq) {
        var req = str.split(/\s/);
        HttpReq.connection = req[1];
    }

    /**
     * parse the Host line.
     * @param str the request lin
     * @param HttpReq HttpRequest obj
     */


    function requestHost(str, HttpReq) {
        var req = str.split(/\s/);
        HttpReq.host = req[1];
    }

    function requestCookies(str, HttpReq) {
        var req1 = str.split(':');
        var req2 = req1[1]
        var req3 = req2.split(';');

        for (var ln in req3) {
            tmp = req3[ln].split('=')
            HttpReq.cookies[tmp[0].substr(1)] = tmp[1];

        }


    }

