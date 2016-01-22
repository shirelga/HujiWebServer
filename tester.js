var http = require("http");
var hujiwebserver = require("./hujiwebserver.js");


function options()  {  
  return {
    hostname: 'localhost',
    port: null,
    path: '',
    method: '',
    headers: {}
  }
}



//######################################PARAMS TEST#####################################//

function test1(){
	var opt = options();
	opt.path ="/params/checkA/argument/checkB/test/checkC";
	opt.method = "GET";
	opt.port = 8001

	var server = hujiwebserver.start(8001, function(err) {
	    // check if there were errors in revivng the server
    	    if (err) {
        	console.log("test failed : could not revive server " + err);
        	return;
            }
	});
		server.use('/params/:A/argument/:B/test/:C',function(request,response,next){
			var params = request.params;
			console.log("############PARAMS TEST###########\n");
			if (params.A == undefined || params.B == undefined|| params.C == undefined
				|| params.A != "checkA" || params.B != "checkB"|| params.C != "checkC"){
				console.log("Test faild\n" );
			}
			else{
				console.log("            TEST PASSED\n");
			}
			response.status(200).send(JSON.stringify(params));
		});
		setTimeout(function() {server.stop();},1000);
	var req = http.request(opt, function(res) {
	    var body = '';

	    res.setEncoding('utf8');
	    res.on('data', function (chunk) {
	        body += chunk;
	    });
	});
	req.on('error', function(e) {
	    console.log('problem with request: ' + e.message);
	});
	req.end();

}




//######################################QUERY TEST######################################//

function test2(){
	var opt = options();
	opt.path ="/query?checkA=A&checkB=B&checkC=C";
	opt.method = "GET";
	opt.port = 8002;

	var server = hujiwebserver.start(8002, function(err) {
	    // check if there were errors in revivng the server
    	    if (err) {
        	console.log("test failed : could not revive server " + err);
        	return;
            }
	});
		server.use('/query',function(request,response,next){
			var query = request.query;
			console.log("############QUERY TEST############\n");
			if (query.checkA == undefined || query.checkB == undefined || query.checkC == undefined||
				query.checkA != "A" || query.checkB != "B" || query.checkC != "C" ){
				console.log("Test faild\n" );
			}
			else{
				console.log("            TEST PASSED\n");
			}
			response.status(200).send(JSON.stringify(query))
		});
		setTimeout(function() {server.stop();},1000);



	var req = http.request(opt, function(res) {
	    var body = '';

	    res.setEncoding('utf8');
	    res.on('data', function (chunk) {
	        body += chunk;
	    });
	});
	req.on('error', function(e) {
	    console.log('problem with request: ' + e.message);
	});
	req.end();
}




//######################################MATCH TEST######################################//




function test3(){
	var server = hujiwebserver.start(8004, function(err) {
		// check if there were errors in revivng the server
		if (err) {
			console.log("test failed : could not revive server " + err);
			return;
		}
	});
	server.use('/a/:t/a/a',function(request,response,next){
		console.log("Test faild1\n" );
	});

	server.use('/:t/a/b/c/:any',function(request,response,next){
		console.log("Test faild2\n" );
	});

	server.use('/a/b/:t/a/a',function(request,response,next){
		console.log("Test faild3\n" );
	});


	server.use('/a/:any/c/d',function(request,response,next){
		console.log("            TEST PASSED\n");
		response.status(200).send("test matching");
	});

	setTimeout(function() {server.stop();},1000);

	var opt = options();
	opt.path = "/a/b/c/d/e/f?match=test";
	opt.method = "Post";
	opt.port = 8004
	var body =''
	console.log("############MATCH TEST############\n");
	var req = http.request(opt, function(res) {
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			body += chunk
		});
	});
	req.on('error', function(e) {
		console.log('problem with request: ' + e.message);
	});
	req.end();
}


//######################################NEXT TEST######################################//

function test4(){
	var cur = "";
	var server = hujiwebserver.start(8004, function(err) {
	    // check if there were errors in revivng the server
    	    if (err) {
        	console.log("test failed : could not revive server " + err);
        	return;
            }
	});
		server.use('/testers/test/next',function(request,response,next){
			cur+="T"
			next();
		});

		server.use('/testers/test/next',function(request,response,next){
			cur+="E"
			next();
		});

		server.use('/testers/test/next',function(request,response,next){
			cur+="S"
			next();

		});

		 
		server.use('/testers/test/next',function(request,response,next){
			cur+="T"
			next();


		});

	server.use('/testers/test/next',function(request,response,next){
		cur+=" "
		next();


	});
	server.use('/testers/test/next',function(request,response,next){
		cur+="P"
		next();


	});

	server.use('/testers/test/next',function(request,response,next){
		cur+="A"
		next();


	});

	server.use('/testers/test/next',function(request,response,next){
		cur+="S"
		next();


	});

	server.use('/testers/test/next',function(request,response,next){
		cur+="S"
		next();


	});
	server.use('/testers/test/next',function(request,response,next){
		cur+="E"
		next();


	});

	server.use('/testers/test/next',function(request,response,next){
		cur+="D"
		response.status(200).send("test next");



	});

	server.use('/testers/test/next',function(request,response,next){
		cur+="T"
		next();


	});

	server.use('/testers/test/next',function(request,response,next){
		cur+=" "
		next();

	});

	server.use('/testers/test/next',function(request,response,next){
		cur+="N"
		next();

	});
	server.use('/testers/test/next',function(request,response,next){
		cur+="O"
		next();

	});
	server.use('/testers/test/next',function(request,response,next){
		cur+="T"
		return;
	});
                setTimeout(function() {server.stop();},1000);
		
		
		var opt = options();
		opt.path = "/testers/test/next";
		opt.method = "GET";
		opt.port = 8004
		var body =''
		console.log("############NEXT TEST#############\n");

    var req = http.request(opt, function(res) {

		    res.setEncoding('utf8');
		    res.on('data', function (chunk) {
		    	body += chunk
		    });
		});
		req.on('error', function(e) {
		    console.log('problem with request: ' + e.message);
		});
		req.end();
		setTimeout(function(){
			if (cur != "TEST PASSED"){
				console.log("Test faild" );
			}
			else{
                console.log("            TEST PASSED\n");
			}

			console.log("############TEST END##############");
        },1000);
		//server.myu


}
test1();
setTimeout(function(){test2();},1000);
setTimeout(function(){test3();},2000);
setTimeout(function(){test4();},5000);

