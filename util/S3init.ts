import { S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
    endpoint: 'https://' + process.env.BUCKET_ENDPOINT,
    region: process.env.BUCKET_REGION,    
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID || "",
        secretAccessKey: process.env.ACCESS_SECRET_KEY || ""
    }
})

export default s3