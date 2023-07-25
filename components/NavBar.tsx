import { Flex, Box, IconButton } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { BsTreeFill } from 'react-icons/bs'
import { FiUpload } from 'react-icons/fi' 
const NavBar = () => {
    const router = useRouter()

    const redirect = (pathname: string) => {
        if (router.pathname !== pathname) {
            router.push(pathname)
        }
    }

    return (
       <Flex position={'fixed'} bottom={0} bgColor={'white'} w={'100vw'} h={'80px'} zIndex={999} overflow={'hidden'} justifyContent={'center'}>
            <Flex w={'100%'} maxW={'600px'} h={'100%'} justifyContent={'space-around'} alignItems={'center'}>
                <IconButton _hover={{bgColor: 'green.300'}} bgColor={router.pathname === "/" ? 'green.500' : 'transparent'} color={router.pathname === "/" ? 'white' : 'black'} size={'lg'} p={2} fontSize={'30px'} as={BsTreeFill} aria-label='home' onClick={() => redirect("/")}/>
                <IconButton _hover={{bgColor: 'green.300'}} bgColor={router.pathname === "/upload" ? 'green.500' : 'transparent'} color={router.pathname === "/upload" ? 'white' : 'black'} size={'lg'} p={2} fontSize={'30px'} as={FiUpload} aria-label='upload' onClick={() => redirect("/upload")}/>
            </Flex>
       </Flex>
    )
}

export default NavBar