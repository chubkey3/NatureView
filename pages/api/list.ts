// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import s3 from '../init'
import { ListObjectsV2Output, ListObjectsV2Request } from 'aws-sdk/clients/s3'

type Data = string[] | {message: string}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  let params: ListObjectsV2Request = {
    Bucket: process.env.BUCKET_NAME || "",
    Prefix: "images"
  }

  s3.listObjectsV2(params, function(err, data: ListObjectsV2Output) {
    if (err) {
      res.status(500).json({message: "Internal Server Error!"})
    } else if (data.Contents) {
      let temp: string[] = [];

      for (let k = 0; k<data.Contents.length; k++){
        let fileName = data.Contents[k].Key;

        if (fileName){
          temp.push(fileName.replace("images/", ""))
        }
        
      } 
      res.status(200).json(temp)
    }
  })
}


export const config = {
  api: {
      externalResolver: true
  }
}