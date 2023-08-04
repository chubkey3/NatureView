import type { NextApiRequest, NextApiResponse } from 'next'
import { Image } from '@prisma/client'
import prisma from '../../lib/prisma'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Image>
  ) {
    let image = await prisma.image.findUnique({
        where: {
            id: req.body.id
        },
        include: {
            tags: true
        }
    })

    if (image) {
        res.json(image)
    } else {
        res.status(404).end()
    }
}


export const config = {
    api: {
        externalResolver: true
    }
}