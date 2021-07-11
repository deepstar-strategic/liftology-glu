// const qs = require("qs")
// const querystring = require("querystring")

// const accountSID = process.env.TWILIO_ACCOUNT_SID
// const accountToken = process.env.TWILIO_ACCOUNT_TOKEN
// const twilioNumberFrom = process.env.TWILIO_SENDER_NUMBER

// const client = require("twilio")(accountSID, accountToken)
const MessagingResponse = require("twilio").twiml.MessagingResponse

exports.handler = async function (event, context, callback) {
  /*
  try {
    const twiml = new MessagingResponse()
    await twiml.message(
      "Hello, thank you for replying. Sadly, this number is not monitored. Please SMS 0423233845 directly. Thank you :) "
    )

    return callback(null, { statusCode: 200, contentType: "text/xml", body: twiml.toString() })
  } catch (err) {
    return callback(null, { statusCode: 500 })
  }
*/

  try {
    console.log("json stringify event")
    console.log(JSON.stringify(event))
  } catch (err) {
    console.log("couldn't console log it")
  }
  return callback(null, {
    statusCode: 200,
    contentType: "text/html",
    body: "<html><head><title>ok</title></head><body>ok</body></html>",
  })
}
