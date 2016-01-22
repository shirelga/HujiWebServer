/**
 * Created by imri choen and shirel gazit on 12/29/15.
 */


    //it should have the following properties. set(), status(), get() ,
// cookie(), send() and json() .
var DBG = 0;

//set(), status(), get() , cookie(), send() and json()
var Response = function (socket){
                var _this = this;
                var stat = new Map();
                stat.set("HTTP/1.1" , 200);
                var header = new Map();
                var cookies = new Map();
                /*
                 Sets the response’s HTTP header field to value. To set multiple fields at once, pass an object as the
                 parameter.
                 */
                this.set = function (field, value)
                {
                      if(value) {
                          header.set(field, value);
                      }
                      else
                      {
                          for(var prop in field)
                          {
                              header.set(prop, field[prop].toString());
                          }
                      }
                }
                /*
                Use this method to set the HTTP status for the response.
                e.g 200, 404...
                 */
                this.status = function (code) {
                    stat.clear();
                    stat.set("HTTP/1.1", code);
                    return this;
                };
                /*
                Returns the HTTP response header specified by field. The match is case-insensitive
                 */
                this.get = function (field) {
                    return header.get(field);
                }
                /*
                 Sets cookie name to value. The value parameter may be a string or object converted to JSON.
                 */
                this.cookie = function (name, value, options) {
                    cookies.set(name,{value:value, options:options});
                };
                /*
                 Sends the HTTP response.
                 */
                this.send = function (body) {
                    if(body)
                    {
                        if(Buffer.isBuffer(body) || typeof body === 'string')
                        {
                            sendHelper(body);
                            socket.write(body);
                        }
                        else
                        {
                            sendHelper(JSON.stringify(body));
                            socket.write(JSON.stringify(body));
                        }

                    }
                    else
                    {
                        sendHelper();
                    }
                    if(DBG)
                    {
                        console.log("body: ", body.toString());
                    }
                };
                /*
                 Sends a JSON response. This method is identical to res.send() with an object or array as the parameter.
                 */
                this.json = function (body) {
                    sendHelper(JSON.stringify(body))
                    socket.write(JSON.stringify(body));
                };

                function sendHelper(body)
                {
                    if(header.get("Content-Length") == undefined)
                    {
                        if(body)
                        {
                            _this.set("Content-Length", body.length);
                        }
                        else
                        {
                            _this.set("Content-Length", "0");

                        }
                    }
                    var status = '';
                    var head = '';
                    var cookie = '';
                    for(var key of stat.keys())
                    {
                        status += key + " " + stat.get(key) + "\r\n";
                    }

                    for(var key of header.keys())
                    {
                        head += key + ": " + header.get(key) + "\r\n";
                    }


                    if(cookies.size != 0)
                    {
                        cookie = 'Set-Cookie: '
                    }
                    for(var key of cookies.keys())
                    {
                        var value = cookies.get(key);
                        cookie += key + "=" + value.value;
                        for(var option in value.options)
                        {
                            cookie += ";" +  + value.options[option];
                        }
                        cookie += "\r\n";
                    }
                    socket.write(status);
                    socket.write(head);
                    socket.write(cookie);
                    socket.write("\r\n");

                    if(DBG)
                    {
                        //console.log("status: ", stat);
                        //console.log("header: ", header);
                        //console.log("cookies: ", cookies);
                        console.log("head: ", status + head + cookie);
                    }


                }
};


exports.Response = Response;