import React from 'react'
import "./App.css"

interface Props {
    isAuthenticated: boolean,
    handleLogin: (role:string) => void,
    handleLogout: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    handleRegister: (role: string) => void
}


const Auth: React.FC<Props> = ({ isAuthenticated, handleLogin, handleLogout, handleRegister }) => {
    if (!isAuthenticated) {
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                    <button type="button" className="btn btn-primary" data-role="employer" onClick={() => handleLogin("employer")}>Login Employer</button>
                    </div>
                </div>
                <br/>
                <div className="row">
                <div className="col">
                    <button type="button" className="btn btn-success" data-role="employee"  onClick={() => handleLogin("employee")}>Login Employee</button>
                    </div>
                </div>
            </div>
        )
    }
    return (<></>);
}

export default Auth