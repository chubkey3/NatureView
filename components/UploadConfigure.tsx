import { Flex, HStack, Radio, RadioGroup, Tag as TagComponent, Text, Textarea } from "@chakra-ui/react"
import { Tag } from "@prisma/client"
import axios from "axios"
import Image from "next/image"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Select } from 'chakra-react-select'

interface ImageOptionsChild {
    author: "JASON" | "CHRISTINA",
    tags: string[],
    description: string
}

interface ImageOptionsParent {
    [key: string] : ImageOptionsChild            
}


const UploadConfigure = ({img, setOptionsParent}: {img: File, setOptionsParent: Dispatch<SetStateAction<ImageOptionsParent>>}) => {
    const [imgSrc, setImgSrc] = useState<string>("")
    const [tags, setTags] = useState<Tag[]>([])
    const [options, setOptions] = useState<ImageOptionsChild>({author: "JASON", tags: [], description: ""})
    const [input, setInput] = useState<string>("")

    useEffect(() => {
        const objectUrl = URL.createObjectURL(img)

        setImgSrc(objectUrl)

        return () => URL.revokeObjectURL(objectUrl)

    }, [img])

    useEffect(() => {
        axios.get('/api/tags')
        .then((res) => setTags(res.data))
    }, [])

    useEffect(() => {
        if (options) {
            setOptionsParent((prevState) => {return {...prevState, [img.name]: options}})
        }
        
    }, [options, setOptionsParent, img])


    return (

        <Flex p={3} flexDir={'column'} justifyContent={'space-between'} border={'2px solid'} borderColor={'green.800'} borderRadius={'lg'} h={'100%'} color={'black'}>                
            {imgSrc && <Image style={{borderRadius: '15px'}} loading={'eager'} src={imgSrc} width={250} height={0} alt={'User chosen image.'} />}
            <Textarea _focusVisible={{boxShadow: 'none', border: '2px solid', borderColor: 'rgba(30, 130, 0, 0.5)'}} boxShadow={'none'} _hover={{borderColor: 'rgba(30, 130, 0, 0.5)'}} border={'1px solid'} borderColor={'rgba(30, 130, 0, 0.5)'} colorScheme="facebook" placeholder="Add a description" value={options.description} onChange={(e) => setOptions({...options, description: e.target.value})}/>                               
            <Select variant="outline" colorScheme="green" focusBorderColor="#7bae37" placeholder="Add a tag" options={(input !== '' && tags.filter(a => a.name !== input).length === tags.length) ? tags.map((tag) => {return {label: tag.name, value: tag.name}}).concat({label: `Create tag: ${input}`, value: input}) : tags.map((tag) => {return {label: tag.name, value: tag.name}})} inputValue={input} onInputChange={setInput} onChange={(e) => setOptions({...options, tags: e.map((a) => a.label.replace('Create tag: ', ''))})} value={options.tags.map((tag) => {return {label: tag, value: tag}})} isMulti/>                
            <RadioGroup colorScheme={'facebook'} onChange={(e: "JASON" | "CHRISTINA") => setOptions({...options, author: e})} value={options.author} mb={'10%'}>
                <Radio mr={'20px'} value='JASON'>Jason</Radio>
                <Radio ml={'20px'} value='MOM'>Mom</Radio>
            </RadioGroup>
        </Flex>
    )

}

export default UploadConfigure