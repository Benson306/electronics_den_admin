import React, { useState } from 'react'

import PageTitle from '../components/Typography/PageTitle'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from '@windmill/react-ui'
import { Input, HelperText, Label, Select, Textarea } from '@windmill/react-ui'

function Modals() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  function openModal() {
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
  }

  return (
    <>
      <PageTitle>Modals</PageTitle>

      <div>
        <Button onClick={openModal}>Open modal</Button>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader>Modal header</ModalHeader>
        <ModalBody>


        <Label>
          <span>Email</span>
          <Input className="mt-1" type="email" placeholder="JaneDoe@gmail.com" />
          { true && <HelperText value={false}>Your password is too short.</HelperText> }
        </Label>

        <Label className="mt-4">
          <span>Password</span>
          <Input className="mt-1" valid={true} type="password" placeholder="password" />
          <HelperText valid={false}>Your password is strong.</HelperText>
        </Label>

        <Label className="mt-4">
          <span>Confirm Password</span>
          <Input className="mt-1" valid={true} type="password" placeholder="password" />
          <HelperText valid={false}>Your password is strong.</HelperText>
        </Label>


        </ModalBody>
        <ModalFooter>
          {/* I don't like this approach. Consider passing a prop to ModalFooter
           * that if present, would duplicate the buttons in a way similar to this.
           * Or, maybe find some way to pass something like size="large md:regular"
           * to Button
           */}
          <div className="hidden sm:block">
            <Button layout="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
          <div className="hidden sm:block">
            <Button>Submit</Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" layout="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large">
              Accept
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  )
}

export default Modals
