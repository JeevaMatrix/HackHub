import axiosClient from "./axiosClient";

const eventApi = {
  getAllEvents: () => axiosClient.get("/event/"),
  getEventById: (id) => axiosClient.get(`/event/${id}`),
  createEvent: (data) => axiosClient.post("/event/create", data),
  updateEvent: (id, data) => axiosClient.put(`/event/${id}`, data),
  deleteEvent: (id) => axiosClient.delete(`/event/${id}`),
  getOrganizerEvents: () => axiosClient.get("/event/my-events"),
  deleteEvent: (id) => axiosClient.delete(`/events/${id}`)
};

export default eventApi;
