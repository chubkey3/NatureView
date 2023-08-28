import { AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, Flex, IconButton, Input, InputGroup, InputRightAddon, useMediaQuery } from "@chakra-ui/react"
import { Dispatch, SetStateAction, useRef } from "react"
import { AiOutlineSearch } from "react-icons/ai"
import { IoFilter } from 'react-icons/io5'

type Props = {
    search: string,
    setSearch: Dispatch<SetStateAction<string>>,
    dateQuery: {
        month: string,
        year: string
    } | undefined,
    setDateQuery: Dispatch<SetStateAction<{month: string, year: string} | undefined>>,
    isOpen: boolean,
    onOpen: () => void,
    onClose: () => void
}


const ImageFilter = ({search, setSearch, dateQuery, setDateQuery, isOpen, onOpen, onClose}: Props) => {
    
    const isMobile = useMediaQuery('(min-width: 1000px)', {ssr: true, fallback: false})
    const cancelRef = useRef(null)
    
    return (
        <>
        {isMobile[0] ? 
            <Flex pos={['relative', 'relative', 'absolute']} top={['initial', 'initial', 0]} right={['initial', 'initial', 0]} mr={['initial', 'initial', '50px']} mt={['initial', 'initial', '30px']}>             
             <Input value={dateQuery && dateQuery.month ? `${dateQuery.year}-${dateQuery?.month.length === 1 ? '0' + dateQuery.month : dateQuery.month}` : undefined} type={'month'} size={['sm', 'md', 'lg']} mr={'30px'} onChange={(e) => setDateQuery({month: e.target.value.split('-')[1], year: e.target.value.split('-')[0]})}/>
             <InputGroup size={['sm', 'md', 'lg']}>
               <Input borderColor={'gray.300'} value={search} onChange={(e) => setSearch(e.target.value)}/>
               <InputRightAddon bgColor={'green.500'} color={'white'}>
                 <AiOutlineSearch fontSize={'20px'}/>        
               </InputRightAddon>
             </InputGroup>       
           </Flex>
            :               
            <IconButton as={IoFilter} aria-label="filter" p={1} colorScheme={'green'} pos={'absolute'} top={0} right={0} mr={['20px', '30px', '40px']} mt={'28px'} onClick={onOpen}/>
            }
            <AlertDialog isOpen={isOpen} onClose={() => {setSearch(""); setDateQuery(undefined); onClose()}} leastDestructiveRef={cancelRef}>
                <AlertDialogOverlay>
                    <AlertDialogContent w={'80%'}>
                    <AlertDialogCloseButton/>
                    <AlertDialogHeader>Filter</AlertDialogHeader>

                    <AlertDialogBody>
                        <Flex flexDir={'column'}>
                        <InputGroup size={['sm', 'md', 'lg']}>
                            <Input borderColor={'gray.300'} value={search} onChange={(e) => setSearch(e.target.value)}/>
                            <InputRightAddon bgColor={'green.500'} color={'white'}>
                            <AiOutlineSearch fontSize={'20px'}/>        
                            </InputRightAddon>
                        </InputGroup>  
                        <Input value={dateQuery && dateQuery.month ? `${dateQuery.year}-${dateQuery?.month.length === 1 ? '0' + dateQuery.month : dateQuery.month}` : undefined} mt={'20px'} type={'month'} size={['sm', 'md', 'lg']} mr={'30px'} onChange={(e) => setDateQuery({month: e.target.value.split('-')[1], year: e.target.value.split('-')[0]})}/>     
                        </Flex>
                    </AlertDialogBody>

                    <AlertDialogFooter justifyContent={'space-around'}>
                        <Button ref={cancelRef} colorScheme={'red'} onClick={() => {setSearch(""); setDateQuery(undefined); onClose()}}>
                        Clear
                        </Button>
                        <Button onClick={onClose} colorScheme={'green'}>
                        Search
                        </Button>            
                    </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
}

export default ImageFilter