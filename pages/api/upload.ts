import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'
import { Image } from '@prisma/client'

type Data = {message: string}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    if (req.method === "POST"){
        let params: Image = req.body

        let upload = await prisma.image.create({
            data: {
              id: params.id,
              lastModified: new Date(params.lastModified),
              url: params.url,
              description: params.description,
              author: params.author,
              categoryName: params.categoryName
            }        
          })

        if (upload){
          res.status(200).json({message: 'Success!'})
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


