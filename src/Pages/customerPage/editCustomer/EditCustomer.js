import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { TextField, Button, Container, Grid, Snackbar, Alert } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { deleteDetail, searchFilter } from '../../../apis/CustomerApi';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { useLoader } from '../../../context/LoaderContext';

export default function EditCustomer() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isDeleted, setIsDeleted] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const navigate = useNavigate();
  const [customerRef, setCustomerRef] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [branch, setBranch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { showLoader, hideLoader } = useLoader();
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  useEffect(() => {
    fetchData();
  }, [currentPage, itemsPerPage]);

  const handleError = (error) => {
    console.error('Error occurred:', error);
    setAlert({
      open: true,
      message: error?.response?.data?.message || error?.message || 'An unexpected error occurred',
      severity: 'error'
    });
  };

  const fetchData = async () => {
    try {
      showLoader();
      await searchFilter(
        { startDate, endDate, branch, customerName, customerRef, currentPage, itemsPerPage },
        setData,
        showLoader,
        handleError
      );
    } catch (error) {
      handleError(error);
    } finally {
      hideLoader();
    }
  };


 
  const editDetail = (detail) => {
    try {
      if (!detail?.customerReferenceNumber) {
        throw new Error('Invalid customer reference number');
      }
      navigate(`/Customer/${detail.customerReferenceNumber}`);
      setAlert({
        open: true,
        message: 'Navigating to edit customer...',
        severity: 'info'
      });
    } catch (error) {
      handleError(error);
    }
  };

  const handleDelete = async (crId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this customer?");
    if (confirmDelete) {
      try {
        if (!crId) {
          throw new Error('Invalid customer reference number for deletion');
        }
        showLoader();
        await deleteDetail(crId, setIsDeleted, handleError);
        setAlert({
          open: true,
          message: 'Customer deleted successfully',
          severity: 'success'
        });
        await fetchData(); // Refresh the data after deletion
      } catch (error) {
        handleError(error);
      } finally {
        hideLoader();
      }
    }
  };

  const paginate = (items) => {
    setItemsPerPage(items);
    setCurrentPage(0);
  };

  const handleSearch = () => {
    setCurrentPage(0);
    fetchData();
  };

  return (
    <div>
      <div className="editContainer">
        <h2>Search and Filter</h2>
        <div style={{display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:"18px", padding:"25px"}}>
          <Grid item xs={4}>
            <TextField
              size="small"
              className="custom-text-field"
              name="customerRef"
              value={customerRef}
              onChange={(e) => setCustomerRef(e.target.value)}
              label="Customer Reference No"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              size="small"
              className="custom-text-field"
              name="branch"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              label="Branch"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              size="small"
              className="custom-text-field"
              name="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              label="Customer Name"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              size="small"
              type="datetime-local"
              className="custom-text-field"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              label="Start Date"
              InputLabelProps={{
                shrink: true,
                className: startDate ? 'label-focused' : 'label-default',
              }}
              inputProps={{
                placeholder: startDate ? "" : "dd-mm-yyyy",
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              className='custom-text-field'
              size="small"
              type="datetime-local"
              value={endDate}
              InputLabelProps={{
                shrink: true,
                className: endDate ? 'label-focused' : 'label-default',
              }}
              inputProps={{
                placeholder: endDate ? "" : "dd-mm-yyyy",
              }}
              onChange={(e) => setEndDate(e.target.value)}
              label="End Date"
            />
          </Grid>
        </div>

        <Button 
          onClick={handleSearch} 
          style={{width:"15%", margin:"1rem 2rem", color:"white", backgroundColor:"#03C9D7"}} 
          variant="contained"
        >
          Search
        </Button>

        <TableContainer component={Paper} className="table-container">
          <Table sx={{ minWidth: 500 }} aria-label="customized table">
            <TableHead className="table-header">
              <TableRow>
                <TableCell>Sr No</TableCell>
                <TableCell align="right">Reference Number</TableCell>
                <TableCell align="right">Name</TableCell>
                <TableCell align="right">Branch</TableCell>
                <TableCell align="right">Inserted On</TableCell>
                <TableCell align="right">Last Updated On</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            {data?.length ? (
              <TableBody>
                {data?.map((row, index) => (
                  <TableRow key={index} className="table-row">
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell align="right">{row.customerReferenceNumber}</TableCell>
                    <TableCell align="right">{row.customerName}</TableCell>
                    <TableCell align="right">{row.branch}</TableCell>
                    <TableCell align="right">{row.insertedOn}</TableCell>
                    <TableCell align="right">{row.lastUpdatedOn}</TableCell>
                    <TableCell align="right">
                      <Button
                        onClick={() => editDetail(row)}
                        style={{ minWidth: 'unset', padding: '6px' }}
                        title="Edit Customer"
                      >
                        <EditIcon style={{ color: '#03C9D7' }} />
                      </Button>
                      <Button
                        style={{ minWidth: 'unset', padding: '6px' }}
                        onClick={() => handleDelete(row.customerReferenceNumber)}
                        title="Delete Customer"
                      >
                        <DeleteIcon style={{ color: 'red' }} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            ) : (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={7} style={{ textAlign: 'center' }}>
                    No More Data Found!
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
          <hr style={{ border: '1px solid lightGray' }} />

          <div className="pagination-container">
            <label className="pagination-label">Items Per Page:</label>
            <select 
              value={itemsPerPage} 
              onChange={(e) => paginate(Number(e.target.value))} 
              className="pagination-select"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>

            <label className="pagination-label">Select Page:</label>
            <button 
              className="pagination-button" 
              disabled={currentPage <= 0} 
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <KeyboardDoubleArrowLeftIcon style={{ height: '0.9rem', marginTop:'0.1rem' }} />
            </button>
            <span className="pagination-span">{currentPage + 1}</span>
            <button 
              className="pagination-button" 
              disabled={data.length < itemsPerPage} 
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <KeyboardDoubleArrowRightIcon style={{ height: '0.9rem', marginTop:'0.1rem' }} />
            </button>
          </div>
          <hr style={{ border: '1px solid lightGray' }} />
        </TableContainer>
      </div>

      {/* Alert Messages */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.severity}
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
