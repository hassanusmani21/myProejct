import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { TextField, Button, Container, Grid, CircularProgress, Snackbar } from '@mui/material';
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
import useToken from '../../../contextApi/useToken';

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
  const token = useToken();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [currentPage, itemsPerPage]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      await searchFilter({ startDate, endDate, branch, customerName, customerRef, currentPage, itemsPerPage }, setData, setLoading, setError);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  const editDetail = (detail) => {
    navigate(`/Customer/${detail.customerReferenceNumber}`);
  };

  const handleDelete = async (crId) => {
    setLoading(true);
    setError(null);
    try {
      await deleteDetail(crId, setIsDeleted, setError);
      fetchData(); // Refresh the data after deletion
    } catch (err) {
      setError(err.message || 'An error occurred while deleting the customer');
    } finally {
      setLoading(false);
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

  if (loading) {
    return <CircularProgress />;
  }

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

        <Button onClick={handleSearch} style={{width:"15%", margin:"1rem 2rem", color:"white", backgroundColor:"#03C9D7"}} variant="contained">
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
                      <button onClick={() => editDetail(row)} style={{ margin: '0px 3px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}>
                        <EditIcon style={{ color: 'blue' }} />
                      </button>
                      <button style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }} onClick={() => handleDelete(row.customerReferenceNumber)}>
                        <DeleteIcon style={{ color: 'red' }} />
                      </button>
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
            <select value={itemsPerPage} onChange={(e) => paginate(Number(e.target.value))} className="pagination-select">
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>

            <label className="pagination-label">Select Page:</label>
            <button className="pagination-button" disabled={currentPage <= 0} onClick={() => setCurrentPage(currentPage - 1)}>
              <KeyboardDoubleArrowLeftIcon style={{ height: '0.9rem', marginTop:'0.1rem' }} />
            </button>
            <span className="pagination-span">{currentPage + 1}</span>
            <button className="pagination-button" disabled={data.length < itemsPerPage} onClick={() => setCurrentPage(currentPage + 1)}>
              <KeyboardDoubleArrowRightIcon style={{ height: '0.9rem', marginTop:'0.1rem' }} />
            </button>
          </div>
          <hr style={{ border: '1px solid lightGray' }} />
        </TableContainer>
      </div>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        message={error}
      />
    </div>
  );
}
