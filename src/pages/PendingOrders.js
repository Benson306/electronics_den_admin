import React, { useState, useEffect } from 'react'

import PageTitle from '../components/Typography/PageTitle'
import SectionTitle from '../components/Typography/SectionTitle'
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
  Button,
  Pagination,
} from '@windmill/react-ui'
import { EditIcon, TrashIcon } from '../icons'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function PendingOrders() {
  /**
   * DISCLAIMER: This code could be badly improved, but for the sake of the example
   * and readability, all the logic for both table are here.
   * You would be better served by dividing each table in its own
   * component, like Table(?) and TableWithActions(?) hiding the
   * presentation details away from the page view.
   */

  // setup pages control for every table
  const [pageTable, setPageTable] = useState(1)
  const [page, setPage] = useState(1)
  const [data, setData] = useState([])

  // setup data for every table
  const [loading, setLoading] = useState(true)

  // pagination setup
  const resultsPerPage = 10

  const [totalResults, setTotalResults] = useState(0);

  // pagination change control
  function onPageChangeTable(p) {
    setPageTable(p)
  }
  // on page change, load new sliced data
  // here you would make another server request for new data
  // useEffect(() => {
    

  // }, [pageTable])

  useEffect(()=>{
    fetch(`${process.env.REACT_APP_API_URL}/api/GetPendingOrders`)
    .then( data => data.json())
    .then( data => { 
      //setDeliveredOrders(data); 
      setTotalResults(data.length);
      setData(data.reverse().slice((page - 1) * resultsPerPage, page * resultsPerPage))
      setLoading(false)
    } )
    .catch( err => { console.log(err) })
  },[data])

  const handleUpdate = (id) =>{
    fetch(`${process.env.REACT_APP_API_URL}/api/update_delivery/${id}`,{
      method: 'PUT'
    })
    .then(response => response.json())
    .then( response => {
      if(response == 'success'){
        toast('Success',{
          type:'success'
        })
      }else{
        toast('Failed',{
          type:'error'
        })
      }
    })
    .catch(err => {console.log(err)})
  }

  return (
    <>
    <ToastContainer />
      <PageTitle>Pending Orders</PageTitle>
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Client Details</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Delivery Location</TableCell>
              <TableCell>Delivery Cost</TableCell>
              <TableCell>Items Cost</TableCell>
              <TableCell>Order Date</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {
            loading ? <TableCell>Loading...</TableCell> :

            data.length === 0 ? <TableCell>No Records</TableCell> :
            
            data.reverse().map((dt, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center text-sm">
                    {/* <Avatar className="hidden mr-3 md:block" src={user.avatar} alt="User avatar" /> */}
                    <div>
                      <p className="font-semibold">{dt.email}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{dt.phone_number}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                    <div className="flex items-center text-xs">
                        <div>
                        {
                            dt.items.map( item => <p className="text-xs text-gray-600 dark:text-gray-400">{item.productName} X {item.quantity}</p>)
                        }
                        
                        </div>
                    </div>
                </TableCell>
                <TableCell>
                  <span className="text-xs">{dt.deliveryLocation}</span>
                </TableCell>
                <TableCell>
                  <span className="text-xs">Ksh. { dt.delivery_cost }</span>
                </TableCell>
                <TableCell>
                  <span className="text-xs">Ksh. {Math.floor(dt.total_price) }</span>
                </TableCell>
                <TableCell>
                  <span className="text-xs">{ dt.order_date }</span>
                </TableCell>
                <TableCell>
                  <Button layout="outline" onClick={()=> handleUpdate(dt._id)}>Mark As Delivered</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            onChange={onPageChangeTable}
            label="Table navigation"
          />
        </TableFooter>
      </TableContainer>

     
    </>
  )
}

export default PendingOrders
