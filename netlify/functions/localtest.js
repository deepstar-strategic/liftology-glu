const SEND_SMS = process.env.SEND_SMS
// const qs = require("qs")
// const querystring = require("querystring")

// const accountSID = process.env.TWILIO_ACCOUNT_SID
// const accountToken = process.env.TWILIO_ACCOUNT_TOKEN
// const twilioNumberFrom = process.env.TWILIO_SENDER_NUMBER

// const client = require("twilio")(accountSID, accountToken)
const MessagingResponse = require("twilio").twiml.MessagingResponse

const SGKEY = process.env.SENDGRID_API_KEY
const SGToEmail = process.env.SG_TO_EMAIL
const sgMail = require("@sendgrid/mail")

const HSKEY = process.env.HSKEY
const HSContacts = "https://api.hubapi.com/crm/v3/objects/contacts/search"

const fetch = require("node-fetch")

exports.handler = async function (event, context, callback) {
  //   try {
  //     const URI = JSON.parse(
  //       '{"' + event.body.replace(/&/g, '","').replace(/=/g, '":"') + '"}',
  //       function (key, value) {
  //         return key === "" ? value : decodeURIComponent(value)
  //       }
  //     )

  //     const originalSender = URI.From.replace("+61", "0")
  //     const originalBody = URI.Body.replace("+", " ")

  //     const SGMsg = {
  //       to: SGToEmail,
  //       from: SGToEmail,
  //       subject: "New SMS: " + originalSender,
  //       text: "New SMS from: " + originalSender + "\n\n\nBody:\n\n" + originalBody,
  //       html: "New SMS From: " + originalSender + "<br/><br/><br/>Body:<br/><br/>" + originalBody,
  //     }

  //     try {
  //       sgMail.setApiKey(SGKEY)

  //       sgMail
  //         .send(SGMsg)
  //         .then(() => {
  //           console.log("Email Sent")
  //         })
  //         .catch((error) => {
  //           console.error(error)
  //         })
  //     } catch (err) {
  //       console.log("couldn't send email")
  //     }

  //     try {
  //       const HSSearch = {
  //         filterGroups: [
  //           {
  //             filters: [
  //               {
  //                 propertyName: "mobilephone",
  //                 operator: "EQ",
  //                 value: originalSender,
  //               },
  //             ],
  //           },
  //         ],
  //       }

  //       fetch(HSContacts + "?hapikey=" + HSKEY, {
  //         method: "post",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(HSSearch),
  //       }).then(console.log(JSON.stringify(res)))
  //     } catch (err) {
  //       console.log("couldn't find HS contact")
  //       console.log(err)
  //     }
  //   } catch (err) {
  //     console.log("There was an error")
  //     console.log(err)
  //   }

  /*
  try {
    const twiml = new MessagingResponse()
    await twiml.message(
      "Hello, thank you for replying. Sadly, this number is not monitored. Please SMS 0423233845 directly. Thank you :) STOP to opt out"
    )

    return callback(null, { statusCode: 200, contentType: "text/xml", body: twiml.toString() })
  } catch (err) {
    return callback(null, { statusCode: 500 })
  }

*/

  // try {
  //   console.log("json stringify event.querystring")
  //   console.log(JSON.stringify(event.queryStringParameters))
  // } catch (err) {
  //   console.log("couldn't console log JSON event querystring")
  //   console.log("this is an error")
  // }

  // try {
  //   console.log("event.querystring")
  //   console.log(event.queryStringParameters)
  // } catch (err) {
  //   console.log("couldn't console log event querystring")
  //   console.log("this is an error")
  // }

  // try {
  //   console.log("json stringify console")
  //   console.log(JSON.stringify(context))
  // } catch (err) {
  //   console.log("couldn't console log JSON context")
  //   console.log("this is an error")
  // }

  return callback(null, {
    statusCode: 200,
    contentType: "text/html",
    body: "<html><head><title>" + SEND_SMS + "</title></head><body>ok computer</body></html>",
  })
}
