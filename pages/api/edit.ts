import { Image, Tag } from '@prisma/client';
import prisma from '../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'


interface ImageSchemaWithTags extends Image {
    tags: Tag[]
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {    
    let data: ImageSchemaWithTags = req.body.data;       
    let id: string = data.id;
    
    let edit_image = await prisma.image.update({
        where: {
            id: id
        },
        data: {
            ...data,
            tags: {
                deleteMany: {},  
                connectOrCreate: data.tags.map((tag) => {return {where: {name: tag.name}, create: tag}})
            }
        }
    })

    if (edit_image) {
        console.log(edit_image)
        res.status(200).end()
    } else {
        res.status(404).end()
    }
}


export const config = {
    api: {
        externalResolver: true
    }
}