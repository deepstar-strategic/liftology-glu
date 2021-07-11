const qs = require("qs")
const querystring = require("querystring")

const accountSID = process.env.TWILIO_ACCOUNT_SID
const accountToken = process.env.TWILIO_ACCOUNT_TOKEN
const twilioNumberFrom = process.env.TWILIO_SENDER_NUMBER

const client = require("twilio")(accountSID, accountToken)
const MessagingResponse = require("twilio").twiml.MessagingResponse

exports.handler = async function (event, context, callback) {
  try {
    const twiml = new MessagingResponse()
    await twiml.message(
      "Hello, thank you for replying. Sadly, this number is not monitored. Please SMS 0423233845 directly. Thank you :) "
    )

    // console.log("twiml: " + JSON.stringify(twiml))
    /* await client.messages
        .create({
          body: "New SMS from " + twiml. this is a test sms from netlify functions",
          from: twilioNumberFrom,
          to: "+61404021740",


    )*/
    return callback(null, { statusCode: 200, contentType: "text/xml", body: twiml.toString() })
  } catch (err) {
    return callback(null, { statusCode: 500 })
  }
  //   try {
  // const P_ID = event.queryStringParameters.id
  //   } catch (err) {
  // return callback(null, {
  //   statusCode: 400,
  //   body: "event method: " + event.httpMethod + " failure:" + err,
  // })
  //   }

  //   if (P_ID) {
  //     return callback(null, {
  //       statusCode: 200,
  //       body:
  //         "event method: " +
  //         event.httpMethod +
  //         " non JSON BIT: " +
  //         P_ID +
  //         " JSON BIT: " +
  //         JSON.stringify(P_ID),
  //     })
  //   }

  //   return callback(null, {
  //     statusCode: 200,
  //     body: "queryStringParameters: " + JSON.stringify(event.queryStringParameters),
  //   })
}
