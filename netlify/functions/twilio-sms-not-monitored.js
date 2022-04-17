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
// import fetch from "node-fetch"

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
    // const originalBody = URI.Body.replace("/\\+/g", "\\s")

    const searchString = "\\+"
    const searchReplaceExp = new RegExp(searchString, "g")
    const replaceWith = " "

    const originalBody = URI.Body.replace(searchReplaceExp, replaceWith)
    console.log("originalbody: " + originalBody)

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
      console.log(JSON.stringify(HSSearch))
      // console.log("==HSSearch==")

      // console.log("==HSKEY==")
      console.log(HSKEY)
      // console.log("==HSKEY==")

      // console.log("==URL + HSKEY==")
      console.log(HSContacts + HSKEY)
      // console.log("==URL + HSKEY==")

      const resHSContacts = await fetch(HSContacts + HSKEY, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(HSSearch),
      })

      const dataHSContacts = await resHSContacts.json()

      // console.log("==fetch==")
      console.log(JSON.stringify(resHSContacts))
      // console.log("==fetch==")

      // console.log("==data==")
      console.log(JSON.stringify(dataHSContacts))
      // console.log("==data==")

      if (dataHSContacts.total > 0) {
        const contactId = dataHSContacts.results[0].id
        const contactFName = dataHSContacts.results[0].firstname || "unknown"
        const contactLName = dataHSContacts.results[0].lastname || "unknown"
        const contactEmail = dataHSContacts.results[0].email || "unknown"
        console.log("fname: " + dataHSContacts.results[0].firstname)
        console.log("lname: " + dataHSContacts.results[0].lastname)
        console.log("email: " + dataHSContacts.results[0].email)
        // console.log("==contactId==")
        console.log(contactId)
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

          console.log("about to enter coach email try")
          try {
            console.log("setup email to coach")
            const SGMsg = {
              to: SGToEmail,
              from: SGToEmail,
              subject: "New SMS: " + originalSender + ": " + contactFName + " " + contactLName,
              text:
                "New SMS from: " +
                originalSender +
                "\n\n\nName: " +
                contactFName +
                " " +
                contactLName +
                "\n\nEmail: " +
                contactEmail +
                "\n\nHubspot Contact Record: https://app.hubspot.com/contacts/20057928/contact/" +
                dataHSContacts.results[0].id +
                "\n\n Body:\n\n" +
                originalBody,
              html:
                "New SMS From: " +
                originalSender +
                "<br/><br/>Name: " +
                contactFName +
                " " +
                contactLName +
                "<br/><br/>Email: " +
                contactEmail +
                '<br/><br/><a href="https://app.hubspot.com/contacts/20057928/contact/' +
                dataHSContacts.results[0].id +
                '">Hubspot Contact Record</a><br/><br/>' +
                "<br/><br/>Body:<br/><br/>" +
                originalBody,
            }

            console.log("SG: set api key")
            sgMail.setApiKey(SGKEY)

            console.log("SG: send mail")
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
        } catch (err) {
          console.log("couldn't create engagement")
          console.log(err)
        }
      }
    } catch (err) {
      console.log("couldn't find HS contact")
      console.log(err)
    }

    // try {
    //   switch (originalBody.toUpperCase()) {
    //     case "YES":
    //       try {
    //         const twiml = new MessagingResponse()
    //         await twiml.message(
    //           "Happy to help! To make it easy, simply book a time directly in our calendars at https://www.liftologyproject.com/clubbunker\nThanks, Mitch & Alex.\nSTOP to opt out"
    //         )

    //         return callback(null, {
    //           statusCode: 200,
    //           contentType: "text/xml",
    //           body: twiml.toString(),
    //         })
    //       } catch (err) {
    //         console.log("couldn't send next step sms")
    //         console.log(err)
    //         return callback(null, { statusCode: 500 })
    //       }
    //       break
    //     case "NO":
    //       try {
    //         const twiml = new MessagingResponse()
    //         await twiml.message(
    //           "No worries. If things change, always happy to chat. STOP to opt out"
    //         )
    //         return callback(null, {
    //           statusCode: 200,
    //           contentType: "text/xml",
    //           body: twiml.toString(),
    //         })
    //       } catch (err) {
    //         console.log(err)
    //         return callback(null, { statusCode: 500 })
    //       }
    //       break
    //     default:
    //       // try {
    //       //   const SGMsg = {
    //       //     to: SGToEmail,
    //       //     from: SGToEmail,
    //       //     subject: "New SMS: " + originalSender,
    //       //     text: "New SMS from: " + originalSender + "\n\n\nBody:\n\n" + originalBody,
    //       //     html:
    //       //       "New SMS From: " + originalSender + "<br/><br/><br/>Body:<br/><br/>" + originalBody,
    //       //   }

    //       //   sgMail.setApiKey(SGKEY)

    //       //   sgMail
    //       //     .send(SGMsg)
    //       //     .then(() => {
    //       //       console.log("Email Sent")
    //       //     })
    //       //     .catch((error) => {
    //       //       console.error(error)
    //       //     })
    //       // } catch (err) {
    //       //   console.log("couldn't send email")
    //       // }

    //       try {
    //         const twiml = new MessagingResponse()
    //         await twiml.message(
    //           "Hello, thank you for replying. Sadly, this number is not monitored. Please SMS 0423233845 directly. Thank you :) STOP to opt out"
    //         )

    //         return callback(null, {
    //           statusCode: 200,
    //           contentType: "text/xml",
    //           body: twiml.toString(),
    //         })
    //       } catch (err) {
    //         console.log(err)
    //         return callback(null, { statusCode: 500 })
    //       }
    //   }
    // } catch (err) {
    //   console.log("there was an error")
    //   console.log(err)
    //   return callback(null, { statusCode: 500 })
    // }

    // temp return twilio empty 200
    try {
      return callback(null, { statusCode: 200 })
    } catch (err) {
      console.log("there was an error")
      console.log(err)
    }
    //  end temp return twilio empty 200
  } catch (err) {
    console.log("There was an error")
    console.log(err)
    return callback(null, { statusCode: 500 })
  }
}
