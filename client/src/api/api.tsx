import axios from "axios";

const BASE_URL = "http://localhost:8080/api/";
const LOGIN_ENDPOINT = "auth/login";
const NONCE_ENDPOINT = "auth/get-nonce";
const REGISTER_ENDPOINT = "auth/register";
const EMPLOYEE_LIST_ENDPOINT = "auth/employee-list";
const EMPLOYEE_ENDPOINT = "auth/user/";
const EMPLOYEE_UPDATE_ENDPOINT = "auth/employee-update/";



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
    // "Content-Type": "application/json",
    'Content-Type': 'text/plain; charset=utf-8',
    // 'authorization': token,
  },
});

export const getNonce = async (data: NonceEndpoint) => {
  const resp = await client.post(NONCE_ENDPOINT, data );
  return resp;
};

export const getEmployeeList = async () => {
  const resp = await client.get(EMPLOYEE_LIST_ENDPOINT);
  return resp;
};

export const getEmployeeById = async (id: any) => {
  const resp = await client.get(EMPLOYEE_ENDPOINT+id);
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

export const register = async (data: RegisterEndpoint) => {
  const resp = await client.post(REGISTER_ENDPOINT, data);
  return resp;
};
