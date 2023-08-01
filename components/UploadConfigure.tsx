import { Flex, Radio, RadioGroup, Textarea } from "@chakra-ui/react"
import Image from "next/image"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { ChakraStylesConfig, Select } from 'chakra-react-select'
import { Tag } from "@prisma/client"

interface ImageOptionsChild {
    author: "JASON" | "CHRISTINA",
    tags: string[],
    description: string
}

interface ImageOptionsParent {
    [key: string] : ImageOptionsChild            
}


const UploadConfigure = ({img, tags, setOptionsParent}: {img: File, tags: Tag[], setOptionsParent: Dispatch<SetStateAction<ImageOptionsParent>>}) => {
    const [imgSrc, setImgSrc] = useState<string>("")    
    const [options, setOptions] = useState<ImageOptionsChild>({author: "JASON", tags: [], description: ""})
    const [input, setInput] = useState<string>("")

    useEffect(() => {
        const objectUrl = URL.createObjectURL(img)

        setImgSrc(objectUrl)

        return () => URL.revokeObjectURL(objectUrl)

    }, [img])    

    useEffect(() => {
        if (options) {
            setOptionsParent((prevState) => {return {...prevState, [img.name]: options}})
        }
        
    }, [options, setOptionsParent, img])

    
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
            borderColor: 'rgba(30, 130, 0, 0.5)',            
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

    return (

        <Flex minW={'200px'} p={3} flexDir={'column'} justifyContent={'space-between'} border={'2px solid rgb(134, 239, 172)'} borderRadius={'lg'} bgColor={'#dcfce7'} h={'100%'} maxH={['360px', '370px', '380px']} color={'green.700'}>                
            <Flex w={'100%'} h={['130px', '140px', '150px']} pos={'relative'} justifyContent={'center'} alignItems={'center'}>
                {imgSrc && <Image style={{borderRadius: '15px', objectFit: 'cover'}} loading={'eager'} src={imgSrc} fill alt={'User chosen image.'} />}
            </Flex>
            <Textarea _placeholder={{color: 'rgba(39, 103, 73, 0.7)'}} _focusVisible={{boxShadow: 'none', border: '2px solid', borderColor: 'rgba(30, 130, 0, 0.5)'}} boxShadow={'none'} _hover={{borderColor: 'rgba(30, 130, 0, 0.5)'}} border={'1px solid'} borderColor={'rgba(30, 130, 0, 0.5)'} colorScheme="facebook" placeholder="Add a description" value={options.description} onChange={(e) => setOptions({...options, description: e.target.value})}/>                               
            <Select colorScheme="green" chakraStyles={chakraStyles} useBasicStyles={true} variant="outline" focusBorderColor="#7bae37" placeholder="Add a tag" options={(input !== '' && tags.filter(a => a.name !== input).length === tags.length) ? tags.map((tag) => {return {label: tag.name, value: tag.name}}).concat({label: `Create tag: ${input}`, value: input}) : tags.map((tag) => {return {label: tag.name, value: tag.name}})} inputValue={input} onInputChange={setInput} onChange={(e) => setOptions({...options, tags: e.map((a: any) => a.label.replace('Create tag: ', ''))})} value={options.tags.map((tag) => {return {label: tag, value: tag}})} isMulti/>                
            <RadioGroup color={'green.700'} colorScheme={'whatsapp'} onChange={(e: "JASON" | "CHRISTINA") => setOptions({...options, author: e})} value={options.author} mb={'5%'}>
                <Radio borderColor={'green.700'} mr={'10px'} value='JASON'>Jason</Radio>
                <Radio borderColor={'green.700'} ml={'10px'} value='CHRISTINA'>Mom</Radio>
            </RadioGroup>
        </Flex>
    )

}

export default UploadConfigure