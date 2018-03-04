var express = require('express')
var bodyParser = require('body-parser')
var recastai = require('recastai')
const request = require('request');
const locale = 'en';
const recastAIRequestToken = "efa320826368b2c3b53bc418beed2f4a"; 

const httpProxy = "https://8ae37f7e.ngrok.io";

const connect = new recastai.connect(recastAIRequestToken)
const client = new recastai.request(recastAIRequestToken, locale);
let currentMessage = {};
var app = express()

/* Server setup */
app.set('port', 5000)
app.use(bodyParser.json())
app.post('/', function(req, res) {
  connect.handleMessage(req, res, onMessage)
})

function sendReply(type, text) {
	currentMessage.addReply([{ type: type, content: text }])
	currentMessage.reply().then(res => console.log('message sent'))
}

function onMessage (message) {
	var content = message.content
	currentMessage = message;
	console.log(content);
	client.analyseText(content)
	.then(onRecastAIReply.bind(this))
	.catch((e) => {
		sendReply("text", "Error while processing your request...please retry");
	})
}

function onRecastAIReply(aiResponse) {
	const intent = aiResponse.intent();
	console.log(JSON.stringify(aiResponse));

	if (!intent) {
		sendReply("text", "I did not get your intent...please retry");
		return;
	}

	switch(intent.slug) {
		case "discover-movies":
			const payload = prepareMovieRequest(aiResponse);
			console.log(httpProxy + '/' + intent.slug + '/');
			const options = {
				uri: httpProxy + '/' + intent.slug + '/',
				method: 'POST',
				json: payload
			};
			request.post(options, (err, httpResponse, body) => {
				console.log(body);
				if (err) {
					return console.error('request failed:', err);
				}
				currentMessage.addReply(body)
				currentMessage.reply()
				.then(res => console.log('message sent'))
				.catch((e) => console.log(e) )
			});
		break;
		case "greetings":
			sendReply("text", "Hi");
		break;
		case "goodbye":
			sendReply("text", "Bye");
		break;
	}
}

function prepareMovieRequest(aiResponse) {
	const nationality = aiResponse.entities.nationality ? aiResponse.entities.nationality[0].short : "";
	const genre = aiResponse.entities.genre ? aiResponse.entities.genre[0].value : "";
	const person = aiResponse.entities.person ? aiResponse.entities.person[0].fullname : "";

	const movieRequest = {
		"genre" : genre,
		"title": "",
		"language": nationality,
		"director": person,
		"actor": person
	}
	return movieRequest;
}

app.listen(app.get('port'), function () { console.log('App is listening on port ' + app.get('port')) })