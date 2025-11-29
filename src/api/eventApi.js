import axiosClient from "./axiosClient";

const eventApi = {

  getAllEvents: () => axiosClient.get("/event/"),

  getEventById: (id) => axiosClient.get(`/event/${id}`),

  // CREATE EVENT (FormData)
  createEvent: (formData) =>
    axiosClient.post("/event/create", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    }),

  // UPDATE EVENT (FormData)
  updateEventFormData: (id, formData) =>
    axiosClient.patch(`/event/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    }),

  deleteEvent: (id) => axiosClient.delete(`/event/${id}`),

  getOrganizerEvents: () => axiosClient.get("/event/my-events"),

  downloadRegistrationsCSV: (eventId) =>
  axiosClient.get(`/event/${eventId}/registrations/csv`, {
    responseType: "blob",
  }),
};

export default eventApi;
