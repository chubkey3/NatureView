import { Button, Card, CardBody, CardFooter, Flex, HStack, Icon, IconButton, Spinner, Tag, Text, Textarea, useToast } from "@chakra-ui/react"
import { Image as ImageSchema, Tag as TagSchema } from "@prisma/client"
import axios from "axios"
import { GetServerSideProps, NextPage } from "next"
import Image from "next/image"
import { useRouter } from "next/router"
import { BsFillPersonFill } from "react-icons/bs"
import { FiEdit } from 'react-icons/fi'
import { BiTime } from 'react-icons/bi'
import { useCallback, useState } from "react"
import { HiOutlineTrash } from 'react-icons/hi'
import { Select } from "chakra-react-select"
import chakraStyles from "../../util/ChakraStyles"

interface ImageSchemaWithTags extends ImageSchema {
    tags: TagSchema[]
}

type Props = {
    image: ImageSchemaWithTags,
    tags: TagSchema[]
}

const ImagePage: NextPage<Props> = ({image, tags}) => {
    const router = useRouter()
    const toast = useToast()

    const [isLoaded, setIsLoaded] = useState<boolean>(false)
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [data, setData] = useState<ImageSchemaWithTags>(image)
    const [input, setInput] = useState<string>("")    

    const removeImage = useCallback(() => {

        toast({title: 'Deleting Image!', status: 'loading', duration: 3000, isClosable: true})

        let filename = image.url.split('/').pop();
        
        axios.post('/api/delete', {filename: filename})
        .then(() => router.push('/?success=true'))
        .catch(() => toast({title: 'Error!', description: 'An error encountered deleting the image!', status: 'error', duration: 3000}))

    }, [image, router, toast])

    const updateImage = useCallback(() => {

        axios.post('/api/edit', {data: data})
        .then(() => router.reload())
        .catch(() => toast({title: 'Error!', description: 'An error encountered editing the image!', status: 'error', duration: 3000}))

    }, [router, toast, data])

    return (
        <Flex justifyContent={'center'} alignItems={'center'} flexDir={'column'}>                    
            <Card w={'60%'} mt={['10px', '20px']} display={'flex'} minW={'300px'} maxH={!isEditing ? 'calc(100vh - 200px)' : ''} mb={isEditing ? '100px' : ''}>        
                <Flex alignSelf={['initial', 'end']} justifyContent={'space-between'} mb={1} mt={1}>
                    <IconButton size={'sm'} aria-label="edit image" m={2} as={FiEdit} colorScheme="blue" p={1} onClick={() => {setIsEditing(prevState => !prevState)}}/>        
                    <IconButton size={'sm'} aria-label="edit image" m={2} as={HiOutlineTrash} colorScheme="red" p={1} onClick={removeImage}/>                            
                </Flex>
                <Flex justifyContent={'center'} flexDir={'column'} alignItems={'center'}>
                    <Flex flexDir={'column'} pos={'relative'} alignItems={'center'} maxH={'45vh'} maxW={'90%'}>
                        {!isLoaded && <Spinner pos={'absolute'} my={'20px'} size={'xl'}/>}                       
                        <Image onLoadingComplete={() => setIsLoaded(true)} style={{objectFit: 'contain', width: 'auto', height: '100%', maxHeight: '45vh', borderRadius: '5px'}} src={image.url} priority={true} width={1000} height={0} alt="nature image :)"/>
                        
                    </Flex>       
                    { 
                            image.tags.length > 0 && !isEditing && isLoaded && <HStack mt={'5px'} flexWrap={'wrap'} spacing={2} display={'flex'}>
                                {image.tags?.map((tag, i) => (
                                    <Tag key={i} size={['xs', 'sm']} p={1} py={[0.5, 1]} fontSize={['10px', '11px', '13px']} w={'fit-content'} colorScheme={tag.color}>{tag.name}</Tag>
                                    ))
                                }    
                            </HStack>
                        }

                        {                            
                            tags && isEditing &&  
                            <Flex mt={'5px'}>
                                <Select colorScheme="green" chakraStyles={chakraStyles} useBasicStyles={true} variant="outline" focusBorderColor="#7bae37" placeholder="Add a tag" options={(input !== '' && tags.filter(a => a.name !== input).length === tags.length) ? tags.map((tag) => {return {label: tag.name, value: tag.name}}).concat({label: `Create tag: ${input}`, value: input}) : tags.map((tag) => {return {label: tag.name, value: tag.name}})} inputValue={input} onInputChange={setInput} onChange={(e) => setData({...data, tags: e.map((a: any) => tags.find((k) => k.name === a.label) || {name: a.label, color: '', icon: null})})} value={data.tags.map((tag) => {return {label: tag.name, value: tag.name}})} isMulti/>
                            </Flex>                             
                        }                
                </Flex>
                <CardBody alignItems={'center'} justifyContent={'center'} w={'100%'} p={0} display={'flex'} fontSize={['sm', 'md']} flexDir={'column'} mb={'10px'} mt={'15px'} >                      
                    {isLoaded && (isEditing ? <Textarea w={'80%'} textAlign={'center'} fontSize={['xs', 'sm', 'md']} onChange={(e) => setData({...data, description: e.target.value})}>{image.description || "This image has no description."}</Textarea> : <Text textAlign={'center'} fontSize={['xs', 'sm', 'md']} w={'80%'}>{image.description || "This image has no description."}</Text>)}
                </CardBody>
                <CardFooter p={['10px', '20px']} flexDir={'column'} alignItems={'center'}>
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
                    {isEditing && <Button isDisabled={data === image ? true : false} size={['sm', 'md']} mt={'20px'} colorScheme="green" onClick={updateImage}>Save</Button>}
                </CardFooter>    
            </Card>
        </Flex>
    )
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
    try {
      const image_res = await axios.post(process.env.HOST ? `${process.env.HOST}/api/image` : 'http://localhost:3000/api/image', {id: ctx.params ? ctx.params.id : ""})
      const tags_res = await axios.get(process.env.HOST ? `${process.env.HOST}/api/tags` : 'http://localhost:3000/api/tags')
      const image = image_res.data
      const tags = tags_res.data
  
      return {
        props: {
          image,
          tags
        }
      }
      
    } catch (error) {

      return {
        notFound: true
      }
    }    
  }

export default ImagePage