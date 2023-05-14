import type { NextApiRequest, NextApiResponse } from 'next'
import s3 from '../init'
import { PutObjectRequest, PutObjectOutput } from 'aws-sdk/clients/s3'

type Data = string;

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
  ) {
    if (req.method === "POST"){
        var data = req.body.getAll("image");

        for (var i = 0; i<data.length; i++){
            let params: PutObjectRequest = {
                Body: data[i],
                Bucket: process.env.BUCKET_NAME || "",
                Key: 'images/' + data[i].name,
                ACL: 'public-read'
            }
        
            s3.putObject(params, function(err, data: PutObjectOutput){
                if (err){
                    console.log(err)
                    res.status(500).json("Internal Server Error.")
                } else {
                    console.log(data)
                    res.status(200).json("Uploaded!")
                }
            })
        }
        
    } else {
        res.status(400).json("Bad Request.")
    }
    
}


export const config = {
    api: {
        externalResolver: true
    }
  }