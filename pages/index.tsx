import type { GetServerSideProps, NextPage } from 'next'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import axios from 'axios'
import { Image as ImageSchema, Tag as TagSchema } from '@prisma/client'
import { SimpleGrid, Flex, Text, Link, Divider, Tag, useToast, Input, InputGroup, InputRightAddon, InputRightElement, Fade } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import convertImage from '../experimental/convertImage'
import toBase64 from '../experimental/toBase64'
import { AiOutlineSearch } from 'react-icons/ai'

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
  const toast = useToast()

  const [page, setPage] = useState<number>(1);
  const [data, setData] = useState<Data>(images);
  const [lastHeight, setLastHeight] = useState<number>(0)
  const [search, setSearch] = useState<string>("")

  const updateImages = useCallback(() => {
    axios.post('/api/list', {page: page})
    .then((res) => {
      if (Object.keys(res.data).length === 0) {
        setLastHeight(Infinity)
        return
      }

      let combined = Object.assign({}, data);

      for (const date in res.data) {
        if (Object.keys(combined).indexOf(date) < 0) {
          combined[date] = res.data[date]
        } else {
          combined[date] = combined[date].concat(res.data[date])
        }
      }      
      
      setData(combined)

    })
  }, [data, page])

  const onScroll = useCallback(() => {
    let height = (document.documentElement.scrollHeight - window.innerHeight) * 3/4;
   
    if (window.scrollY >= height) {
      if (height > lastHeight){
        setLastHeight(height)
      }
    }
  }, [lastHeight])

  useEffect(() => {
    if (router.query.success) {
      toast.closeAll()
      toast({title: 'Success!', description: 'Image successfully removed!', status: 'success', duration: 4000, isClosable: true})
      router.push('/', undefined, { shallow: true })
    }
   
  }, [router, toast])

  useEffect(() => {
    if (lastHeight){
      setPage(prevState => prevState + 1)    
    }
  }, [lastHeight])

  useEffect(() => {
    if (page > 1) {
      updateImages()
    }
  }, [page])

  useEffect(() => {
    window.addEventListener('scroll', onScroll)

    return () => window.removeEventListener('scroll', onScroll)
  }, [onScroll])


  return (
    <div className={styles.container}>            
      <main className={styles.main}>     
        <Flex pos={['relative', 'relative', 'absolute']} top={['initial', 'initial', 0]} right={['initial', 'initial', 0]} mr={['initial', 'initial', '50px']} mt={['initial', 'initial', '30px']}>
          <InputGroup size={['sm', 'md', 'lg']}>
            <Input borderColor={'gray.300'} value={search} onChange={(e) => setSearch(e.target.value)}/>
            <InputRightAddon bgColor={'green.500'} color={'white'}>
              <AiOutlineSearch fontSize={'20px'}/>        
            </InputRightAddon>
          </InputGroup>       
        </Flex>
        {(Object.keys(data).length > 0) ?
        (Object.keys(data).map((date) => (
          (data[date].filter((a) => a.tags?.find((b) => b.name.toLowerCase().includes(search.toLowerCase()))).length > 0 || search === "") &&
          <Flex mt={'6vh'} w={'90vw'} flexDir={'column'} key={date}>
            <Text ml={'4px'} fontSize={'xl'} fontWeight={'bold'} color={'green.800'}>{date}</Text>
            <Divider borderColor={'green.800'} w={'25%'} mb={'20px'} mt={'5px'}/>
            <SimpleGrid columns={[2,3,4]}>
              {data[date].map((image, i) => (               
                image.tags !== undefined && (image.tags.find((a) => a.name.toLowerCase().includes(search.toLowerCase())) || search === "") && 
                  <Flex key={i} m={'4px'} flexDir={'column'} cursor={'pointer'} onClick={() => router.push('/image/' + image.id)} _hover={{opacity: 0.8}} transition={'opacity 0.25s ease-out'}>                  
                    <Fade in={true} style={{width: '100%', height: '100%'}}>
                      <Image blurDataURL={`data:image/svg+xml;base64,${toBase64(convertImage(700, 475))}`} placeholder='blur' style={{objectFit: 'cover', height: '80%'}} sizes={'(max-width: 300px) 45vw, (max-width: 500px) 30vw, 22.5vw'} width={quality} height={0} priority={true} alt={'snapshot of nature :)'} src={image.url}/>                                  
                      <SimpleGrid columns={[3]} spacing={1} mt={'10px'}>
                      {image.tags?.map((tag, i) => (
                        <Tag key={i} size={'sm'} fontSize={['10px', '11px', '12px']} w={'fit-content'} colorScheme={tag.color}>{tag.name}</Tag>
                      ))
                      }           
                      </SimpleGrid>       
                    </Fade>
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
    const res = await axios.post(process.env.HOST ? `${process.env.HOST}/api/list` : 'http://localhost:3000/api/list', {page: 1})
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
