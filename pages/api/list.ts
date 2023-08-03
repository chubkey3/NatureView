import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'
import { Image } from '@prisma/client'

interface Test {
  [key: string]: Image[]
}

type Data = Image[] | {message: string} | Test

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  let take = 10;
    
  let data = await prisma.image.findMany({
    orderBy: {
      lastModified: 'desc'
    },
    include: {
      tags: true
    },
    ...(req.body.page ? {take: take} : {}),
    ...(req.body.page ? {skip: (req.body.page - 1) * take} : {})
  })  

  let test: Test = {}

  //parse data and group by month
  if (data) {
    for (const image of data) {
      //let date = image.lastModified.toDateString().substring(image.lastModified.toDateString().indexOf(' ') + 1) //day
      let date = image.lastModified.toDateString().split(' ').filter((e, i) => i !== 0 && i !== 2).join(' ') //month

      if (!Object.hasOwn(test, date)) {
        test[date] = [image]
      } else {
        test[date].push(image)
      }
    }

    //console.log(test)
    res.status(200).json(test)
  } else {
    res.status(500).json({message: "Internal Server Error!"})
  }
  
  

}


export const config = {
  api: {
      externalResolver: true
  }
}