import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Header from './components/Header.js'
import Hero from './components/Hero.js'
import Browse from './components/Browse.js';
import Arrived from './components/Arrived.js';
import Clients from './components/Clients.js';
import AsideMenu from './components/AsideMenu.js';
import Footer from './components/Footer.js';
import Offline from './components/Offline.js';
import Splash from './pages/Splash.js';
import Profile from './pages/Profile.js';

function App() {
  const [items, setItems] = React.useState([]);
  const [offlineStatus, setOfflineStatus] = React.useState(!navigator.onLine);
  const [isLoading, setIsLoading] = React.useState(true);
 
  function handleOfflineStatus() {
    setOfflineStatus(!navigator.onLine);
  }

  React.useEffect(function () {
    (async function () {
      const response = await fetch('https://fakestoreapi.com/products');

      // konvert respon menjadi json, yang diambil hanya nodes/data dalam bentuk array
      const data  = await response.json();
      console.log("Data fetched:", data);
      setItems(data);

      // script js untuk carousel
      // if (!document.querySelector('script[src="./carousel.js"]')) {
      //   const script = document.createElement("script");
      //   script.src = "./carousel.js";
      //   script.async = false;
      //   document.body.appendChild(script);
      // }
    }());
    handleOfflineStatus();
    window.addEventListener('online', handleOfflineStatus);
    window.addEventListener('offline', handleOfflineStatus);

    setTimeout(function(){
      setIsLoading(false);
    }, 1500);
    
    return function() {
      window.removeEventListener('online', handleOfflineStatus);
      window.removeEventListener('offline', handleOfflineStatus);
    }
  }, [offlineStatus]);

  // React.useEffect(function () {
  //   (async function () {
  //     const response = await fetch('https://prod-qore-app.qorebase.io/8ySrll0jkMkSJVk/allItems/rows?limit=7&offset=0&$order=asc', {
  //       headers: {
  //         "Content-Type": "application/json",
  //         "accept": "application/json",
  //         "x-api-key": process.env.REACT_APP_APIKEY
  //       }
  //     });
  //     console.log("API Key:", process.env.REACT_APP_APIKEY);

  //     // konvert respon menjadi json, yang diambil hanya nodes/data dalam bentuk array
  //     const { nodes } = await response.json();
  //     setItems(nodes);
  //   }());
  // }, []);

  // React.useEffect(() => {
  //   (async function() {
  //     try {
  //       console.log("Fetching data...");
  //       const response = await fetch('https://prod-qore-app.qorebase.io/8ySrll0jkMkSJVk/allItems/rows?limit=7&offset=0&$order=asc', { 
  //         headers: {
  //           "Content-Type": "application/json",
  //           "accept": "application/json",
  //           "x-api-key": process.env.REACT_APP_APIKEY
  //         }
  //       });
  
  //       console.log("Response status:", response.status);
  //       if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
  
  //       const data = await response.json();
  //       console.log("Fetched data:", data);
  //       setItems(data.nodes);
  //     } catch (error) {
  //       console.error("Fetch error:", error);
  //     }
  //   })();
  // }, []);
  return (
    <>
    {isLoading === true ? <Splash /> : 
    (
      <>
      {offlineStatus && <Offline />}
      <Header/>
      <Hero/>
      <Browse/>
      <Arrived items={items}/>
      <Clients/>
      <AsideMenu/>
      <Footer/>
      </>)}
    </>
  );
}

export default function AppRoutes() { 
  return (
    <Router>
      <Routes> 
        <Route path="/" element={<App />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}