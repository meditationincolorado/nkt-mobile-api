const AWS = require('aws-sdk')
AWS.config.update({
    region: 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})
const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
})

module.exports = {
    getMeditations: (req, res) => {
        s3.getObject({
            Bucket: 'nkt-mobile-app-content',
            Key: 'meditations/english_meditations.json',
        })
            .on('success', response => {
                const result = JSON.parse(response.data.Body.toString('utf-8'))
                res.send(result)
            })
            .on('error', response => {
                res.send({
                    'error': error
                })
            })
            .send()  
    }
}