import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useCallback, useEffect, useState } from 'react'
import s3 from '../utils/init'
import { Object, ObjectList, PutObjectRequest } from 'aws-sdk/clients/s3'
import axios from 'axios'
import { useRouter } from 'next/navigation'

type Props = {
  images: ObjectList
}

const Home: NextPage<Props> = ({ images }) => {
  const [inputFiles, setInputFiles] = useState<FileList | null>();
  const [progress, setProgress] = useState<number>();
  const [filesCompleted, setFilesCompleted] = useState<number>(0);
  
  const router = useRouter();

  const uploadImages = useCallback(() => {
    if (inputFiles){
      for (var i = 0; i<inputFiles.length; i++){
        let params: PutObjectRequest = {
          Body: inputFiles[i],
          Bucket: process.env.BUCKET_NAME || "",
          Key: 'images/' + inputFiles[i].name,
          ACL: 'public-read'
        }
  
        s3.putObject(params, function(err){
          if (err){
            console.log(err)
          } else {
            console.log("Success!")
          }
        })
        .on('httpUploadProgress', (evt) => {
          if (Math.round((evt.loaded / evt.total) * 100) === 100){
            setFilesCompleted(prevState => prevState + 1);
          }
        })
        
    }
  }
  }, [inputFiles])

  useEffect(() => {
    if (inputFiles && filesCompleted === inputFiles.length && inputFiles.length > 0){
      router.refresh();
      setFilesCompleted(0);
      setInputFiles(null);
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
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>Upload File</h1>
        <input type="file" accept="image/*" onChange={(e) => setInputFiles(e.target.files)} multiple/>
        
        <button onClick={uploadImages}>Upload</button>
        {progress !== 100 && progress && <h2>Progress: {progress}%</h2>}
        {images.map((image: Object) => (
          <div key={image.ETag}>
            <h3 key={JSON.stringify(image.LastModified)}>{image.LastModified && new Date(image.LastModified).toDateString()}</h3>         
            <Image key={image.Key} width={'100'} height={'100'} alt={'snapshot of nature :)'} src={'https://' + process.env.BUCKET_NAME + '.' + process.env.BUCKET_ENDPOINT + '/' + image.Key}/>
          </div>
        ))}
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
