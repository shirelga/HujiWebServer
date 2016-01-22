/**
 * Created by shirelga on 1/16/16.
 */


var handles = new Map();
var currHandle;
var DBG = 0;


function setHandle(resource, requestHandler)
{
    if(handles.has(resource))
    {
        handles.get(resource).push(requestHandler);
    }
    else
    {
        handles.set(resource, new Array(requestHandler));
    }
}

function findHandle(req)
{
    if(DBG) {
        console.log(req.path);
    }
    var notFound = true;
    var handle;
    var path = req.path;
    req.params = {};
    var isEmpty = false;
    if(DBG)
    {
        console.log("url handel to find: " + path);
    }
    var i = 0;
    while(notFound) {
        handle = currHandle.next();
        if(DBG) {
            console.log("round: ", i);
            i++;
            console.log(handle);
        }
        if(handle.done)
        {
            notFound = false;
            return null;
        }
        var key = handle.key;
        if (path === key || key === "\/") {
            notFound = false;
        }
        else if (/:/.test(key)) {
            var hUrlParams = key.split("/");
            var urlParams = path.split("/");
            for (var par in hUrlParams) {
                if(DBG) {
                    console.log("param: ", isEmpty);
                    console.log("params check :" + par + "," + hUrlParams[par] + "," + urlParams[par]);
                }
                if (/:/.test(hUrlParams[par]) && urlParams.length > par) {
                    if(DBG) {
                        console.log("params check param:" + par + "," + hUrlParams[par] + "," + urlParams[par]);
                    }
                    req.params[hUrlParams[par].substr(1)] = urlParams[par];
                    isEmpty = true;
                }
                else if (hUrlParams[par] === urlParams[par]) {
                    if(DBG) {
                        console.log("params check equal:" + par + "," + hUrlParams[par] + "," + urlParams[par]);
                    }
                    isEmpty = true;
                }
                else
                {
                    isEmpty = false;
                    break;
                }
            }
            if(isEmpty)
            {
                if(DBG) {
                    console.log("param is not empty");
                }
                notFound = false;
            }
        }
        else
        {
            hUrlParams = key.split("/");
            urlParams = path.split("/");
            for (par in hUrlParams) {
                if(hUrlParams[par] !== urlParams[par])
                {
                    notFound = true;
                    break;
                }
                notFound = false;
            }
        }
    }
    if(DBG) {
        console.log("params generated: ", req.params);
        console.log("handle path:" + handle.key);
        console.log("[handle: " + handle.value + "]");
    }
    return handle.value;
}


function iterator(handle)
{
    var mapIt = handle.entries();
    var currObj = mapIt.next();
    var mapArrIdx = 0;

    return {
        next: function () {
            if(currObj.done)
            {
                return {done:true};
            }
            var key = currObj.value[0];
            var value = currObj.value[1];
            if(value.length > 1 && mapArrIdx < value.length)
            {
                return {key: key, value:value[mapArrIdx++], done:false};
            }
            else
            {
                key = currObj.value[0];
                value = currObj.value[1];
                var nextObj = {key: key, value:value[0], done:false}
                mapArrIdx = 0;
                currObj = mapIt.next();
                return nextObj;
            }
        }
    }
}

function next(req)
{
    var handle = findHandle(req);
    return handle;
}

function reset()
{
    currHandle = iterator(handles);
}

exports.findHandle = findHandle;
exports.setHandle = setHandle;
exports.next = next;
exports.reset = reset;