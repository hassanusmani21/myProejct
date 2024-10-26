import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Grid, IconButton, Snackbar, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import "./CustomerForm.css";
import { useNavigate, useParams } from 'react-router-dom';
import { getCustomer, handleSubmit, handleUpdate } from '../../../apis/CustomerApi';
import { useLoader } from '../../../context/LoaderContext';

export default function Customer() {
  const navigate = useNavigate();
  let { rId } = useParams();
  const { showLoader, hideLoader } = useLoader();

  const [formData, setFormData] = useState({
    branch: '',
    customerName: '',
    customerDetail: [],
    insertedByUserId: '10223',
    lastUpdatedByUserId: '10223',
    insertedOn: '',
    lastUpdatedOn: ''
  });

  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    const fetchCustomer = async () => {
      if (rId !== undefined) {
        showLoader();
        try {
          await getCustomer(rId, setFormData, hideLoader, handleError);
        } catch (err) {
          handleError(err);
        } finally {
          hideLoader();
        }
      }
    };
    fetchCustomer();
  }, [rId]);

  const handleError = (error) => {
    setAlert({ 
      open: true, 
      message: error?.message || 'An error occurred', 
      severity: 'error' 
    });
    hideLoader();
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const newFormData = { ...formData };
    if (index === undefined) {
      newFormData[name] = value;
    } else {
      newFormData.customerDetail[index][name] = value;
    }
    setFormData(newFormData);
  };

  const handleAddCustomerDetail = () => {
    setFormData(prevState => ({
      ...prevState,
      customerDetail: [
        ...prevState.customerDetail,
        {
          customerAddress: '',
          contactPerson: '',
          designation: '',
          telephoneNos: '',
          eccNo: '',
          sstNo: '',
          cstNo: '',
          insertedByUserId: '10223',
          lastUpdatedByUserId: '10223',
          gstNo: '',
          industryId: '',
          panNo: ''
        }
      ]
    }));
  };

  const handleDeleteCustomerDetail = index => {
    const confirmDelete = window.confirm("Are you sure you want to delete this customer detail?");
    if (confirmDelete) {
      showLoader();
      try {
        setFormData(prevState => {
          const newCustomerDetail = [...prevState.customerDetail];
          newCustomerDetail.splice(index, 1);
          return { ...prevState, customerDetail: newCustomerDetail };
        });
        setAlert({ 
          open: true, 
          message: 'Customer detail deleted successfully', 
          severity: 'success' 
        });
      } finally {
        hideLoader();
      }
    }
  };

  const cancelUpdate = () => {
    const confirmCancel = window.confirm("Are you sure you want to cancel the update?");
    if (confirmCancel) {
      showLoader();
      try {
        navigate('/');
      } finally {
        hideLoader();
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    showLoader();
    try {
      const result = await handleSubmit(formData, hideLoader, handleError);
      setAlert({ 
        open: true, 
        message: 'Customer registered successfully', 
        severity: 'success' 
      });
      navigate(`/registerSuccess/${result}`);
    } catch (err) {
      handleError(err);
    } finally {
      hideLoader();
    }
  };

  const handleFormUpdate = async (e) => {
    e.preventDefault();
    showLoader();
    try {
      await handleUpdate(formData, hideLoader, handleError);
      setAlert({ 
        open: true, 
        message: 'Customer updated successfully', 
        severity: 'success' 
      });
      navigate(`/updateSuccess/${formData.customerReferenceNumber}`);
    } catch (err) {
      handleError(err);
    } finally {
      hideLoader();
    }
  };

  return (
    <Container className="container" sx={{ marginTop: "20px", backgroundColor: "rgb(250, 251, 251)" }}>
      <form onSubmit={!rId ? handleFormSubmit : handleFormUpdate}>
        <Grid container spacing={2}>
          <div className='card' style={{ width: '100%' }}>
            {!rId ? <h1>New Customer Registration :</h1> : <h1>Update Customer :</h1>}
            <Grid container spacing={2} alignItems="center">
              {rId && (
                <Grid item xs={4}>
                  <TextField
                    size="small"
                    name="customerReferenceNumber"
                    className="custom-text-field"
                    value={formData.customerReferenceNumber}
                    label="Customer Reference No"
                    InputLabelProps={{
                      shrink: Boolean(formData.customerReferenceNumber),
                    }}
                    autoFocus={!formData.customerReferenceNumber}
                  />
                </Grid>
              )}

              <Grid item xs={4}>
                <TextField
                  size="small"
                  name="branch"
                  className='custom-text-field'
                  value={formData.branch}
                  onChange={handleChange}
                  label="Branch"
                />
              </Grid>

              <Grid item xs={4}>
                <TextField
                  size="small"
                  className="custom-text-field"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  label="Customer Name"
                />
              </Grid>
            </Grid>
          </div>
          {formData?.customerDetail?.map((detail, index) => (
            <div className='card' key={index}>
              <h3>Customer Detail {index + 1}</h3>
              <Grid container spacing={2}>
                {/* ... (rest of the form fields) ... */}
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteCustomerDetail(index)}
                  >
                    Delete
                  </Button>
                </Grid>
              </Grid>
            </div>
          ))}
        </Grid>
        <Grid item xs={4}>
          <Button 
            className="add-btn" 
            sx={{ margin: "0rem 1rem 1rem 1rem" }} 
            onClick={handleAddCustomerDetail}
          >
            <AddIcon /> Add Customer Details
          </Button>
          {!rId ? (
            <Button 
              className="submit-btn" 
              sx={{ margin: "1rem 1rem 0rem 1rem" }} 
              type="submit" 
              variant="contained"
            >
              Submit
            </Button>
          ) : (
            <>
              <Button 
                className="update-btn" 
                sx={{ margin: "1rem 1rem 0rem 1rem" }} 
                variant="contained" 
                type="submit"
              >
                Update
              </Button>
              <Button 
                className="cancel-btn" 
                variant="contained" 
                onClick={cancelUpdate}
              >
                Cancel
              </Button>
            </>
          )}
        </Grid>
      </form>
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
    </Container>
  );
}
