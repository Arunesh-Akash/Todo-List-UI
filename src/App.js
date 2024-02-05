
import { BrowserRouter, Routes,Route, Navigate} from 'react-router-dom';
import './App.css';
import SignUp from './Component/SignComponent/SignUp';
import Home from './Component/HomeComponent/Home';
import Project from './Component/ProjectComponent/Project';


function App() {
  const checkAuthentication=()=>{
    const token=localStorage.getItem('token');
    return !!token;
  }
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
      <Route path='/' element={<SignUp/>} />
      <Route path='/project' element={<Project/>}/>
       {
        checkAuthentication ?(
        <>
        <Route path='/home' element={<Home/>}/> 
        <Route path='*' element={<Navigate to='/home'/>}/>
        </>):(
          <Route path='/' element={<SignUp/>} />
          )}
          <Route path='*' element={<Navigate to='/'/>}/>
      </Routes>
      </BrowserRouter>
     </div>
  )
}



export default App;
