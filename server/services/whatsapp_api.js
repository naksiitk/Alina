// Read Running outside of Nodejs to see support for other engines
const { WhatsAppAPI, Handlers, Types } = require("whatsapp-api-js");
const { Text, Media, Contacts } = Types;

const Token = "EAAxJnwV6MHsBAHOvozOspcIZAwxZBmnnvgOSjPZA5Euzmxa8o1eeCOJTJfTgBXro5iEMotPCAjXZBUgpwAXbNGeuxQfYBLZBZA9d3JUUZCZBhSwFVBVLR85OTQsaEbud98vovwGXwRRrYwhZACeHCU16E3q3JcGPp0Ng8LDBFFZAmWGXM7CZBWaVOs2";

const Whatsapp = new WhatsAppAPI(Token);

// Assuming post is called on a POST request to your server
function post(e) {
    // The Handlers work with any middleware, as long as you pass the correct data
    return Handlers.post(JSON.parse(e.data), onMessage);
}

async function onMessage(phoneID, phone, message, name, raw_data) {
    console.log(`User ${phone} (${name}) sent to bot ${phoneID} ${JSON.stringify(message)}`);

    let promise;

    if (message.type === "text") promise = Whatsapp.sendMessage(phoneID, phone, new Text(`*${name}* said:\n\n${message.text.body}`), message.id);

    // if (message.type === "document") promise = Whatsapp.sendMessage(phoneID, phone, new Media.Document(message.document.id, true, undefined, "Our document"));

    console.log(await promise ?? "There are more types of messages, such as locations, templates, interactives, reactions and all the other media types.");
    
    Whatsapp.markAsRead(phoneID, message.id);
}

Whatsapp.logSentMessages((phoneID, phone, message, raw_data) => {
    console.log(`Bot ${phoneID} sent to user ${phone} ${JSON.stringify(message)}\n\n${JSON.stringify(raw_data)}`);
});