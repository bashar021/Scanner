
import './App.css';
// import { useState } from 'react';
import React, { useRef, useState, useEffect } from 'react';
import QrReader from 'react-qr-scanner'
import Scanner from './components/Scanner.js'
function App() {
  const [qrValue, setQrValue] = useState('');
  const [scanner, setscanner] = useState(false)
  const [showdata, set_show_data] = useState('')
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  useEffect(() => {
    // Get the list of available media devices (cameras)
      navigator.mediaDevices.enumerateDevices().then((devices) => {
      const cameras = devices.filter((device) => device.kind === 'videoinput');
      setDevices(cameras);
      setSelectedDeviceId(cameras[0].deviceId);
    });

  }, []);
  async function Postdata(url, postdata) {

    let data = await fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(postdata)
    })
    if (data != null) {
      data = await data.json();
    } else {
      data = { success: false, message: 'please try again later' }
    }
    return data

  }
  const handleError = (err) => {
    console.error("please insert qr code infront of the camera");
    alert('please insert qr code infront of the camera')
  };
  const handleScan = (data) => {
    if (data) {
      // console.log(data)
      setQrValue(data.text)
      setscanner(false)
      verify()
    }
  };
  async function verify() {
    console.log(qrValue)
    var data = await Postdata(`${process.env.REACT_APP_VERIFY_URL}place/verify`, { url: qrValue })
    console.log(data)
    set_show_data(data.mssg)

  }
  
  const handleCameraChange = (event) => {
    setSelectedDeviceId(event.target.value);
    console.log(event.target.value)
    handleStartScan(event.target.value);
  };

  const handleStartScan = (d) => {
    var vd = document.querySelector('video');
    console.log(d)

    const constraints = {
      video: {
        // facingMode: "environment",
        deviceId: { exact: d }

      },
    };
    console.log(vd)
    // { video: {  deviceId: { exact: d} } }
        navigator.mediaDevices.getUserMedia(constraints)
          .then((stream) => {
            vd = document.querySelector('video')
            vd.srcObject = stream;
          })
          .catch((error) => {
            console.error('Error accessing the camera:', error);
          });
    
  }
  return (
    // <div className="App" >
    //   {/* el => { qrReaderRef.current = el; */}
    //   <div id='main_container' >

    //     <select onChange={function (event) {handleCameraChange(event) }}>
    //       {devices.map((device) => (
    //         <option key={device.deviceId} value={device.deviceId}>
    //           {device.label || `Camera ${devices.indexOf(device) + 1}`}
    //         </option>
    //       ))}
    //     </select>


    //     {
    //       // scanner !== false ? <QrCodeReader delay={100} width={350} height={350} onScan={handleRead} onError={handleError} /> : <span></span>
    //       scanner !== false ? <div> <QrReader width ={350} height={350}  onError={function(){console.log(alert("try again "))}} onScan={handleScan}  /></div> : <span></span>
    //     }

    //     {
    //       showdata !== '' ? <p>{showdata}</p> : <span></span>

    //     }
    //     <br />
    //     <button onClick={function () { setscanner(true); set_show_data(""); }}>Scan Ticket</button>
    //   </div>

    // </div>
    <Scanner></Scanner>
  );
}

export default App;
