import axios from "axios";

const BASE_URL = "http://localhost:8080/api/auth";
const LOGIN_ENDPOINT = "/login";
const NONCE_ENDPOINT = "/get-nonce";
const EMPLOYEE_LIST_ENDPOINT = "/employee-list";
const EMPLOYEE_ENDPOINT = "/employee/";
const EMPLOYEE_UPDATE_ENDPOINT = "/employee-update";



interface NonceEndpoint {
  pb: string
}

interface SignatureEndpoint {
  pb: string,
  sig: string
}

interface RegisterEndpoint {
  pb: string
}

interface EmployeeEndPoint {
  name: string,
  role: string,
  pk: string
  address: string
}
let token = window.sessionStorage.getItem("token");

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    'Authorization': token,
  },
});

export const getNonce = async (data: NonceEndpoint) => {
  const resp = await client.post(NONCE_ENDPOINT, data );
  return resp;
};


export const getEmployeeList = async () => {
  const resp = await client.get(EMPLOYEE_LIST_ENDPOINT, {
    headers: { Authorization: token },
  });
  return resp;
};

export const getEmployeeById = async (id: any) => {
  const resp = await client.get(EMPLOYEE_ENDPOINT+id);
  return resp;
};

export const deleteEmployee = async (id: any) => {
  const resp = await client.delete(EMPLOYEE_ENDPOINT+id);
  return resp;
};


export const updateEmployee = async (data: any) => {
  const resp = await client.post(EMPLOYEE_UPDATE_ENDPOINT, data);
  return resp;
};

export const postSignature = async (data: SignatureEndpoint) => {
  const resp = await client.post(LOGIN_ENDPOINT, data);
  return resp;
};
