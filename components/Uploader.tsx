import { PutObjectRequest } from 'aws-sdk/clients/s3'
import { useState, useCallback, useEffect, useRef } from "react";
import s3 from '../utils/init'
import { nanoid } from 'nanoid'
import axios from "axios";
import { Flex, Input, Box, Text, Link } from '@chakra-ui/react';
import { BsImages } from 'react-icons/bs'
import { useRouter } from 'next/router';


const Uploader = () => {
    const [inputFiles, setInputFiles] = useState<File[]>([]);
    const [dragActive, setDragActive] = useState<boolean>(false);
    const [completedUploads, updateCompletedUploads] = useState<number>(0);

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
      
            s3.putObject(params, (err, data) => {
              let url = `https://${process.env.BUCKET_NAME}.${process.env.BUCKET_ENDPOINT}/${params.Key}`
              let id = params.Key.split('/').pop()
              /*
              let img = new Image()

              let objectUrl = window.URL.createObjectURL(inputFiles[i])

              img.onload = function () {
                console.log(this.width, " ", this.height)
                window.URL.revokeObjectURL(objectUrl)
              }

              img.src = objectUrl
              */
              axios.post('/api/upload', {id: id, url: url, lastModified: inputFiles[i].lastModified, description: "Test image", author: "CHRISTINA"}, {
                onUploadProgress(progressEvent) {
                    if (progressEvent.total && progressEvent.loaded/progressEvent.total === 1) {
                        updateCompletedUploads(prevState => prevState + 1);
                    }
                }
              })              
            })
            
        }
      }
    }, [inputFiles])

    useEffect(() => {
        if (inputFiles.length > 0) {
            uploadImages()
        }
    }, [inputFiles, uploadImages])

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
        <Flex w={'50%'} maxW={'450px'} flexDir={'column'}>
            <Flex p={5} w={'100%'} h={'200px'} alignItems={'center'} justifyContent={'center'} border={'2px dashed #557A46'} cursor={'pointer'} onDrop={handleDrop} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onClick={triggerFileUpload} bgColor={dragActive ? 'green.300' : 'green.200'}>
                <Input ref={inputRef} hidden={true} type="file" accept="image/*" onChange={(e) => setInputFiles(Array.from(e.target.files || []))} multiple/>
                <Flex flexDir={'column'} alignItems={'center'}>
                    <BsImages fontSize={'60px'}/>  
                    <Text mt={5} fontSize={'xl'}>Drag & drop to upload</Text>
                    <Text>or click to browse files</Text>
                                             
                </Flex>
            </Flex>
            {/*<Select/>*/}
            <Flex w={'100%'}>
                {(inputFiles.length > 0 ) && 
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