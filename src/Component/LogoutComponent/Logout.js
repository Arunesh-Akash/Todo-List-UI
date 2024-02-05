import { IoIosLogOut } from "react-icons/io";
import '../LogoutComponent/Logout.css';
import { useNavigate } from "react-router";



export default function Logout(){
    const navigate=useNavigate();
function handelLogOut(){
    localStorage.clear();
    navigate('/');
}

return(
    <div className="logout-container">
        <IoIosLogOut onClick={handelLogOut}/>
    </div>
)
}