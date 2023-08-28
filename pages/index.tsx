import type { GetServerSideProps, NextPage } from 'next'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import axios from 'axios'
import { SimpleGrid, Flex, Text, Link, Divider, Tag, useToast, Fade, Wrap, WrapItem, useDisclosure } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import convertImage from '../util/convertImage'
import toBase64 from '../util/toBase64'
import InfiniteScroll from 'react-infinite-scroll-component'
import ImageData from '../types/ImageData'
import ImageFilter from '../components/ImageFilter'

type Props = {
  images: ImageData  
}

let quality = 430


const Home: NextPage<Props> = ({ images }) => {

  const router = useRouter()
  const toast = useToast()

  const [page, setPage] = useState<number>(1);
  const [data, setData] = useState<ImageData>(images);
  const [search, setSearch] = useState<string>("")
  const [dateQuery, setDateQuery] = useState<{month: string, year: string}>()
  const [hasMore, setHasMore] = useState<boolean>(true)

  const { isOpen, onOpen, onClose } = useDisclosure()

  const updateImages = useCallback(() => {
    axios.post('/api/list', {page: page})
    .then((res) => {
      if (Object.keys(res.data).length === 0) {
        setHasMore(false)
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

  useEffect(() => {
    if (router.query.success) {
      toast.closeAll()
      toast({title: 'Success!', description: 'Image successfully removed!', status: 'success', duration: 4000, isClosable: true})
      router.push('/', undefined, { shallow: true })
    }
   
  }, [router, toast])

  useEffect(() => {
    if (page > 1) {
      updateImages()
    }
  }, [page])


  return (
    <div className={styles.container}>            
      <main className={styles.main}>             
        <ImageFilter search={search} setSearch={setSearch} dateQuery={dateQuery} setDateQuery={setDateQuery} isOpen={isOpen} onOpen={onOpen} onClose={onClose}/>        
        {(Object.keys(data).length > 0 && (Object.keys(data).filter(date => data[date].filter((a) => a.tags?.find((b) => b.name.toLowerCase().includes(search.toLowerCase()))).length > 0).length > 0 || search === "") && (dateQuery === undefined || dateQuery.month === undefined || Object.keys(data).filter(date => data[date].filter((a) => new Date(a.lastModified).getMonth() + 1 === parseInt(dateQuery.month) && new Date(a.lastModified).getFullYear() === parseInt(dateQuery.year)).length > 0).length > 0)) ?        
        (<InfiniteScroll style={{overflow: 'hidden'}} dataLength={Object.keys(data).map(date => data[date].length).reduce((a, b) => a + b, 0)} next={() => setPage(prevState => prevState + 1)} hasMore={hasMore} loader={<h1>Loading...</h1>}>{Object.keys(data).map((date) => (
          (data[date].filter((a) => a.tags?.find((b) => b.name.toLowerCase().includes(search.toLowerCase()))).length > 0 || search === "" || isOpen) && (isOpen || dateQuery === undefined || dateQuery.month === undefined || data[date].filter((a) => new Date(a.lastModified).getMonth() + 1 === parseInt(dateQuery.month) && new Date(a.lastModified).getFullYear() === parseInt(dateQuery.year)).length > 0) &&
          <Flex mt={'6vh'} w={'90vw'} flexDir={'column'} key={date}>
            <Text ml={'4px'} fontSize={'xl'} fontWeight={'bold'} color={'green.800'}>{date}</Text>
            <Divider borderColor={'green.800'} w={'25%'} mb={'20px'} mt={'5px'}/>
            <SimpleGrid columns={[2,3,4]}>
              {data[date].map((image, i) => (               
                image.tags !== undefined && (image.tags.find((a) => a.name.toLowerCase().includes(search.toLowerCase())) || search === "" || isOpen) && 
                  <Flex key={i} m={'4px'} flexDir={'column'} cursor={'pointer'} onClick={() => router.push('/image/' + image.id)} _hover={{opacity: 0.8}} transition={'opacity 0.25s ease-out'}>                  
                    <Fade in={true} style={{width: '100%', height: '100%'}}>
                      <Image blurDataURL={`data:image/svg+xml;base64,${toBase64(convertImage(700, 475))}`} placeholder='blur' style={{objectFit: 'cover', height: '80%'}} sizes={'(max-width: 300px) 45vw, (max-width: 500px) 30vw, 22.5vw'} width={quality} height={0} priority={true} alt={'snapshot of nature :)'} src={image.url}/>                                  
                      <Wrap spacing={1} mt={'10px'}>
                      {image.tags?.map((tag, i) => (
                        <WrapItem key={i}>
                          <Tag size={'sm'} fontSize={['10px', '11px', '12px']} colorScheme={tag.color}>{tag.name}</Tag>
                        </WrapItem>
                      ))
                      }           
                      </Wrap>       
                    </Fade>
                  </Flex>                                                
              ))}
            </SimpleGrid>
          </Flex>
        ))}</InfiniteScroll>
        )
        :
        <Flex flexDir={'column'} textAlign={'center'} alignItems={'center'} maxW={'80vw'}>
          <Text fontSize={'xl'} fontWeight={'bold'}>
              No Images Found!
          </Text>
          <Text mt={5} fontSize={'md'}>Click <Link onClick={() => router.push('/upload')} color={'green.500'} textDecor={'underline'}>Here</Link> to add images of nature!</Text>
        </Flex>
        }        
      </main>  
    </div>
  )
}


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
