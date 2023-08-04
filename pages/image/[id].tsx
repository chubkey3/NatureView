import { Card, CardBody, CardFooter, Flex, HStack, Icon, IconButton, Skeleton, Spinner, Tag, Text, useToast } from "@chakra-ui/react"
import { Image as ImageSchema, Tag as TagSchema } from "@prisma/client"
import axios from "axios"
import { GetServerSideProps, NextPage } from "next"
import Image from "next/image"
import { useRouter } from "next/router"
import { BsFillPersonFill } from "react-icons/bs"
import { FiEdit } from 'react-icons/fi'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { BiTime } from 'react-icons/bi'
import { useCallback, useState } from "react"
import { HiOutlineTrash } from 'react-icons/hi'

interface ImageSchemaWithTags extends ImageSchema {
    tags: TagSchema[]
}

type Props = {
    image: ImageSchemaWithTags
}

const ImagePage: NextPage<Props> = ({image}) => {
    const router = useRouter()
    const toast = useToast()

    const [isLoaded, setIsLoaded] = useState<boolean>(false)

    const removeImage = useCallback(() => {

        toast({title: 'Deleting Image!', status: 'loading', duration: 3000, isClosable: true})

        let filename = image.url.split('/').pop();
        
        axios.post('/api/delete', {filename: filename})
        .then(() => router.push('/?success=true'))
        .catch(() => toast({title: 'Error!', description: 'An error encountered deleting the image!', status: 'error', duration: 3000}))

    }, [image, router, toast])

    return (
        <Flex justifyContent={'center'} alignItems={'center'} flexDir={'column'}>            
            <Flex w={'60%'} minW={'300px'}>
                <IconButton aria-label="back buttton" as={IoMdArrowRoundBack} colorScheme="green" ml={1} size={'sm'} onClick={() => router.push('/')}/>                
            </Flex>
            <Card w={'60%'} mt={['10px', '20px']} display={'flex'}  minW={'300px'} mb={'100px'}>        
                <Flex alignSelf={['initial', 'end']} justifyContent={'space-between'} mb={2} mt={1}>
                    <IconButton size={'sm'} aria-label="edit image" m={2} as={FiEdit} colorScheme="blue" p={1}/>        
                    <IconButton size={'sm'} aria-label="edit image" m={2} as={HiOutlineTrash} colorScheme="red" p={1} onClick={removeImage}/>                            
                </Flex>
                <Flex justifyContent={'center'}>
                    <Flex w={['80%', '60%']} pos={'relative'} alignItems={'center'} justifyContent={'center'}>
                        {!isLoaded && <Spinner pos={'absolute'} my={'20px'} size={'xl'}/>}
                        {/*<Skeleton w={'100%'} h={'100%'} pos={'absolute'} isLoaded={isLoaded}/>*/}
                        <Image onLoadingComplete={() => setIsLoaded(true)} style={{objectFit: 'cover', width: '100%', height: '100%', borderRadius: '5px'}} src={image.url} priority={true} width={1000} height={0} alt="nature image :)"/>
                    </Flex>                    
                </Flex>
                <CardBody alignItems={'center'} w={'100%'} pt={2} display={'flex'} fontSize={['sm', 'md']} flexDir={'column'}>
                    {(image.tags.length > 0) && <HStack minW={'260px'} flexWrap={'wrap'} spacing={2} w={'60%'} mb={['10px', '20px']}>
                        {image.tags?.map((tag, i) => (
                            <Tag key={i} size={['xs', 'sm']} p={1} py={[0.5, 1]} fontSize={['8px', '11px', '13px']} w={'fit-content'} colorScheme={tag.color}>{tag.name}</Tag>
                        ))
                        }           
                    </HStack>}     
                    {isLoaded && <Text fontSize={['xs', 'sm', 'md']} mt={'20px'}>{image.description || "This image has no description."}</Text>}
                </CardBody>
                <CardFooter p={['10px', '20px']}>
                    <Flex justifyContent={'space-between'} w={'100%'}>                        
                        <Flex alignItems={'center'}>
                            <Text fontSize={['sm', 'md', 'lg']}>{new Date(image.lastModified).toDateString()}</Text>
                            <Icon as={BiTime} ml={1} fontSize={'20px'}/>
                        </Flex>
                        <Flex alignItems={'center'}>
                            <Text fontSize={['sm', 'md', 'lg']}>{image.author[0] + image.author.toLowerCase().slice(1)}</Text>
                            <Icon as={BsFillPersonFill} ml={1} fontSize={'20px'}/>
                        </Flex>
                    </Flex>
                </CardFooter>
            </Card>
        </Flex>
    )
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
    try {
      const res = await axios.post((process.env.NODE_ENV === 'production') ? 'https://natureview3.vercel.app/api/image' : 'http://localhost:3000/api/image', {id: ctx.params ? ctx.params.id : ""})
      const image = res.data
  
      return {
        props: {
          image
        }
      }
      
    } catch (error) {

      return {
        notFound: true
      }
    }    
  }

export default ImagePage