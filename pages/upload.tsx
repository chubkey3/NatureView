import Uploader from '../components/Uploader'
import { Flex } from '@chakra-ui/react'


const Upload = () => {

    return (
        <Flex w={'100%'} h={'60vh'} justifyContent={'center'} alignItems={'center'} textAlign={'center'}>        
            <Uploader />
        </Flex>
    )
}

export default Upload;