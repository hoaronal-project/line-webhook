const https = require("https")
const express = require("express")
const app = express()
const PORT = process.env.PORT || 5000
const TOKEN = '8Ye8SoOEpDMK0eWuxgCHAwgE5nO2oygOxcXXSAA3V/2cQ58sce/3EupzsP53aen432XbXqDWO0OHGQLUC54HIvW0jLp1LoxPS36khBMxdDrCtVgUL+gKzqF9JPwwYtVYdoFj0mNsexsBbC0PpHt9oAdB04t89/1O/w1cDnyilFU='

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

app.get("/", (req, res) => {
    res.status(200).json({
        status: 'DONE',
        message: 'Test webhook'
    });
})

app.post("/webhook", function (req, res) {
    res.send("HTTP POST request sent to the webhook URL!")
    // If the user sends a message to your bot, send a reply message
    if (req.body.events[0].type === "message") {
        const dataString = JSON.stringify({
            replyToken: req.body.events[0].replyToken,
            messages: [
                {
                    "type": "text",
                    "text": "Hello, user"
                },
                {
                    "type": "text",
                    "text": "May I help you?"
                }
            ]
        })

        // Request header
        const headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + TOKEN
        }

        // Options to pass into the request
        const webhookOptions = {
            "hostname": "api.line.me",
            "path": "/v2/bot/message/reply",
            "method": "POST",
            "headers": headers,
            "body": dataString
        }

        // Define request
        const request = https.request(webhookOptions, (res) => {
            res.on("data", (d) => {
                process.stdout.write(d)
            })
        })

        // Handle error
        request.on("error", (err) => {
            console.error(err)
        })

        // Send data
        request.write(dataString)
        request.end()
    }
})

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
})
