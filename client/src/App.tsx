import React, { useState, useEffect } from "react";
import Web3 from 'web3'
import { getNonce, postSignature, register as apiRegister } from "./api/api";
import Auth from "./Auth";
import EmployeeDashboard from "./componenets/EmployeeDashboard";
import EmployerDashboard from "./componenets/EmployerDashboard";


const myWindow = window as any

const App: React.FC = () => {
  const [isWeb3Active, setIsWeb3Active] = useState<boolean>(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [userState, setUser] = useState<any>({})
  const [authToken, setAuthToken] = useState<any>()
  const [wasRegistrationSuccessful, setWasRegistrationSuccessful] = useState<boolean | null>()

  const handleWeb3 = async () => {
    if (myWindow.ethereum) {
      myWindow.web3 = new Web3(myWindow.ethereum)
      try {
        await myWindow.ethereum.enable()
        setIsWeb3Active(true)
      } catch (error) {
        console.error(error)
        setIsWeb3Active(false)
      }
    } else if (myWindow.web3) {
      myWindow.web3 = new Web3(myWindow.web3.currentProvider)
      setIsWeb3Active(true)
    } else {
      window.alert('no metamask')
      setIsWeb3Active(false)
    }
  }

  useEffect(() => {
    handleWeb3()
  }, [handleWeb3])

  useEffect(() => {
    checkLogin()
  }, [])

  const handleLogin = async (role:string) => {
    const coinbase = await myWindow.web3.eth.getCoinbase(console.log)
    interface Params {
      pb: string,
      role: string,
    }
    const params: Params = {
      pb: coinbase,
      role: role
    }
    const resp = await getNonce(params)
    const nonceResp = resp.data.nonce
    const userSignature = await myWindow.web3.eth.personal.sign(nonceResp, coinbase, console.log)
    interface Data {
      pb: string,
      sig: string,
    }
    const data: Data = {
      pb: coinbase,
      sig: userSignature
    }
    const isAuthResp = await postSignature(data)
    let access_token = "";
    if (userSignature) {
      access_token = "token " + isAuthResp.data.data.token;
    }
    let user = isAuthResp.data.data.user
    setIsAuthenticated(isAuthResp.data.data.authenticated)
    setAuthToken(access_token)
    setUser({...user})

    window.sessionStorage.setItem(
      "user",
      user
    );

    window.sessionStorage.setItem("token", access_token);
  }

  const handleLogout = async () => {
    setIsAuthenticated(false)
    window.sessionStorage.removeItem("user");
    window.sessionStorage.removeItem("token");
    setUser({})

  }


  const handleRegister = async (role:string) => {
    if (myWindow.ethereum) {
      myWindow.web3 = new Web3(myWindow.ethereum)
      try {
        await myWindow.ethereum.enable()
      } catch (error) {
        console.error(error)
      }
    } else if (myWindow.web3) {
      myWindow.web3 = new Web3(myWindow.web3.currentProvider)
    } else {
      console.log('no metamask')
    }
    const coinbase = await myWindow.web3.eth.getCoinbase(console.log)
    try {
      interface Data {
        pb: string,
        role: string,
      }
      const data: Data = {
        pb: coinbase,
        role: role
      }
      // const resp = await apiRegister(data)
      setWasRegistrationSuccessful(true)
    } catch (err) {
      console.error(err)
      setWasRegistrationSuccessful(false)
    }
  }


  async function checkLogin() {
    let user = window.sessionStorage.getItem("user")
      ? JSON.parse(window.sessionStorage.getItem("user") ?? '')
      : null;
    
    const access_token = window.sessionStorage.getItem("token");
try{
    const coinbase = await myWindow.web3.eth.getCoinbase(console.log)


    if (user && access_token) {
      if (user.pb != coinbase) {
        handleLogout();
      } else{
        setUser(user)
        setAuthToken(access_token)

        setIsAuthenticated(true)
      }
    } else {
      handleLogout();
    }
  }catch(err){
    console.log("Errr");
  }
  }
  if (isAuthenticated) {
    if(userState && userState.role == 'employee'){
        return <EmployeeDashboard user={userState} token={authToken} handleLogout={handleLogout} />
    }
    if(userState && userState.role == 'employer'){
      return <EmployerDashboard user={userState} token={authToken} handleLogout={handleLogout} />
  }
  }
  return (
    <div className="App">
      <Auth isAuthenticated={isAuthenticated} handleLogin={handleLogin} handleLogout={handleLogout} handleRegister={handleRegister} />
    </div>
  );
};
export default App;
