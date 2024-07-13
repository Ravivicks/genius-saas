import axios from "axios";

export const LIME_ENDPOINT = "https://api.limewire.com/api";

export const limewireApiInstance = axios.create({
  baseURL: LIME_ENDPOINT,
  headers: {
    "Content-Type": "application/json",
    "X-Api-Version": "v1",
    Accept: "application/json",
    Authorization: `Bearer ${process.env.LIME_API_KEY}`,
  },
});
