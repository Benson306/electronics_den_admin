import React, { useContext, useEffect, useState } from 'react'
import PageTitle from '../components/Typography/PageTitle'
import {
    Table,
    TableHeader,
    TableCell,
    TableBody,
    TableRow,
    TableFooter,
    TableContainer,
    Pagination,
    Label, Input,
    Modal, ModalHeader, ModalBody, ModalFooter, Button
  } from '@windmill/react-ui'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../context/AuthContext';
import useAuthCheck from '../utils/useAuthCheck';

function ManageCategories() {
    const [data, setData] = useState([]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState(null);
    const [editId, setEditId] = useState(null);
    const [change, setChange] = useState(false);
    const [subCategories, setSubCategories] = useState(['']);

    const { token } = useContext(AuthContext);

    useAuthCheck();

    useEffect(()=>{
        fetch(`${process.env.REACT_APP_API_URL}/get_categories`,{
          headers: {
            'Authorization':`Bearer ${token}`
          }
        })
        .then( response => {
            if(response.ok){
                response.json().then(res => {
                    setData(res);
                    setLoading(false);
                })
            }else{
                setError(true);
                setLoading(false);
            }
        })
        .catch(err => {
            setError(true);
            setLoading(false);
        })
    }, [change])

    const handleSubmit = () => {
        if(category == null){
            toast("All fields must be filled",{
                type:'error'
              });
            return;
        }

        fetch(`${process.env.REACT_APP_API_URL}/add_category`,{
            method:'POST',
            headers: {
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`
            },
            body: JSON.stringify({
                category,
                sub_categories: subCategories
            })
        })
        .then(response => {
            if(response.ok){
                response.json().then(res => {
                    toast('Success',{
                        type:'success'
                      });
                    setChange(!change);
                    closeModal();
                })
            }else{
                toast("Category already exists",{
                    type:'error'
                  });
            }
        })
    }

    const handleDelete = (id) => {
        fetch(`${process.env.REACT_APP_API_URL}/del_category/${id}`,{
            method:'DELETE',
            headers:{
              'Authorization':`Bearer ${token}`
            }
        })
        .then((res)=>{
            if(res.ok){
                toast('Success',{
                    type:'success'
                  });
                setChange(!change);
            }else{
                toast("category already exists",{
                    type:'error'
                  });
            }
        })
    }

    const [isModalOpen, setIsModalOpen] = useState(false)

    function openModal() {
        setIsModalOpen(true)
    }

    function closeModal() {
        setCategory(null);
        setSubCategories(['']);
        setIsModalOpen(false)
    }

    const [isEditModalOpen, setEditModalOpen] = useState(false)

    function openEditModal() {
        setEditModalOpen(true)
    }

    function closeEditModal() {
        setCategory(null);
        setSubCategories(['']);
        setEditModalOpen(false)
    }

    const handleEdit = () => {
        fetch(`${process.env.REACT_APP_API_URL}/edit_category/${editId}`,{
            method:'PUT',
            headers: {
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`
            },
            body: JSON.stringify({
                category,
                sub_categories: subCategories
            })
        })
        .then((res)=>{
            if(res.ok){
                toast('Success',{
                    type:'success'
                  });
                setChange(!change);
                closeEditModal();
            }else{
                toast("Server error",{
                    type:'error'
                  });
            }
        })
    }

    const [search, setSearch] = useState(null);

    const filteredData = data.filter((item)=>{
                    
        if(search === '' || search === null){
            return item;
        }else if(
            item.category.toLowerCase().includes(search.toLowerCase())
        ){
            return item;
        }
    })

    const addSubCategoriesInput = () => {
      setSubCategories([...subCategories, '']);
    };
  
    const updateSubCategories = (index, value) => {
      const newSubCategories = [...subCategories];
      newSubCategories[index] = value;
      setSubCategories(newSubCategories);
    };
  
    // Remove a specific chassis number input field
    const removeSubCategoriesInput = (index) => {
      if (subCategories.length > 1) {
        const newSubCategories = subCategories.filter((_, i) => i !== index);
        setSubCategories(newSubCategories);
      }
    };

  return (
    <div>
      <PageTitle>Manage Categories</PageTitle>
      <ToastContainer />

      <div className="flex mr-5 mb-5 justify-between">
        <input type="text" 
            placeholder='Search ...' 
            className='p-2 rounded-lg bg-transparent border border-gray-300 dark:border-gray-500 text-black dark:text-gray-500' 
            onChange={(e)=> e.target.value === "" ? setSearch(null) : setSearch(e.target.value)}
        />
        <Button onClick={openModal}>Add new category</Button>
      </div>

      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Category</TableCell>
              <TableCell>Sub Categories</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {
            
            loading ? <TableCell>Loading...</TableCell> :

            filteredData.length === 0 ? <TableCell>No Records</TableCell> :
            
            filteredData.map((dt, i) => (
              <TableRow key={i}>
                <TableCell>
                  <span className="text-sm">{dt.category}</span>
                </TableCell>
                <TableCell>
                  <div className='flex gap-2'>
                    {
                      dt.sub_categories.map(sub => (
                        <div className='bg-gray-200 px-2 py-1 text-xs rounded-md'>{sub}</div>
                      ))
                    }
                  </div>
                    
                </TableCell>
                <TableCell>
                    <div className='flex gap-4'>
                        <button onClick={e => {
                            e.preventDefault();
                            setEditId(dt._id);
                            setCategory(dt.category);
                            setSubCategories(dt.sub_categories)
                            openEditModal();
                            //handle(dt._id);
                        }} className='text-xs p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white'>Edit</button>
                        <button onClick={e => {
                            e.preventDefault();
                            handleDelete(dt._id);
                        }} className='text-xs p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white'>Delete</button>
                    </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableFooter>
        </TableFooter>
      </TableContainer>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader>Add Category</ModalHeader>
        <ModalBody>

        <Label>
          <span>Category</span>
          <Input className="mt-1" type="text" placeholder="Category" onChange={e => setCategory(e.target.value)} required/>
        </Label>

        <Label className="mt-2">
          <span>Sub Categories</span>
          {subCategories.map((sub, index) => (
            <div key={index} className="flex mb-4 items-center">
              <Input
                type="text"
                placeholder={`Enter Sub Category ${index + 1}`}
                value={sub}
                onChange={(e) => updateSubCategories(index, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <button
                type="button"
                onClick={() => removeSubCategoriesInput(index)}
                className="ml-1 text-red-500 flex items-center justify-center p-1 text-sm"
                disabled={subCategories.length === 1} // Disable if it's the last input
              >
                X
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addSubCategoriesInput}
            className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded-md mb-4 text-xs"
          >
            + Add Sub Categories
          </button>
        </Label>

        </ModalBody>
        <ModalFooter>
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

      <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
        <ModalHeader>Edit Category</ModalHeader>
        <ModalBody>

        <Label>
          <span>Category</span>
          <Input className="mt-1" type="text" placeholder="category" value={category} onChange={e => setCategory(e.target.value)} required/>
        </Label>

        <Label className="mt-2">
          <span>Sub Categories</span>
          {subCategories.map((sub, index) => (
            <div key={index} className="flex mb-4 items-center">
              <Input
                type="text"
                placeholder={`Enter Sub Category ${index + 1}`}
                value={sub}
                onChange={(e) => updateSubCategories(index, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <button
                type="button"
                onClick={() => removeSubCategoriesInput(index)}
                className="ml-1 text-red-500 flex items-center justify-center p-1 text-sm"
                disabled={subCategories.length === 1} // Disable if it's the last input
              >
                X
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addSubCategoriesInput}
            className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded-md mb-4 text-xs"
          >
            + Add Sub Categories
          </button>
        </Label>

        </ModalBody>
        <ModalFooter>
          <div className="hidden sm:block">
            <Button layout="outline" onClick={closeEditModal}>
              Cancel
            </Button>
          </div>
          <div className="hidden sm:block" onClick={handleEdit}>
            <Button>Submit</Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" layout="outline" onClick={closeEditModal}>
              Cancel
            </Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" onClick={handleEdit}>
              Submit
            </Button>
          </div>
        </ModalFooter>
      </Modal>

    </div>
  )
}

export default ManageCategories