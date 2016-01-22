********
Design
********

hujiwebserver.js  		the user server interface. This file interface exposes 
						the user the serverObj.

hujinet.js 				the main module exposes start function which 
						hujiwebserver calls to start the server. It also return
						the server object which was generate by net's 
						createServer method. This module handles the request by
						parsing it in hujirequestparser, check it in 
						hujirequest and response using hujiresponse.

hujirequestparser.js 	parse the request expose parse method to hujinet.

hujirequest.js			exposes parsing test method to hujinet where it checks
						the HttpRequest object validity.

hujiresponse.js			exposes two methods writeHeader and write to hujinet 
						this methods return callback in order to write a
						response to the client.

hujirequestparser.js	parse the request and initiate the request object.

hujiresponse.js			create the response object and implements its methods.

handles.js				the "handles" data structure and all the methods for its unique features.



*********
Fun part
*********
the fun part in this exercise was to make a complete server that can actually serve the "web developer" clients that will serve their own clients.
meaning to be the middle part between them.
it felt very conceptual at the beginning but become sensible and sharpened our grasp in express and node.js

*********
Hard part
*********
the hard part in this exercise was to understand the main rule of the server.
we where in the conception of ex3 and we didn't understand immediately
what your server should do and how and how it should do it.
it was also hard to build the parsing and to debug it in advance and not on the fly like in ex3.

