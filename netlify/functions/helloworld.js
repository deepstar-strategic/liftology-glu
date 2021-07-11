const accountSID = process.env.TWILIO_ACCOUNT_SID
const accountToken = process.env.TWILIO_ACCOUNT_TOKEN
const twilioNumberFrom = process.env.TWILIO_SENDER_NUMBER

const client = require("twilio")(accountSID, accountToken)

exports.handler = async function () {
  try {
    await client.messages
      .create({
        body: "this is a test sms from netlify functions",
        from: twilioNumberFrom,
        to: "+61404021740",
      })
      .then((message) => {
        console.log("SUCCESS: " + message.sid)
        return {
          statusCode: 200,
          body: message.sid,
        }
      })
  } catch (err) {
    console.log("FAILURE: " + err)
    return { statusCode: 200, body: "FAILED.  Err: " + err }
  }
  //   return {
  //     statusCode: 200,
  //     body:
  //       "accountSID = " +
  //       accountSID +
  //       " -- accountToken = " +
  //       accountToken +
  //       " -- twilioNumberFrom = " +
  //       twilioNumberFrom +
  //       " ---- message: " +
  //       message.sid,
  //   }
}
