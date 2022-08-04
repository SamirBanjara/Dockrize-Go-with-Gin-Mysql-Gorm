import React, { useState, useEffect } from "react";
import { getEmployeeById, updateEmployee } from "../api/api";

let initial = {
    id: '',
    name: '',
    email: '',
    address: '',
    sex: '',
    post: ''
  }
const EmployeeDashboard = (props:any) => {
    const {user, token, handleLogout} = props
    const [employee, setEmployee] = useState(user);

    function handleChange(e:any){
        e.persist()
          setEmployee((emp:any) => ({
            ...emp,
            [e.target.name]: e.target.value
          }))
      }

      async function updateThisEmployee(){
        await updateEmployee(employee)
        let res = await getEmployeeById(employee.id)
        setEmployee(res.data)
      }
    return (
      <div className="container">
      <h1>Employee Dashboard</h1>
      {employee && (
          <>
           <p>Public Id: {employee && employee.pb}</p>
        <p>Token: {token && token}</p>
        <p>Role: {employee && employee.role}</p>
        <p>Post: {employee && employee.post}</p>
        <div className="container">
            <div className="from-group">
            <label>Name</label>
            <input type="text" name="name" className="form-control" value={employee.name} onChange={handleChange} />
            </div>
            <div className="from-group">
            <label>Email</label>
            <input type="text" name="email" className="form-control" value={employee.email} onChange={handleChange}/>
            <label>Address</label>
            <input type="text" name="address" className="form-control" value={employee.address} onChange={handleChange}/>
            </div>
        </div>
            <button type="button" onClick={updateThisEmployee} className="btn btn-primary">Save changesss</button>
       
        <hr/>
        <button type="button" className="btn btn-secondary" onClick={handleLogout}>log out</button>
          </>
      )}
       
      </div>
    )
}
export default EmployeeDashboard;
