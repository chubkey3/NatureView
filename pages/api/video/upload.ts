import multer from 'multer';
import Ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import { readFile, unlink } from 'fs';
import { nanoid } from 'nanoid';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

const s3 = new S3Client({
    endpoint: 'https://' + process.env.BUCKET_ENDPOINT,
    region: process.env.BUCKET_REGION,    
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID || "",
        secretAccessKey: process.env.ACCESS_SECRET_KEY || ""
    }
})

const converted_extension = ".gif"
const useExperimentalHighQuality = false


export default async (req: any, res: any) => {
    let filename = ""

    const upload = multer({dest: '/temp', storage: multer.diskStorage({destination: './temp', filename: (req, file, cb) => {filename = nanoid() + '.' + file.originalname.split('.')[1]; cb(null, filename)}})})

    const uploadtoS3 = (original_filename: string) => {        
        let filename = original_filename.split('.')[0] + converted_extension

        readFile('./temp/' + filename, (err, data) => {
            let params = {
                Body: data,
                Bucket: process.env.BUCKET_NAME,
                Key: 'images/' + filename,          
                ACL: 'public-read'       
    
            }
    
            const command = new PutObjectCommand(params)
            
            s3.send(command)
            .then(() => res.status(200).json({url: `https://${process.env.BUCKET_NAME}.${process.env.BUCKET_CDN_ENDPOINT}/${params.Key}` }))
            .catch(() => res.status(500).end())
            .finally(() => {                
                unlink('./temp/' + original_filename, () => {})
                unlink('./temp/' + filename, () => {})
            })
               
        })
    }
    
    upload.single('video')(req, res, function(err) {
        if (err) {
            console.log(err)
        } else {
            let file_path = path.join(process.cwd(), 'temp', filename);
            let ffmpeg = Ffmpeg(file_path)      

            if (useExperimentalHighQuality) {
                ffmpeg = ffmpeg.complexFilter([
                    'split[s0][s1]',
                    {
                        filter: 'palettegen',
                        inputs: 's0', outputs: 'p'
                    },
                    {
                        filter: 'paletteuse',
                        inputs: ['s1', 'p'], outputs: 'output'
                    }
                ], 'output') 
            }
            ffmpeg                                                 
            .noAudio()                
            .output('./temp/' + filename.split('.')[0] + converted_extension)          
            .on("end", () => uploadtoS3(filename))
            .on("error", (e) => console.log(e))            
            .run()                       
        }
    })       
};


export const config = {
    api: {
      bodyParser: false,
      externalResolver: true
    }
}