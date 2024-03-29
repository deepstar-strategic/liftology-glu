// const SEND_SMS = process.env.SEND_SMS
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
const HSContacts = "https://api.hubapi.com/crm/v3/objects/contacts/search?hapikey="
const HSEngagements = "https://api.hubapi.com/engagements/v1/engagements?hapikey="

const fetch = require("node-fetch")

exports.handler = async function (event, context, callback) {
  // console.log("==event==")
  // console.log(event)
  // console.log("==event==")
  try {
    const URI = JSON.parse(
      '{"' + event.body.replace(/&/g, '","').replace(/=/g, '":"') + '"}',
      function (key, value) {
        return key === "" ? value : decodeURIComponent(value)
      }
    )

    const originalSender = URI.From.replace("+61", "0")
    const originalBody = URI.Body.replace("+", " ")

    try {
      const HSSearch = {
        filterGroups: [
          {
            filters: [
              {
                propertyName: "mobilephone",
                operator: "EQ",
                value: originalSender,
              },
            ],
          },
        ],
      }

      // console.log("==HSSearch==")
      // console.log(JSON.stringify(HSSearch))
      // console.log("==HSSearch==")

      // console.log("==HSKEY==")
      // console.log(HSKEY)
      // console.log("==HSKEY==")

      // console.log("==URL + HSKEY==")
      // console.log(HSContacts + HSKEY)
      // console.log("==URL + HSKEY==")

      const resHSContacts = await fetch(HSContacts + HSKEY, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(HSSearch),
      })

      const dataHSContacts = await resHSContacts.json()

      // console.log("==fetch==")
      // console.log(JSON.stringify(resHSContacts))
      // console.log("==fetch==")

      // console.log("==data==")
      // console.log(JSON.stringify(dataHSContacts))
      // console.log("==data==")

      if (dataHSContacts.total > 0) {
        const contactId = dataHSContacts.results[0].id
        // console.log("==contactId==")
        // console.log(contactId)
        // console.log("==contactId==")

        try {
          const HSEngagement = {
            engagement: {
              active: true,
              type: "NOTE",
            },
            associations: {
              contactIds: [contactId],
              companyIds: [],
              dealIds: [],
              ownerIds: [],
            },
            metadata: {
              body: "Inbound SMS: " + originalBody,
            },
          }

          const resHSEngagements = await fetch(HSEngagements + HSKEY, {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(HSEngagement),
          })

          const dataHSEngagement = await resHSEngagements.json()

          // console.log("==fetch==")
          // console.log(JSON.stringify(resHSEngagements))
          // console.log("==fetch==")

          // console.log("==data==")
          // console.log(JSON.stringify(dataHSEngagement))
          // console.log("==data==")
        } catch (err) {
          console.log("couldn't create engagement")
          console.log(err)
        }
      }
    } catch (err) {
      console.log("couldn't find HS contact")
      console.log(err)
    }

    try {
      const SGMsg = {
        to: SGToEmail,
        from: SGToEmail,
        subject: "New SMS: " + originalSender,
        text: "New SMS from: " + originalSender + "\n\n\nBody:\n\n" + originalBody,
        html: "New SMS From: " + originalSender + "<br/><br/><br/>Body:<br/><br/>" + originalBody,
      }

      sgMail.setApiKey(SGKEY)

      sgMail
        .send(SGMsg)
        .then(() => {
          console.log("Email Sent")
        })
        .catch((error) => {
          console.error(error)
        })
    } catch (err) {
      console.log("couldn't send email")
    }

    try {
      const twiml = new MessagingResponse()
      await twiml.message(
        "Hello, thank you for replying. Sadly, this number is not monitored. Please SMS 0423233845 directly. Thank you :) STOP to opt out"
      )

      return callback(null, { statusCode: 200, contentType: "text/xml", body: twiml.toString() })
    } catch (err) {
      console.log(err)
      return callback(null, { statusCode: 500 })
    }
  } catch (err) {
    console.log("There was an error")
    console.log(err)
    return callback(null, { statusCode: 500 })
  }
}
