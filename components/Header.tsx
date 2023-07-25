import Head from "next/head"
import { useRouter } from "next/router"
import { Flex, Heading } from "@chakra-ui/react"
import Image from "next/image"


const Header = () => {
    const router = useRouter()
    
    return (
        <>
            <Head>
                <title>NatureView</title>
                <meta name="description" content="A Website to View Snapshots of Nature" />
                <link rel="icon" href="/logo.svg" />
            </Head>
            <Flex alignSelf={'start'} alignItems={'center'} pl={'2.0rem'} pb={'2rem'} pt={'1.5rem'}>
                <Flex alignItems={'center'} cursor={'pointer'} onClick={() => router.push('/')}>
                    <Image priority={true} loading={'eager'} src={'/logo.svg'} width={50} height={50} alt={"NatureView Logo"}/>
                    <Heading ml={2} fontSize={'2xl'} fontWeight={'bold'} color={'green.700'}>NatureView</Heading>
                </Flex>
            </Flex>
        </>
    )
}

export default Header