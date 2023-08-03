import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { useState, useCallback, useEffect, useRef } from "react";
import { nanoid } from 'nanoid'
import axios from "axios";
import { Flex, Input, Box, Text, Link, Button, HStack, Spinner } from '@chakra-ui/react';
import { BsImages } from 'react-icons/bs'
import { useRouter } from 'next/router';
import UploadConfigure from './UploadConfigure';
import { AiOutlinePlus } from 'react-icons/ai'
import { Tag } from '@prisma/client';


interface ImageOptions {
    [key: string] : {
        author: "JASON" | "CHRISTINA",
        tags: string[],
        description: string
    }
}

const s3 = new S3Client({
    endpoint: 'https://sfo3.digitaloceanspaces.com',
    region: 'us-west-3',    
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID || "",
        secretAccessKey: process.env.ACCESS_SECRET_KEY || ""
    }
})

const Uploader = () => {
    const [inputFiles, setInputFiles] = useState<File[]>([]);
    const [dragActive, setDragActive] = useState<boolean>(false);
    const [completedUploads, updateCompletedUploads] = useState<number>(0);
    const [uploading, toggleUploading] = useState<boolean>(false);
    const [imgOptions, setImgOptions] = useState<ImageOptions>({});
    const [tags, setTags] = useState<Tag[]>([]);

    const inputRef = useRef<HTMLInputElement>(null);

    const router = useRouter();

    const uploadImages = useCallback(() => {        
        if (inputFiles.length > 0){
        
            toggleUploading(true);
          
            for (let i = 0; i<inputFiles.length; i++) {
                let params = {
                Body: inputFiles[i],
                Bucket: 'nature-images',
                Key: 'images/' + nanoid() + '.' + inputFiles[i].name.split('.').pop(),          
                ACL: 'public-read'       
            }
            
            const command = new PutObjectCommand(params)
            
            s3.send(command)
            .then(() => {
                if (!params.Key) return
                let url = `https://${process.env.BUCKET_NAME}.${process.env.BUCKET_ENDPOINT}/${params.Key}`
                let id = params.Key.split('/').pop()
                
                axios.post('/api/upload', {...{id: id, url: url, lastModified: inputFiles[i].lastModified}, ...{...imgOptions[inputFiles[i].name]}}, {
                    onUploadProgress(progressEvent) {
                        if (progressEvent.total && progressEvent.loaded/progressEvent.total === 1) {
                            updateCompletedUploads(prevState => prevState + 1);
                        }
                    }
                })           
            })                 
        }
      }
    }, [inputFiles, imgOptions])

    useEffect(() => {
        if (inputFiles.length > 0 && completedUploads === inputFiles.length) {
            toggleUploading(false);
        }
    }, [inputFiles, completedUploads])

    useEffect(() => {
        axios.get('/api/tags')
        .then((res) => setTags(res.data))
    }, [])

    const handleDrag = useCallback((e: any) => {
        e.preventDefault()
        e.stopPropagation()

        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }, [])

    const handleDrop = useCallback((e: any) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setInputFiles(Array.from(inputFiles).concat(Array.from(e.dataTransfer.files || [])))
        }
    }, [inputFiles])

    const triggerFileUpload = () => {
        if (inputRef.current) {
            inputRef.current.click()
        }        
    }

      
    return (
        <Flex w={'50%'} maxW={'450px'} flexDir={'column'} alignItems={'center'} h={'75vh'}>
            <Flex hidden={inputFiles.length === 0 ? false : true} p={5} w={'100%'} h={'200px'} alignItems={'center'} justifyContent={'center'} border={'3px dashed rgb(134, 239, 172)'} cursor={'pointer'} onDrop={handleDrop} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onClick={triggerFileUpload} bgColor={dragActive ? 'green.200' : '#dcfce7'}>
                <Input ref={inputRef} hidden={true} type="file" accept="image/*" onChange={(e) => setInputFiles(Array.from(inputFiles).concat(Array.from(e.target.files || [])))} multiple/>
                <Flex flexDir={'column'} alignItems={'center'} color={'green.700'}>
                    <BsImages fontSize={'60px'}/>  
                    <Text mt={5} fontSize={'xl'}>Drag & drop to upload</Text>
                    <Text>or click to browse files</Text>
                                             
                </Flex>
            </Flex>

            {inputFiles.length > 0 && 
                <HStack maxH={'400px'} w={'90vw'} overflowX={'auto'} overflowY={'hidden'} spacing={5} h={'75%'} m={0} alignItems={'start'} justifyContent={['left', 'left', 'center']}>
                    {inputFiles.map((image) => (
                        <UploadConfigure img={image} tags={tags} setOptionsParent={setImgOptions} key={image.name}/>
                    ))
                    }
                    <Flex maxH={['360px', '370px', '380px']} w={'100px'} h={'100%'} borderRadius={'lg'} justifyContent={'center'} alignItems={'center'} color={'green.100'} bgColor={'green.400'} border={'2px solid'} borderColor={'green.200'} onClick={triggerFileUpload} cursor={'pointer'}>
                        <AiOutlinePlus fontSize={90}/>
                    </Flex>
                </HStack>
            }

            {!(completedUploads === inputFiles.length && completedUploads !== 0) && !uploading && <Button colorScheme={'whatsapp'} onClick={uploadImages} mt={'15px'}>Upload</Button>}

            {uploading && <Flex w={'100%'} flexDir={'column'} alignItems={'center'} mt={'10vh'}>
                <Spinner mb={'10px'}/>
                <Flex w={'100%'} flexDir={'column'}>
                    <Box w={`${100 * (completedUploads / inputFiles.length)}%`} transition={'width 0.5s ease-out'} h={'10px'} marginTop={'10px'} bgColor={'#0AA653'}/>
                    <Text>{completedUploads}/{inputFiles.length}</Text>
                </Flex>                
            </Flex>} 

            {(completedUploads === inputFiles.length && completedUploads !== 0) && 
                <Flex flexDir={'column'} textAlign={'center'} alignItems={'center'} maxW={'80vw'}>
                    <Text fontSize={'lg'} color={'green.800'} fontWeight={'bold'}>
                        Files Uploaded!
                    </Text>
                    <Text mt={'10px'} fontSize={'sm'}>Click <Link onClick={() => router.push('/')} color={'green.500'} textDecor={'underline'}>Here</Link> to view!</Text>
                </Flex>
            }             
        </Flex>
    )
}

export default Uploader