import { PutObjectRequest } from 'aws-sdk/clients/s3'
import { useState, useCallback, useEffect, useRef } from "react";
import s3 from '../utils/init'
import { nanoid } from 'nanoid'
import axios from "axios";
import { Flex, Input, Box, Text, Link, Button, HStack } from '@chakra-ui/react';
import { BsImages } from 'react-icons/bs'
import { useRouter } from 'next/router';
import UploadConfigure from './UploadConfigure';
import { AiOutlinePlus } from 'react-icons/ai'


interface ImageOptions {
    [key: string] : {
        author: "JASON" | "CHRISTINA",
        tags: string[],
        description: string
    }
}

const Uploader = () => {
    const [inputFiles, setInputFiles] = useState<File[]>([]);
    const [dragActive, setDragActive] = useState<boolean>(false);
    const [completedUploads, updateCompletedUploads] = useState<number>(0);
    const [uploading, toggleUploading] = useState<boolean>(false);
    const [imgOptions, setImgOptions] = useState<ImageOptions>({});

    const inputRef = useRef<HTMLInputElement>(null);

    const router = useRouter();

    const uploadImages = useCallback(() => {
        if (inputFiles){
          for (let i = 0; i<inputFiles.length; i++){
            let params: PutObjectRequest = {
              Body: inputFiles[i],
              Bucket: process.env.BUCKET_NAME || "",
              Key: 'images/' + nanoid() + '.' + inputFiles[i].name.split('.').pop(),          
              ACL: 'public-read'       
            }
      
            s3.putObject(params, () => {
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
        if (inputFiles.length > 0) {
            //uploadImages()
        }
    }, [inputFiles, uploadImages])

    useEffect(() => {
        if (inputFiles.length > 0 && completedUploads === inputFiles.length) {
            toggleUploading(false);
        }
    }, [inputFiles, completedUploads])

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
        <Flex w={'50%'} maxW={'450px'} flexDir={'column'} justifyContent={'center'} alignItems={'center'}>
            {<Flex hidden={inputFiles.length === 0 ? false : true} p={5} w={'100%'} h={'200px'} alignItems={'center'} justifyContent={'center'} border={'2px dashed #557A46'} cursor={'pointer'} onDrop={handleDrop} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onClick={triggerFileUpload} bgColor={dragActive ? 'green.300' : 'green.200'}>
                <Input ref={inputRef} hidden={true} type="file" accept="image/*" onChange={(e) => setInputFiles(Array.from(e.target.files || []))} multiple/>
                <Flex flexDir={'column'} alignItems={'center'}>
                    <BsImages fontSize={'60px'}/>  
                    <Text mt={5} fontSize={'xl'}>Drag & drop to upload</Text>
                    <Text>or click to browse files</Text>
                                             
                </Flex>
            </Flex>}
            {inputFiles.length > 0 && !uploading && 
                <HStack w={'80vw'} overflowX={'auto'} spacing={5} justifyContent={'center'} my={'20px'} h={'50vh'}>
                    {inputFiles.map((image) => (
                        <UploadConfigure img={image} setOptionsParent={setImgOptions} key={image.name}/>
                    ))
                    }
                    <Flex w={'100px'} h={'100%'} borderRadius={'lg'} justifyContent={'center'} alignItems={'center'} bgColor={'gray.300'} onClick={triggerFileUpload} cursor={'pointer'}>
                        <AiOutlinePlus fontSize={90}/>
                    </Flex>
                </HStack>
                }    
            <Button colorScheme={'whatsapp'} onClick={uploadImages} mt={'10px'}>Upload</Button>
            {/*<Select/>*/}
            <Flex w={'100%'}>
                {(uploading ) && 
                    <Flex w={'100%'} flexDir={'column'}>
                        <Box w={`${100 * (completedUploads / inputFiles.length)}%`} transition={'width 0.5s ease-out'} h={'10px'} marginTop={'10px'} bgColor={'#0AA653'}/>
                        <Text>{completedUploads}/{inputFiles.length}</Text>
                    </Flex>
                }     
            </Flex> 
            {(completedUploads === inputFiles.length && completedUploads !== 0) && 
                <Flex flexDir={'column'} textAlign={'center'} alignItems={'center'} mt={'5vh'} maxW={'80vw'}>
                    <Text fontSize={'xl'} fontWeight={'bold'}>
                        Files Uploaded!
                    </Text>
                    <Text mt={5} fontSize={'md'}>Click <Link onClick={() => router.push('/')} color={'green.500'} textDecor={'underline'}>Here</Link> to view your uploaded images!</Text>
                </Flex>
            }
        </Flex>
    )
}

export default Uploader