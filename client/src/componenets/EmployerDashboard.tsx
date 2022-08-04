import React, { useState, useEffect } from "react";
import { getEmployeeList, updateEmployee } from "../api/api";

let initial = {
  id: '',
  name: '',
  email: '',
  address: '',
  sex: '',
  post: '',
  annual_salary: ''
}
const EmployerDashboard = (props:any) => {
    const {user, token, handleLogout} = props
    const [employees, setEmployees] = useState([]);
    const [employee, setEmployee] = useState(initial);

    useEffect(() => {
      getEmployees()
    }, []);

    async function getEmployees() {
      
      let res = await getEmployeeList()
      setEmployees(res.data)
    }

    function handleChange(e:any){
      e.persist()
        setEmployee((emp) => ({
          ...emp,
          [e.target.name]: e.target.value
        }))
    }

    async function updateThisEmployee(){
      await updateEmployee(employee)
      getEmployees()
    }

    function editEmployee(key:number){
      setEmployee(employees[key]);
    }
    return (
      <div className="container mt-4">
      <h1>Employer Dashboard</h1>
        <p>Public Id: {user && user.pb}</p>
        <p>Token: {token && token}</p>
        <p>Role: {user && user.role}</p>
        <hr/>
        <button type="button" className="btn btn-primary" onClick={handleLogout}>log out</button>
        <table className="table">
          <thead>
            <tr>
              <th>SN</th>
              <th>Name</th>
              <th>Address</th>
              <th>Email</th>
              <th>Post</th>
              <th>Annual Salary</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employees && employees.map((emp:any, key:any) => (
              <tr key={key}>
                <td>{key}</td>
                <td>
                  {emp.name}
                  <p>{emp.pb}</p>
                  </td>
                <td>{emp.address}</td>
                <td>{emp.email}</td>
                <td>{emp.post}</td>
                <td>{emp.annual_salary}</td>
                <td>
        
                  <button type="button" className="btn btn-primary" onClick={() => editEmployee(key)} data-bs-toggle="modal" data-bs-target="#exampleModal">
                    Edit
                  </button>

                  <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                          <div className="from-group">
                            <label>Name</label>
                            <input type="text" name="name" className="form-control" value={employee.name} onChange={handleChange} />
                          </div>
                          <div className="from-group">
                            <label>Email</label>
                            <input type="text" name="email" className="form-control" value={employee.email} onChange={handleChange}/>
                          </div>
                          <div className="from-group">
                            <label>Address</label>
                            <input type="text" name="address" className="form-control" value={employee.address} onChange={handleChange}/>
                          </div>
                          <div className="from-group">
                            <label>Post</label>
                            <input type="text" name="post" className="form-control" value={employee.post} onChange={handleChange}/>
                          </div>
                          <div className="from-group">
                            <label>Annual Salary</label>
                            <input type="text" name="annual_salary" className="form-control" value={employee.annual_salary} onChange={handleChange}/>
                          </div>
                        </div>
                        <div className="modal-footer">
                          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                          <button type="button" onClick={updateThisEmployee} className="btn btn-primary" data-bs-dismiss="modal">Save changes</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
        
      </div>
    )
}
export default EmployerDashboard;
