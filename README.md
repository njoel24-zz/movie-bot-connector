# movie-bot-connector

Simple node js express based server that accepts request from a connected chat (Facebook messenger) using recast API connect function,
sends the request to recast AI to get the user intent, if any, send a request to the movie-bot-server and return the result to the user.

# Install
npm install
node index.js
notes: use ngrok tu make your local server public


# Prerequisites
You need to create an account on RECAST, train your BOT, follow the guide to integrate it on Facebook messenger.

Basically, To integrate it on Facebook messenger:
- create a page
- create an application
- connect the page to the applcation and add messenger to the applcation
- configure the webhook 
- configure the BOT connector endpoint from recast
- chat with the bot


You need to have the movie-bot-server running on ngrok as well.
https://github.com/njoel24/movie-bot-server
