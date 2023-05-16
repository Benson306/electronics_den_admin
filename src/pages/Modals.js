import React, { useEffect, useState } from 'react'

import PageTitle from '../components/Typography/PageTitle'
import SectionTitle from '../components/Typography/SectionTitle'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from '@windmill/react-ui'
import { Input, HelperText, Label, Select, Textarea } from '@windmill/react-ui'
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Badge,
  Avatar,
  Pagination,
} from '@windmill/react-ui'


import { EditIcon, TrashIcon } from '../icons'

  const data = 
  [
    {
      email:"bnkimtai@gmail.com",
      phone:"0707357072"
    },
    {
      email: "123@gmail.com",
      phone:"0707357072"
    },
    {
      email:"bnkimtai@gmail.com",
      phone:"0707357072"
    },
    {
      email: "123@gmail.com",
      phone:"0707357072"
    }
  ]
  

function Modals() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  function openModal() {
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
  }


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confPassword, setConfPassword] = useState('');
  const [passLength, setPassLength] = useState(false);
  const [same, setSame] = useState(false);
  const [error, setError] = useState(false);

  useEffect(()=>{
    if(password.length > 7){
      setPassLength(true)
    }else{
      setPassLength(false);
    }

    if(password === confPassword){
      setSame(true);
    }else{
      setSame(false);
    }

  },[password])


  useEffect(()=>{
    
    if(password === confPassword){
      setSame(true);
    }else{
      setSame(false);
    }

    if(password.length > 7){
      setPassLength(true)
    }else{
      setPassLength(false);
    }

  },[confPassword])

  function handleSubmit(){

    if(same && passLength && email.length > 3){
      fetch('http://localhost:5000/add_user',{
        method: 'POST',
        data: { email, password }
      })
      .then(data => data.json())
      .then( data => {
        if(data === 'Added'){
            console.log('added')
            closeModal();
        }else{
          console.log('Not Added')
        }
      })
      .catch(err => console.log(err))
    }else{
      setError(true);
    }
    
  }

  return (
    <>
      <PageTitle>Manage Users</PageTitle>

      <div className="flex mr-5 mb-5 justify-end">
        <Button onClick={openModal}>Add A New User</Button>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader>Add User</ModalHeader>
        { error ? <HelperText valid={false}>Unable to Submit Form Due To errors in the fields below</HelperText> : <div></div>  }
        <ModalBody>


        <Label>
          <span>Email</span>
          <Input className="mt-1" type="email" placeholder="JaneDoe@gmail.com" onChange={e => setEmail(e.target.value)} required/>
        </Label>

        <Label className="mt-4">
          <span>Password</span>
          <Input className="mt-1" type="password" placeholder="password" onChange={e => setPassword(e.target.value)} required/>
          { passLength ? <div></div> : <HelperText valid={false}>Your password is too short.</HelperText> }
        </Label>

        <Label className="mt-4">
          <span>Confirm Password</span>
          <Input className="mt-1" type="password" placeholder="password" onChange={e => setConfPassword(e.target.value)} required />
          { same ? <div></div> : <HelperText valid={false}>Password Does Not Match.</HelperText>  }
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
          <div className="hidden sm:block" onClick={handleSubmit}>
            <Button>Submit</Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" layout="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </ModalFooter>
      </Modal>

      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Email</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {data.map((user, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <div>
                      <p className="font-semibold">{user.email}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{user.job}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.phone}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-4">
                    <Button layout="link" size="icon" aria-label="Edit">
                      <EditIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    <Button layout="link" size="icon" aria-label="Delete">
                      <TrashIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* <TableFooter>
          <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            onChange={onPageChangeTable2}
            label="Table navigation"
          />
        </TableFooter> */}
      </TableContainer>
    </>
  )
}

export default Modals
