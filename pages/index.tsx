import type { GetServerSideProps, NextPage } from 'next'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import axios from 'axios'
import { Image as ImageSchema, Tag as TagSchema } from '@prisma/client'
import { SimpleGrid, Flex, Text, Link, Divider, Tag, HStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'

interface ImageSchemaWithTags extends ImageSchema {
  tags?: TagSchema[]
}

type Data = {
  [key: string]: ImageSchemaWithTags[]
}

type Props = {
  images: Data  
}

let quality = 430;

const Home: NextPage<Props> = ({ images }) => {

  const router = useRouter()

  return (
    <div className={styles.container}>            
      <main className={styles.main}>   
        {(Object.keys(images).length > 0) ?
        (Object.keys(images).map((date) => (
          <Flex mt={'6vh'} w={'90vw'} flexDir={'column'} key={date}>
            <Text ml={'4px'} fontSize={'xl'} fontWeight={'bold'} color={'green.800'}>{date}</Text>
            <Divider borderColor={'green.800'} w={'25%'} mb={'20px'} mt={'5px'}/>
            <SimpleGrid columns={[2,3,4]}>
              {images[date].map((image) => (
                <Flex key={image.id} m={'4px'} flexDir={'column'}>
                  <Image style={{objectFit: 'cover', height: '80%'}} sizes={'(max-width: 300px) 45vw, (max-width: 500px) 30vw, 22.5vw'} width={quality} height={0} priority={true} loading={'eager'} key={image.url} alt={'snapshot of nature :)'} src={image.url}/>                  
                  
                  <HStack flexWrap={'wrap'} mt={'10px'}>
                  {image.tags?.map((tag) => (
                    <Tag key={tag.name} size={'sm'} fontSize={['10px', '11px', '12px']} maxW={'fit-content'} colorScheme={tag.color}>{tag.name}</Tag>
                  ))
                  }           
                  </HStack>       
                </Flex>
              ))}
            </SimpleGrid>
          </Flex>
        ))
        )
        :
        <Flex flexDir={'column'} textAlign={'center'} alignItems={'center'} maxW={'80vw'}>
          <Text fontSize={'xl'} fontWeight={'bold'}>
              No Images Found!
          </Text>
          <Text mt={5} fontSize={'md'}>Click <Link onClick={() => router.push('/upload')} color={'green.500'} textDecor={'underline'}>Here</Link> to start a beautiful collection of nature images!</Text>
        </Flex>
        }
        {/*
        <Flex mt={'3vh'} justifyContent={'center'} alignItems={'center'} cursor={'pointer'} onClick={() => router.push('https://github.com/chubkey3')} border={'2px solid'} color={'black'} bgColor={'green.100'} borderColor={'green.500'} borderRadius={'20px'} px={3} py={2}>
          <Text fontSize={'lg'} mr={0.5}>Chubkey</Text>
          <AiFillGithub fontSize={'26px'}/>
        </Flex>
      */}
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
