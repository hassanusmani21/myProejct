import axiosInstance from "../axios/axiosInstance";
import moment from "moment";

// delete One
export const deleteDetail = async (crId, data, setData) => {
  try {
    await axiosInstance.delete(`lens/agitatorSeal/delete?agitatorSealDrfNumber=${crId}`);
    const newData = data.filter(item => item.agitatorSealDrfNumber !== crId);
    setData(newData);
    return null; // No error
  } catch (err) {
    console.error("Error deleting detail:", err);
    return "Failed to delete detail: " + err.message; // Return the error message
  }
};

// handleSubmit
export const handleSubmit = async (e, formData, navigate) => {
  e.preventDefault();
  const dateTime = moment().format('YYYY-MM-DD HH:mm:ss');

  formData.insertedOn = dateTime;
  formData.lastUpdatedOn = dateTime;

  try {
    const res = await axiosInstance.post(`lens/agitatorSeal/save`, formData);
    navigate(`/agitatorSuccess/${res.data}`);
    return null; // No error
  } catch (err) {
    console.error("Error submitting form:", err);
    return "Failed to submit form: " + err.message; // Return the error message
  }
};

// handleUpdate
export const handleUpdate = async (e, formData, navigate, aId) => {
  e.preventDefault();

  try {
    const res = await axiosInstance.put(`lens/agitatorSeal/update`, formData);
    navigate(`/agitatorSuccess/${formData.agitatorSealDrfNumber}`);
    return null; // No error
  } catch (err) {
    console.error("Error updating form:", err);
    return "Failed to update form: " + err.message; // Return the error message
  }
};

// getApi
export const getApi = async (aId, setFormData) => {
  try {
    const res = await axiosInstance.get(`lens/agitatorSeal/get?agitatorSealDrfNumber=${aId}`);
    setFormData(res.data);
    return null; // No error
  } catch (err) {
    console.error("Error fetching data:", err);
    return "Failed to fetch data: " + err.message; // Return the error message
  }
};

// searchFilter
export const searchFilter = async (startDate, endDate, branch, customerName, agitatorSealDrfNumber, currentPage, itemsPerPage, setData) => {
  const formattedStartDate = startDate ? moment(startDate).format('YYYY-MM-DD HH:mm:ss') : null;
  const formattedEndDate = endDate ? moment(endDate).format('YYYY-MM-DD HH:mm:ss') : null;

  try {
    let url = `lens/agitatorSeal/getAllAgitatorSealByFilter?`;
    if (formattedStartDate) url += `startDate=${formattedStartDate}&`;
    if (formattedEndDate) url += `endDate=${formattedEndDate}&`;
    if (branch) url += `branch=${branch}&`;
    if (customerName) url += `customerName=${customerName}&`;
    if (agitatorSealDrfNumber) url += `agitatorSealDrfNumber=${agitatorSealDrfNumber}&`;
    url += `pageNo=${currentPage}&pageSize=${itemsPerPage}`;

    const res = await axiosInstance.get(url);
    setData(res.data);
    return null; // No error
  } catch (err) {
    console.error("Error fetching filtered data:", err);
    return "Failed to fetch filtered data: " + err.message; // Return the error message
  }
};
