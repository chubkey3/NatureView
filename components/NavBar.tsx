import { Flex, IconButton, useToast } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { FiUpload } from 'react-icons/fi' 
import { CgImage } from 'react-icons/cg'
import { RiSlideshow2Line } from 'react-icons/ri'

const NavBar = () => {
    const router = useRouter()
    const toast = useToast()

    const redirect = (pathname: string) => {
        if (router.pathname !== pathname) {
            router.push(pathname)
        }
    }

    return (
       <Flex position={'fixed'} bottom={0} bgColor={'white'} w={'100vw'} h={['60px', '80px']} zIndex={999} overflow={'hidden'} justifyContent={'center'}>
            <Flex w={'100%'} maxW={'600px'} h={'100%'} justifyContent={'space-around'} alignItems={'center'}>
                <IconButton  as={CgImage}  _hover={{bgColor: 'green.300'}} bgColor={router.pathname === "/" ? 'green.500' : 'transparent'} color={router.pathname === "/" ? 'white' : 'black'} size={'lg'} p={1.5} fontSize={'30px'} aria-label='home' onClick={() => redirect("/")}/>
                <IconButton  as={RiSlideshow2Line}  _hover={{bgColor: 'green.300'}} bgColor={router.pathname === "/slideshow" ? 'green.500' : 'transparent'} color={router.pathname === "/slideshow" ? 'white' : 'black'} size={'lg'} p={1.5} fontSize={'30px'} aria-label='slideshow' onClick={() => toast({title: 'Coming Soon!', description: 'Feature in progress! Come back later to try it out!', status: 'info', duration: 3000})}/>                
                <IconButton _hover={{bgColor: 'green.300'}} bgColor={router.pathname === "/upload" ? 'green.500' : 'transparent'} color={router.pathname === "/upload" ? 'white' : 'black'} size={'lg'} p={2} fontSize={'30px'} as={FiUpload} aria-label='upload' onClick={() => redirect("/upload")}/>
            </Flex>
       </Flex>
    )
}

export default NavBar