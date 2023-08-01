import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'
import { Image } from '@prisma/client'

type Data = {message: string}

interface Params extends Image {
  tags?: string[]
}

const colors = [ "whiteAlpha", "blackAlpha", "gray", "red", "orange", "yellow", "green", "teal", "blue", "cyan", "purple", "pink", "linkedin", "facebook", "messenger", "whatsapp", "twitter", "telegram" ] 

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    if (req.method === "POST"){
        let params: Params = req.body
        let test = []

        if (params.tags) {
          for (const tag of params.tags) {
            test.push({name: tag})
          }
        }
        
        let upload = await prisma.image.create({
            data: {
              id: params.id,
              lastModified: new Date(params.lastModified),
              url: params.url,
              description: params.description,
              author: params.author,
              tags: {
                connectOrCreate: params.tags ? params.tags.map((tag) => {
                  return {
                    where: {name: tag},
                    create: {name: tag, color: colors[Math.floor(Math.random() * colors.length)]}
                  }
                }) : []                              
              }
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


