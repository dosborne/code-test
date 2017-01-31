# code-test
code test

#Duty Hours Application#

This application is a SPA built using reactjs.  It is divided up into a few different layers.  The entry point for the application
is entry.js and is very simple.  It basically loads up the router.  The router handles the all of the component loading based on URL hashes.
The components themselves are for the most part very simple and include only view related code.  They communicate with the data layer using
events.  The data layer consist of repos that interface with hardcoded data.  In a real application this would be replaced with REST API
calls and ideally a good framework for handling this such as backbone's models.

There is no backend for this application.  Ideally nodejs could be used with express and mongoose with mongo for a very simple backend.
Then the data layer/repos that I built on the front end could easy be adjusted to make REST API calls to interface with the backend.  Also,
some of the business logic could be moved to the backend.  This would make the API more useful to different clients.

There is no testing for this application.  Ideally mocha, chai, and sinon could be used as a good testing stack.

Another thing to note is that there is no login, but I coded a "simulated" user context by providing a drop down to allow the user to act
as specific users.

The front end code is written using JSX and ES6 so it has to be compiled.  I have setup scripts that do all of this and are available in
the package.json and can be ran with npm.

* npm run compile - this compiles the JSX and ES6 code *
* npm run browserify - this takes the compiled code and makes it browser ready *

To run both use:

* npm run compile && npm run browserify *

The compiled and bundled code is written to a compiled directory.  This is where the index.html file looks for the bundle.js.

Steps to run:
* 1.  Clone repo *
* 2.  Run npm install *
* 3.  Run npm run compile && npm run browserify *
* 4.  Open index.html in a browser or copy entire project to a webserver and access index.html. *
