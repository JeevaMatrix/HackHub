import axiosClient from "./axiosClient";

const registrationApi = {
  register: (eventId) => axiosClient.post(`/register/${eventId}`),
  cancel: (registrationId) => axiosClient.delete(`/register/${registrationId}`),
  myRegistrations: () => axiosClient.get("/register/mine")
};

export default registrationApi;
