import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'
import { Image } from '@prisma/client'

type Data = Image[] | {message: string}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  
  let data = await prisma.image.findMany()

  if (data) {
    res.status(200).json(data)
  } else {
    res.status(500).json({message: "Internal Server Error!"})
  }
  
  

}


export const config = {
  api: {
      externalResolver: true
  }
}