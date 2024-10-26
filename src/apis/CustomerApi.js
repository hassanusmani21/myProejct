import axiosInstance from "../axios/axiosInstance";
import moment from 'moment';

// submit data
export const handleSubmit = async (formData, hideLoader, handleError) => {
  try {
    const dateTime = moment().format('YYYY-MM-DD HH:mm:ss');

    if (formData.customerDetail && formData.customerDetail.length > 0) {
      formData.customerDetail[formData.customerDetail.length - 1].lastUpdatedOn = dateTime;
      formData.customerDetail[formData.customerDetail.length - 1].insertedOn = dateTime;
    } else {
      formData.insertedOn = dateTime;
      formData.lastUpdatedOn = dateTime;
    }

    const res = await axiosInstance.post(`/lens/customer/save`, formData);
    return res.data;
  } catch (error) {
    handleError({ message: error?.message || 'An error occurred while submitting the form' });
    throw error;
  }
};

// edit detail
export const editDetail = (detail, navigate) => {
  navigate(`/Customer/${detail.customerReferenceNumber}`);
};

// update data
export const handleUpdate = async (formData, hideLoader, handleError) => {
  try {
    const dateTime = moment().format('YYYY-MM-DD HH:mm:ss');

    if (formData.customerDetail && formData.customerDetail.length > 0) {
      formData.customerDetail[formData.customerDetail.length - 1].lastUpdatedOn = dateTime;
    } else {
      formData.lastUpdatedOn = dateTime;
    }

    const res = await axiosInstance.put(`lens/customer/Update`, formData);
    return res.data;
  } catch (error) {
    handleError({ message: error?.message || 'An error occurred while updating the form' });
    throw error;
  }
};

// get single data
export const getCustomer = async (rId, setFormData, hideLoader, handleError) => {
  try {
    if (!rId) {
      handleError({ message: 'Customer reference number is required' });
      return;
    }
    
    const res = await axiosInstance.get(`lens/customer/get?customerRefrenceNumber=${rId}`);
    
    if (!res.data) {
      handleError({ message: 'No customer data found' });
      return;
    }
    
    setFormData(res.data);
  } catch (error) {
    handleError({ message: error?.message || 'An error occurred while fetching customer data' });
    throw error;
  }
};

// delete data
export const deleteDetail = async (crId, setIsDeleted, handleError) => {
  try {
    await axiosInstance.delete(`lens/customer/delete?customerRefrenceNumber=${crId}`);
    setIsDeleted(true);
  } catch (error) {
    handleError({ message: error?.message || 'An error occurred while deleting the customer' });
    throw error;
  }
};

// Customer filter Search
export const searchFilter = async (searchParams, setData, showLoader, handleError) => {
  try {
    const { startDate, endDate, branch, customerName, customerRef, currentPage, itemsPerPage } = searchParams;

    const formattedStartDate = startDate ? moment(startDate).format('YYYY-MM-DD HH:mm:ss') : null;
    const formattedEndDate = endDate ? moment(endDate).format('YYYY-MM-DD HH:mm:ss') : null;

    let url = `lens/customer/getAllCustomerByFilter?`;
    if (formattedStartDate) url += `startDate=${formattedStartDate}&`;
    if (formattedEndDate) url += `endDate=${formattedEndDate}&`;
    if (branch) url += `branch=${branch}&`;
    if (customerName) url += `customerName=${customerName}&`;
    if (customerRef) url += `customerReferenceNumber=${customerRef}&`;
    url += `pageNo=${currentPage}&pageSize=${itemsPerPage}`;

    const res = await axiosInstance.get(url);
    setData(res.data);
  } catch (error) {
    handleError({ message: error?.message || 'An error occurred while searching' });
    throw error;
  }
};
