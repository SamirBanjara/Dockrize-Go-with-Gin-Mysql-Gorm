import React from 'react'

interface Props {
    isAuthenticated: boolean,
    handleLogin: (role:string) => void,
    handleLogout: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    handleRegister: (role: string) => void
}


const Auth: React.FC<Props> = ({ isAuthenticated, handleLogin, handleLogout, handleRegister }) => {
    if (!isAuthenticated) {
        return (
            <div className="">
            <button type="button" className="btn btn-primary" data-role="employer" onClick={() => handleLogin("employer")}>Login Employer</button>
            <button type="button" className="btn btn-primary" data-role="employee"  onClick={() => handleLogin("employee")}>Login Employee</button>
</div>
        )
    }
    return <button type="button" onClick={handleLogout}>log out</button>
}

export default Auth