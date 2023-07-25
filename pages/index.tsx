import type { GetServerSideProps, NextPage } from 'next'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import axios from 'axios'
import { Image as ImageSchema } from '@prisma/client'
import { SimpleGrid, Flex, Text, Link, IconButton } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { AiFillGithub } from 'react-icons/ai'

type Props = {
  images: ImageSchema[]
}

const Home: NextPage<Props> = ({ images }) => {

  const router = useRouter()

  return (
    <div className={styles.container}>            
      <main className={styles.main}>   
        {(images.length > 0) ?
        <SimpleGrid mt={'6vh'} columns={[2,3,4]} w={'90vw'}>
          {images.map((image) => (
            <Flex key={image.id} m={'4px'}>
              <Image style={{objectFit: 'cover', borderRadius: '8px'}} priority={false} placeholder='empty' loading={'lazy'} key={image.url} width={500} height={281.25} alt={'snapshot of nature :)'} src={image.url}/>
            </Flex>
          ))}
        </SimpleGrid>
        :
        <Flex flexDir={'column'} textAlign={'center'} alignItems={'center'} maxW={'80vw'}>
          <Text fontSize={'xl'} fontWeight={'bold'}>
              No Images Found!
          </Text>
          <Text mt={5} fontSize={'md'}>Click <Link onClick={() => router.push('/upload')} color={'green.500'} textDecor={'underline'}>Here</Link> to start a beautiful collection of nature images!</Text>
        </Flex>
        }
        <Flex mt={'3vh'} justifyContent={'center'} alignItems={'center'} cursor={'pointer'} onClick={() => router.push('https://github.com/chubkey3')} border={'2px solid'} color={'black'} bgColor={'green.100'} borderColor={'green.500'} borderRadius={'20px'} px={3} py={2}>
          <Text fontSize={'lg'} mr={0.5}>Chubkey</Text>
          <AiFillGithub fontSize={'26px'}/>
        </Flex>
      </main>  
    </div>
  )
}
/*
<div className={styles.gallary}>                                
          {images.map((image, i) => (
            <div key={image.id} className={styles.test}>
              {<h3 key={JSON.stringify(image.lastModified)}>{image.lastModified && new Date(image.lastModified).toDateString()}</h3>}
              <Image priority={false} placeholder='empty' loading={'lazy'} key={image.url} fill={true} alt={'snapshot of nature :)'} src={image.url}/>
            </div>
          ))}
        </div>
*/

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  try {
    const res = await axios.get((process.env.NODE_ENV === 'production') ? 'https://natureview3.vercel.app/api/list' : 'http://localhost:3000/api/list')
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
