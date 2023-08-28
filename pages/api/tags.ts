import { Tag } from '@prisma/client'
import prisma from '../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    _req: NextApiRequest,
    res: NextApiResponse<Tag[]>
  ) {
    let tags = await prisma.tag.findMany()

    if (tags) {
        res.json(tags)
    } else {
        res.status(404).end()
    }
}


export const config = {
    api: {
        externalResolver: true
    }
}