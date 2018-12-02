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

module.exports = {
    getAdvice: (req, res) => {
        s3.getObject({
            Bucket: 'nkt-mobile-app-content',
            Key: 'advice/good_advice.json',
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