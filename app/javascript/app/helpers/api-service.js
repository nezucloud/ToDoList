import "axios";

const baseUrl = "http://localhost:3000/";
const csrf_param = document.querySelector('meta[name="csrf-param"]').content;
const csrf_token = document.querySelector('meta[name="csrf-token"]').content;

export const GET = async (url) => {
  return axios.get(baseUrl + url);
};

export const POST = async (url, payload) => {
  return axios.post(baseUrl + url, { [csrf_param]: csrf_token, ...payload });
};

export const PATCH = async (url, payload) => {
  return axios.patch(baseUrl + url, { [csrf_param]: csrf_token, ...payload });
};

export const DELETE = async (url) => {
  return axios.delete(baseUrl + url, {
    headers: { ["X-CSRF-Token"]: csrf_token },
  });
};
