import { Button, Card, CardBody, CardFooter, Flex, HStack, Icon, IconButton, Skeleton, Spinner, Tag, Text, Textarea, useToast } from "@chakra-ui/react"
import { Image as ImageSchema, Tag as TagSchema } from "@prisma/client"
import axios from "axios"
import { GetServerSideProps, NextPage } from "next"
import Image from "next/image"
import { useRouter } from "next/router"
import { BsFillPersonFill } from "react-icons/bs"
import { FiEdit } from 'react-icons/fi'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { BiTime } from 'react-icons/bi'
import { useCallback, useEffect, useState } from "react"
import { HiOutlineTrash } from 'react-icons/hi'
import { ChakraStylesConfig, Select } from "chakra-react-select"

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
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [data, setData] = useState<ImageSchemaWithTags>(image)
    const [input, setInput] = useState<string>("")
    const [tags, setTags] = useState<TagSchema[]>()

    const chakraStyles: ChakraStylesConfig = {
        menu: (provided) => ({
            ...provided,
            maxH: '120px',
            overflowY: 'auto',                 
                             
        }),
        clearIndicator: (provided) => ({
            ...provided,
            display: 'none'
                    
        }),
        placeholder: (provided) => ({
            ...provided,
            color: 'rgba(39, 103, 73, 0.7)',
        }),
        container: (provided) => ({
            ...provided,
            borderColor: 'rgba(30, 130, 0, 0.5)'                      
        }),
        indicatorsContainer: (provided) => ({
            ...provided,
            maxWidth: '30px',     
            backgroundColor: 'green.300'                   
        }),
        downChevron: (provided) => ({
            ...provided,
            color: 'green.800'
        }),
        multiValueRemove: (provided) => ({
            ...provided,                       
            fontSize: 'md',
            width: '10px',
            height: '10px',            
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            fontSize: 'xs',                 
        })        
    }

    useEffect(() => {
        axios.get('/api/tags')
        .then((res) => setTags(res.data))
    }, [])

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

    }, [image, router, toast, data])

    return (
        <Flex justifyContent={'center'} alignItems={'center'} flexDir={'column'}>            
            {/*<Flex w={'60%'} minW={'300px'}>
                <IconButton aria-label="back buttton" as={IoMdArrowRoundBack} colorScheme="green" ml={1} size={'xs'} onClick={() => router.push('/')}/>                
    </Flex>*/}
            <Card w={'60%'} mt={['10px', '20px']} display={'flex'}  minW={'300px'} mb={'100px'}>        
                <Flex alignSelf={['initial', 'end']} justifyContent={'space-between'} mb={2} mt={1}>
                    <IconButton size={'sm'} aria-label="edit image" m={2} as={FiEdit} colorScheme="blue" p={1} onClick={() => {setIsEditing(prevState => !prevState)}}/>        
                    <IconButton size={'sm'} aria-label="edit image" m={2} as={HiOutlineTrash} colorScheme="red" p={1} onClick={removeImage}/>                            
                </Flex>
                <Flex justifyContent={'center'}>
                    <Flex flexDir={'column'} w={['80%', '60%']} pos={'relative'} alignItems={'center'} justifyContent={'center'} maxH={['40vh', '50vh']}>
                        {!isLoaded && <Spinner pos={'absolute'} my={'20px'} size={'xl'}/>}
                        {/*<Skeleton w={'100%'} h={'100%'} pos={'absolute'} isLoaded={isLoaded}/>*/}
                        <Image onLoadingComplete={() => setIsLoaded(true)} style={{objectFit: 'contain', width: 'auto', height: '100%', borderRadius: '5px'}} src={image.url} priority={true} width={1000} height={0} alt="nature image :)"/>
                        { 
                            image.tags.length > 0 && !isEditing && <HStack pt={'10px'} pb={'20px'} flexWrap={'wrap'} spacing={2} mb={['10px', '20px']} display={'flex'}>
                                {image.tags?.map((tag, i) => (
                                    <Tag key={i} size={['xs', 'sm']} p={1} py={[0.5, 1]} fontSize={['8px', '11px', '13px']} w={'fit-content'} colorScheme={tag.color}>{tag.name}</Tag>
                                    ))
                                }    
                            </HStack>
                        }

                        {                            
                            tags && isEditing &&  
                            <Flex>
                                <Select colorScheme="green" chakraStyles={chakraStyles} useBasicStyles={true} variant="outline" focusBorderColor="#7bae37" placeholder="Add a tag" options={(input !== '' && tags.filter(a => a.name !== input).length === tags.length) ? tags.map((tag) => {return {label: tag.name, value: tag.name}}).concat({label: `Create tag: ${input}`, value: input}) : tags.map((tag) => {return {label: tag.name, value: tag.name}})} inputValue={input} onInputChange={setInput} onChange={(e) => setData({...data, tags: e.map((a: any) => tags.find((k) => k.name === a.label) || {name: a.label, color: '', icon: null})})} value={data.tags.map((tag) => {return {label: tag.name, value: tag.name}})} isMulti/>
                            </Flex>                             
                        }   
                    </Flex>                    
                </Flex>
                <CardBody   alignItems={'center'} w={'100%'} p={0} mt={'30px'} display={'flex'} fontSize={['sm', 'md']} flexDir={'column'}>                      
                    {isLoaded && (isEditing ? <Textarea textAlign={'center'} fontSize={['xs', 'sm', 'md']} onChange={(e) => setData({...data, description: e.target.value})}>{image.description || "This image has no description."}</Textarea> : <Text fontSize={['xs', 'sm', 'md']} mt={'10px'}>{image.description || "This image has no description."}</Text>)}
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
                    {isEditing && <Button isDisabled={data === image ? true : false} size={['sm', 'md']} mt={'10px'} colorScheme="green" onClick={updateImage}>Save</Button>}
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