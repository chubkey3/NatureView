import prisma from '../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { DeleteObjectCommand, DeleteObjectCommandInput } from '@aws-sdk/client-s3'
import s3 from '../../util/S3init'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    let filename = req.body.filename
    let id = filename.split('.')[0]
    
    let found = await prisma.image.findUnique({
        where: {
            id: id
        }
    })

    if (found) {
        
        let params: DeleteObjectCommandInput = {
            Bucket: process.env.BUCKET_NAME,
            Key: 'images/' + filename,                          
        }   
                    
        const command = new DeleteObjectCommand(params)
        
        s3.send(command)
        .then( async () => {
            if (!params.Key) return
            
            const deleteObject = await prisma.image.delete({
                where: {
                    id: id
                }
            })      
            
            if (deleteObject) {
                res.status(200).end()
            } else {
                res.status(500).end()
            }
        })
        .catch(() => res.status(500).end())        
        
    } else {
        res.status(404).end()
    }
}


export const config = {
    api: {
        externalResolver: true
    }
}