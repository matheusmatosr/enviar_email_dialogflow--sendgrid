'use strict';

const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey("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");

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
// process.env.SENDGRID_API_KEY = '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';

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  function enviarEmailAgora(agent) {
    const name = agent.parameters.name;
    const msg = {
      	to: "matbolado198@gmail.com",
     	from: "matheusmatosrodrigues27@gmail.com",   
      	templateId:"d-9cf13e8efa3e456597451452c5a490c9",
        subject: "Novo usuário querendo entrar em contato no WhatsApp",  // assunto
      	text: "Wpp",
        html: name + "<p> está querendo entrar em contato conosco no WhatsApp! </p>"
    };
    sgMail
  		.send(msg)
  		.then(() => {
   			console.log('Email sent');
  		})
  		.catch((error) => {
    		console.error(error);
  		});
    
    agent.add(`Que bonito, obrigado`);
   
  }
    
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('enviar', enviarEmailAgora);
  agent.handleRequest(intentMap);
  
});