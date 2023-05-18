// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'

type Data = {message: string}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    if (req.method === "POST"){
        let upload = await prisma.image.createMany({
            data: req.body.data,
            skipDuplicates: true
          })
          if (upload){
            res.status(200).json({message: 'Success!'})
            console.log(upload.count)
          } else {
            res.status(400).json({message: 'Invalid Payload.'})
          }

    } else {
        res.status(400).json({message: 'Must use POST Request.'})
    }  

}


export const config = {
  api: {
      externalResolver: true
  }
}


