import axiosInstance from "../axios/axiosInstance";
import moment from 'moment';

// submit data
export const handleSubmit = async (formData, setLoading, setError) => {
  setLoading(true);
  setError(null);
  const dateTime = moment().format('YYYY-MM-DD HH:mm:ss');

  if (formData.customerDetail && formData.customerDetail.length > 0) {
    formData.customerDetail[formData.customerDetail.length - 1].lastUpdatedOn = dateTime;
    formData.customerDetail[formData.customerDetail.length - 1].insertedOn = dateTime;
  } else {
    formData.insertedOn = dateTime;
    formData.lastUpdatedOn = dateTime;
  }

  try {
    const res = await axiosInstance.post(`/lens/customer/save`, formData);
    setLoading(false);
    return res.data;
  } catch (err) {
    setLoading(false);
    setError(err.message || 'An error occurred while submitting the form');
    throw err;
  }
};

// edit detail
export const editDetail = (detail, navigate) => {
  navigate(`/Customer/${detail.customerReferenceNumber}`);
};

// update data
export const handleUpdate = async (formData, setLoading, setError) => {
  setLoading(true);
  setError(null);
  const dateTime = moment().format('YYYY-MM-DD HH:mm:ss');

  if (formData.customerDetail && formData.customerDetail.length > 0) {
    formData.customerDetail[formData.customerDetail.length - 1].lastUpdatedOn = dateTime;
  } else {
    formData.lastUpdatedOn = dateTime;
  }

  try {
    const res = await axiosInstance.put(`lens/customer/Update`, formData);
    setLoading(false);
    return res.data;
  } catch (err) {
    setLoading(false);
    setError(err.message || 'An error occurred while updating the form');
    throw err;
  }
};

// get single data
export const getCustomer = async (rId, setFormData, setLoading, setError) => {
  setLoading(true);
  setError(null);
  try {
    const res = await axiosInstance.get(`lens/customer/get?customerRefrenceNumber=${rId}`);
    setFormData(res.data);
    setLoading(false);
  } catch (err) {
    setLoading(false);
    setError(err.message || 'An error occurred while fetching customer data');
    throw err;
  }
};

// delete data
export const deleteDetail = async (crId, setIsDeleted, setError) => {
  try {
    await axiosInstance.delete(`lens/customer/delete?customerRefrenceNumber=${crId}`);
    setIsDeleted(true);
  } catch (err) {
    setError(err.message || 'An error occurred while deleting the customer');
    throw err;
  }
};

// Customer filter Search
export const searchFilter = async (searchParams, setData, setLoading, setError) => {
  setLoading(true);
  setError(null);
  const { startDate, endDate, branch, customerName, customerRef, currentPage, itemsPerPage } = searchParams;

  const formattedStartDate = startDate ? moment(startDate).format('YYYY-MM-DD HH:mm:ss') : null;
  const formattedEndDate = endDate ? moment(endDate).format('YYYY-MM-DD HH:mm:ss') : null;

  try {
    let url = `lens/customer/getAllCustomerByFilter?`;
    if (formattedStartDate) url += `startDate=${formattedStartDate}&`;
    if (formattedEndDate) url += `endDate=${formattedEndDate}&`;
    if (branch) url += `branch=${branch}&`;
    if (customerName) url += `customerName=${customerName}&`;
    if (customerRef) url += `customerReferenceNumber=${customerRef}&`;
    url += `pageNo=${currentPage}&pageSize=${itemsPerPage}`;

    const res = await axiosInstance.get(url);
    setData(res.data);
    setLoading(false);
  } catch (err) {
    setLoading(false);
    setError(err.message || 'An error occurred while searching');
    throw err;
  }
};
