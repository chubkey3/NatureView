import { Button, Card, CardBody, CardFooter, CardHeader, Checkbox, Divider, Flex, FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react"
import { Tag } from "@prisma/client"
import axios from "axios"
import { Select } from "chakra-react-select"
import { GetServerSideProps, NextPage } from "next"
import { useCallback, useEffect, useRef, useState } from "react"
import chakraStyles from "../util/ChakraStyles"

type Props = {
    tags: Tag[]
}

const Slideshow: NextPage<Props> = ({ tags }) => {

    const [config, setConfig] = useState<string[] | Date | boolean>(true)
    const [error, setError] = useState<boolean>(false)
    const [input, setInput] = useState<string>("")

    const InputDateRef = useRef<HTMLInputElement>(null)

    const start = useCallback(() => {
        if ((typeof config === 'boolean' && !config) || (config instanceof Date && isNaN(config.getSeconds()))){
            setError(true)
            return
        }

        if (config instanceof Date) {
            alert('date!')
        } else if (typeof config === 'object') {
            alert('string!')
        } else if (typeof config === 'boolean') {
            alert('boolean!')
        }

    }, [config])

    useEffect(() => {
        if (!(config instanceof Date) && InputDateRef.current) {
            InputDateRef.current.value = ""    
        }
        setError(false)
    }, [config])

    return (
        <Flex flexDir={'column'} alignItems={'center'}>        
            <Card alignItems={'center'} p={3}>        
                <CardHeader fontSize={'xl'} fontWeight={'bold'} color={'green.700'}>Configure</CardHeader>
                {/**icon */}
                <CardBody>
                    <FormControl isInvalid={error}>
                        <FormLabel>Random</FormLabel>
                        <Checkbox isChecked={typeof config === 'boolean' && config} onChange={(e) => setConfig(e.target.checked)} value={typeof config !== 'boolean' ? 'false' : JSON.stringify(config)}/>
                        <Divider my={3}/>
                        <FormLabel>By Tags</FormLabel>                  
                        <Select colorScheme="green" chakraStyles={chakraStyles} useBasicStyles={true} variant="outline" focusBorderColor="#7bae37" placeholder="Add a tag" options={tags.map((tag) => {return {label: tag.name, value: tag.name}})} inputValue={input} onInputChange={setInput} onChange={(e) => setConfig(e.map((a: any) => a.label))} value={typeof config !== 'object' ? '' : (Array.isArray(config) ? config.map((tag) => {return {label: tag, value: tag}}) : '')} isMulti/>                
                        <Divider my={3}/>
                        <FormLabel>By Date</FormLabel>
                        <Input type={'month'} onChange={(e) => setConfig(new Date(e.target.value))} ref={InputDateRef}/>                
                        <FormErrorMessage>Please select at least one option!</FormErrorMessage>
                    </FormControl>
                </CardBody>
                <CardFooter>
                    <Button colorScheme="green" type={'submit'} onClick={start}>Start!</Button>
                </CardFooter>
            </Card>
        </Flex>
    )
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
    try {
      const res = await axios.get(process.env.HOST ? `${process.env.HOST}/api/tags` : 'http://localhost:3000/api/tags')
      const tags = res.data
  
      return {
        props: {
          tags
        }
      }
      
    } catch (error) {
      return {
        notFound: true
      }
    }    
  }

export default Slideshow