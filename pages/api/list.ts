import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'
import { Image } from '@prisma/client'
import GroupByDate from '../../types/GroupByDate';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Image[] | {message: string} | GroupByDate>
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

  
  if (req.body.date) {         
    data = data.filter((entry) => entry.lastModified.getMonth() + 1 === parseInt(req.body.date.month) && entry.lastModified.getFullYear() === parseInt(req.body.date.year))
  }

  if (req.body.includeTags) {
    data = data.filter((entry) => entry.tags.filter(value => req.body.includeTags.includes(value.name)).length > 0)
  }
  
  if (req.body.raw) {

    if (data) {
      res.status(200).json(data)
    } else {
      res.status(500).json({message: "Internal Server Error!"})
    }

  } else {

    let dataByDate: GroupByDate = {}

    if (data) {
      for (const image of data) {      
        let date = image.lastModified.toDateString().split(' ').filter((_e, i) => i !== 0 && i !== 2).join(' ')

        if (!Object.hasOwn(dataByDate, date)) {
          dataByDate[date] = [image]
        } else {
          dataByDate[date].push(image)
        }
      }

      res.status(200).json(dataByDate)
    } else {
      res.status(500).json({message: "Internal Server Error!"})
    }
  }
}


export const config = {
  api: {
      externalResolver: true
  }
}