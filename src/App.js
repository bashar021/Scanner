
import './App.css';
// import { useState } from 'react';
import React, { useRef, useState, useEffect } from 'react';
import QrReader from 'react-qr-scanner'
function App() {
  const [qrValue, setQrValue] = useState('');
  const [scanner, setscanner] = useState(false)
  const [showdata, set_show_data] = useState('')
  const qrReaderRef = useRef(null);
  useEffect(() => {
    
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
      setQrValue(data.text)
      setscanner(false)
      verify()
      
    }

  };
  async function verify() {
    console.log(qrValue)
    var data  = await Postdata(`${process.env.REACT_APP_VERIFY_URL}place/verify`,{url:qrValue})
    console.log(data)
    set_show_data(data.mssg)

  }
  function checkcamera(){
    if (qrReaderRef.current) {
      // Get the underlying video element created by QrReader
      const videoElement = qrReaderRef.current.video;
      if (videoElement) {
        console.log('mobile')
        // Use getUserMedia to set facingMode to 'environment' for the back camera
        // navigator.mediaDevices({ video: { facingMode: { exact: 'environment' } } })
         navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        // navigator.mediaDevices.getUserMedia({video: true})
          .then((stream) => {
            videoElement.srcObject = stream;
          })
          .catch((error) => {
            console.error('Error accessing the camera:', error);
          });
      }
    }
  }
  return (
    <div className="App">
      <div id='main_container'>
      
        {
          // scanner !== false ? <QrCodeReader delay={100} width={350} height={350} onScan={handleRead} onError={handleError} /> : <span></span>
          scanner !== false ? <QrReader ref={checkcamera()} delay={100} onError={handleError}  onScan={handleScan}  style={{ width: 350 ,height:350}}/> : <span></span>
        }
        {
          showdata !== '' ?<p>{showdata}</p>:<span></span>

        }
        <br />
        <button onClick={function () { setscanner(true) ;set_show_data("")}}>Scan Ticket</button>
      </div>

    </div>
  );
}

export default App;
