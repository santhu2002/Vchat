import React from 'react'
import { IconButton, Image, Text, useDisclosure, } from '@chakra-ui/react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button } from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'

const ProfileModel = ({user,children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
        { children ? (
            <span onClick={onOpen}>
                {children}
            </span>
        ):(
            <IconButton display={{base:"flex"}} icon={<ViewIcon/>} onClick={onOpen}/>
        )}
        <Modal size="lg"  isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            justifyContent="center"
            alignItems="center"
            fontSize="40px"
            fontFamily="Work Sans"
          >{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
          display="flex"
            flexDirection="column"
            justifyContent="space-between"
            alignItems="center"
          >
            <Image src={user.profilePic || user.pic} alt="Profile Pic" borderRadius="full" boxSize="160" mx="auto" />
            <Text fontSize={{ base: "15px", md: "20px" }}
            p="2"
              fontFamily="Work sans">Email:{user.email}</Text>

          </ModalBody>

            <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            </ModalFooter>

        </ModalContent>
      </Modal>

    </>

    
  )
}

export default ProfileModel