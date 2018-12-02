const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

const AWS = require('aws-sdk')
AWS.config.update({
    region: 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})
const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
})

const googleAPI = (req, res, token, credentials) => {
    // If modifying these scopes, delete token.json.
    const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
    // The file token.json stores the user's access and refresh tokens, and is
    // created automatically when the authorization flow completes for the first
    // time.
    const TOKEN_PATH = 'token.json';

    // Load client secrets from a local file.
    // fs.readFile('credentials.json', (err, content) => {
    //     if (err) return console.log('Error loading client secret file:', err);
    //     // Authorize a client with credentials, then call the Google Calendar API.
    //     authorize(JSON.parse(content), listEvents);
    // });
    authorize(listEvents);

    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */
    function authorize(callback) {
        const {client_secret, client_id, redirect_uris} = credentials;
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);

        // Check if we have previously stored a token.
        // fs.readFile(TOKEN_PATH, (err, token) => {
            // if (err) return getAccessToken(oAuth2Client, callback);
            // oAuth2Client.setCredentials(JSON.parse(token));
            // callback(oAuth2Client);
        // });
        oAuth2Client.setCredentials(token);
        callback(oAuth2Client);
    }

    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
     * @param {getEventsCallback} callback The callback for the authorized client.
     */
    function getAccessToken(oAuth2Client, callback) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        console.log('Authorize this app by visiting this url:', authUrl);
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question('Enter the code from that page here: ', (code) => {
            rl.close();
            oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
            console.log('Callback (listEvents)');
            console.log(listEvents(oAuth2Client));
            });
        });
    }

    /**
     * Lists the next 10 events on the user's primary calendar.
     * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
     */
    function listEvents(auth) {
        const calendar = google.calendar({version: 'v3', auth});
        calendar.events.list({
            calendarId: 'primary',
            timeMin: (new Date()).toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime',
        }, (err, response) => {
            if (err) return console.log('The API returned an error: ' + err);
            const events = response.data.items;
            if (events.length) {
                res.send(events);
            } else {
                res.send({ 'error': 'No upcoming events found.'});
            }
        });
    }
}

module.exports = {
    getClasses: (req, res) => {
        // const key = `google-calendar-api/${country}/${region}/${city}/token.json`

        s3.getObject({
            Bucket: 'mobile-app-credentials',
            Key: 'google-calendar-api/united-states/colorado/denver/credentials.json',
        })
            .on('success', response => {
                const result = JSON.parse(response.data.Body.toString('utf-8')),
                    token = result.token,
                    credentials = result.installed

                googleAPI(req, res, token, credentials)
            })
            .on('error', response => {
                res.send({
                    'error': error
                })
            })
            .send()  
    }
}