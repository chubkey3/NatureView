import type { NextApiRequest, NextApiResponse } from 'next'
import s3 from '../init'
import { GetObjectOutput, GetObjectRequest } from 'aws-sdk/clients/s3'

type Data = {
    data: GetObjectOutput
}

type ErrorData = {
    message: string
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data | ErrorData>
  ) {
    if (req.method === "POST"){
        let params: GetObjectRequest = {
            Bucket: process.env.BUCKET_NAME || "",
            Key: "images/" + req.body.image
        }
      
        s3.getObject(params, function(err, data) {
            if (err) {
                if (!req.body.image){
                    res.status(400).json({message: 'Invalid or Missing File Name.'})                    
                } else if (err.code === 'NoSuchKey') {
                    res.status(404).json({message: 'File Not Found.'})               
                }
            } else {
                res.status(200).json({data: data})
            }
        })
    } else {
        res.status(400).json({message: 'Not POST Request.'})
    }
}


export const config = {
    api: {
        externalResolver: true
    }
}