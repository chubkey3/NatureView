import AWS from 'aws-sdk';

const spacesEndpoint = new AWS.Endpoint(process.env.BUCKET_ENDPOINT || "")

const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.ACCESS_SECRET_KEY
})

export default s3;