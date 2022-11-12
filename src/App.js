import logo from './logo.svg';
import './App.css';
import { useEffect,useState } from 'react';

const CLIENT_ID = "80ded0d522b2f5e7b6ec"
function App() {
  //forward
  const [rerender,setrerender] = useState(false)
  const [userdata,setuserdata] =  useState({})
  useEffect(()=>{
      const  QueryString = window.location.search;
      const  urlparams = new URLSearchParams(QueryString);
      const codeparams = urlparams.get("code")
      console.log("Authorixze grant "+codeparams)

      if(codeparams && (localStorage.getItem("accessToken")==null)){
            async function getAccessToken(){
              console.log("i called him")
              await fetch(`http://localhost:4000/getAccessToken?code=${codeparams}`,{
                method:"GET",
              }).then((response)=>{
                console.log(response)
                return response.json()
              }).then((data)=>{
                console.log(data);
              console.log("im done")
                if(data.access_token){
                  localStorage.setItem("accessToken",data.access_token)
                  setrerender(!rerender)
                }
              })
            }

            getAccessToken()
      }
  },[])

  async function getData(){
    await fetch("http://localhost:4000/getData",{
      method:"GET",
      headers:{
        "Authorization": "Bearer "+localStorage.getItem("accessToken")
      }
    }).then((response)=>{
      return response.json()
    }).then((data)=>{
      console.log(data)
      setuserdata(data)
    })
  }
  function loginWithGithub(){
    window.location.assign("https://github.com/login/oauth/authorize?client_id="+CLIENT_ID)
  }
  return (
    <div className="App">
      <header className="App-header">
        {localStorage.getItem("accessToken") ?
        <>
          <h2>We have the access token</h2>
          <button onClick={()=>{localStorage.removeItem("accessToken");setrerender(!rerender)}}>Logout</button>
          <h3>Get Data from the Github API</h3>
          <button onClick={getData}>Get Data</button>
          {Object.keys(userdata).length !== 0 ?<>
            <h4>Hey there I'm {userdata.name}</h4>
            <img src={userdata.avatar_url} alt="" />
            <p>{userdata.bio}</p>
          </>
          :
          <>
          </>}

        </>
        :
        <>
        <h3>User is not logged in </h3>
         <button onClick={loginWithGithub}>
          Login With Github
        </button>
        </>
}
       
      </header>
    </div>
  );
}

export default App;
