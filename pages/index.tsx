import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useCallback, useEffect, useState } from 'react'
import s3 from '../utils/init'
import { Object, ObjectList, PutObjectRequest } from 'aws-sdk/clients/s3'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Image as ImageSchema } from '@prisma/client'

type Props = {
  images: ImageSchema[]
}

const Home: NextPage<Props> = ({ images }) => {
  const [inputFiles, setInputFiles] = useState<FileList | null>();
  const [progress, setProgress] = useState<number>();
  const [filesCompleted, setFilesCompleted] = useState<number>(0);
  
  const router = useRouter();

  const updateDB = useCallback(async () => {
    let data = [];
    if (inputFiles){
      for (var i = 0; i<inputFiles.length; i++){
        data.push({filename: inputFiles[i].name, lastModified: new Date(inputFiles[i].lastModified), url: 'https://' + process.env.BUCKET_NAME + '.' + process.env.BUCKET_ENDPOINT + '/images/' + inputFiles[i].name})
      }
      await axios.post((process.env.PROD === 'true') ? 'https://natureview3.vercel.app/api/updatedb' : 'http://127.0.0.1:3000/api/updatedb', {data: data})
    }
    
  }, [inputFiles])

  const useEffectUpdateDB = useCallback( async () => {
    await updateDB().then(() => setInputFiles(null))
  }, [updateDB, setInputFiles] )

  const uploadImages = useCallback(() => {
    if (inputFiles){
      for (var i = 0; i<inputFiles.length; i++){
        let params: PutObjectRequest = {
          Body: inputFiles[i],
          Bucket: process.env.BUCKET_NAME || "",
          Key: 'images/' + inputFiles[i].name,
          ACL: 'public-read'
        }
  
        s3.putObject(params, async function(err, data){
          if (err){
            console.log(err)
          } else {
            console.log("Success!")
          }
        })
        .on('httpUploadProgress', (evt) => {
          if (evt.loaded === evt.total){
            setFilesCompleted(prevState => prevState + 1);
          }
        })
    }
  }
  }, [inputFiles])

  useEffect(() => {
    if (inputFiles && filesCompleted === inputFiles.length && inputFiles.length > 0){
      useEffectUpdateDB().then(() => router.refresh())
      setFilesCompleted(0);
    }

  }, [filesCompleted, inputFiles, router])

  useEffect(() => {
    if (inputFiles){
      
      /*
      let formData = new FormData();
      
      for (var i = 0; i<inputFiles.length; i++){
        formData.append("image", inputFiles[i], inputFiles[i].name)
      }
      //console.log(formData.getAll("image"))
      
      axios.post('http://localhost:3000/api/upload', formData, {headers: {'Content-Type': "multipart/form-data"}})
      .then((res) => {
        console.log(res.status)
      })
      
      */
     
     }
      
    
  }, [inputFiles])


  return (
    <div className={styles.container}>
      <Head>
        <title>NatureView</title>
        <meta name="description" content="A Website to View Snapshots of Nature" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>Upload File</h1>
        <input type="file" accept="image/*" onChange={(e) => setInputFiles(e.target.files)} multiple/>
        
        <button onClick={uploadImages}>Upload</button>
        {progress !== 100 && progress && <h2>Progress: {progress}%</h2>}
        {images.map((image) => (
          <div key={image.filename}>
            <h3 key={JSON.stringify(image.lastModified)}>{image.lastModified && new Date(image.lastModified).toDateString()}</h3>         
            <Image key={image.url} width={'100'} height={'100'} alt={'snapshot of nature :)'} src={image.url}/>
          </div>
        ))}
        {inputFiles && inputFiles[0].lastModified}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}


export const getServerSideProps: GetServerSideProps<Props> = async () => {
  try {
    const res = await axios.get((process.env.PROD === 'true') ? 'https://natureview3.vercel.app/api/list' : 'http://127.0.0.1:3000/api/list')
    const images = res.data

    return {
      props: {
        images
      }
    }
    
  } catch (error) {
    return {
      notFound: true
    }
  }
  
  
}

export default Home
