// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import s3 from '../init'
import { ListObjectsV2Output, ListObjectsV2Request, ObjectList } from 'aws-sdk/clients/s3'

//type Data = string[] | {message: string}
type Data = ObjectList | {message: string}

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
     res.status(200).json(data.Contents)
    }
  })
}


export const config = {
  api: {
      externalResolver: true
  }
}