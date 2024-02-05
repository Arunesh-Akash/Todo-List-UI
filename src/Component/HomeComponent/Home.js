import '../HomeComponent/Home.css';
import { CgMenuLeft } from "react-icons/cg";
import { BsMenuButtonWide } from "react-icons/bs";
import { CiFolderOn } from "react-icons/ci";
import { MdOutlineMailOutline } from "react-icons/md";
import { BsEmojiHeartEyes } from "react-icons/bs";
import { IoTimeOutline } from "react-icons/io5";
import { CiCalendar } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import { CiUser } from "react-icons/ci";
import Logout from '../LogoutComponent/Logout';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import Project from '../ProjectComponent/Project';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';


export default function Home() {
  const [name, setName] = useState('');
  const [value, setValue] = useState('1');


  useEffect(() => {
    const token = localStorage.getItem('token');
    const decodeToken = jwtDecode(token);
    setName(decodeToken.name);
  }, []);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const getCurrentDate = () => {
    const date = new Date();
    const day = date.getDate().toString().padStart(2, '0');
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const monthName = monthNames[monthIndex];

    return `${day} ${monthName} ${year}`;
  };

  return (
    <div className='home-container'>
      <div className='side-nav-container'>
        <div className='nav-icons'>
          <CgMenuLeft />
          <BsMenuButtonWide />
          <CiFolderOn />
          <MdOutlineMailOutline />
          <IoTimeOutline />
          <CiCalendar />
          <IoSettingsOutline />
          <Logout />
        </div>

      </div>
      <div className='dashboard-container'>
        <div className='dashboard-header'>
          <div className='left-dashboard-header'>
            <p>Welcome back, {name} <BsEmojiHeartEyes /></p>
          </div>
          <div className='right-dashboard-header'>
            <div className='header-icons'>
              <CiSearch />
              <IoIosNotificationsOutline />
              <CiCalendar />
            </div>
            <div className='current-date'>
              {getCurrentDate()}
            </div>
            <div className='profile-icon'>
              <CiUser />
            </div>
          </div>
        </div>
        <div className='nav-header'>
          <Box>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} aria-label="lab API tabs example">
                  <Tab label="Projects" value="1" />
                  <Tab label="Planning" value="2" />
                  <Tab label="Team" value="3" />
                </TabList>
              </Box>
              <TabPanel value="1" sx={{ padding: 0 }}><Project /></TabPanel>
              <TabPanel value="2">Item Two</TabPanel>
              <TabPanel value="3">Item Three</TabPanel>
            </TabContext>
          </Box>
        </div>

      </div>
    </div>

  )
}