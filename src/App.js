
import './App.css';
// import { useState } from 'react';
import React, { useRef, useState, useEffect } from 'react';
import QrReader from 'react-qr-scanner'
function App() {
  const [qrValue, setQrValue] = useState('');
  const [scanner, setscanner] = useState(false)
  const [showdata, set_show_data] = useState('')
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const qrReaderRef = useRef(null);
  useEffect(() => {
     // Get the list of available media devices (cameras)
      navigator.mediaDevices.enumerateDevices().then((devices) => {
      const cameras = devices.filter((device) => device.kind === 'videoinput');
      setDevices(cameras);
      // If there are multiple cameras, set the first camera as the default selection
      // if (cameras.length > 0) {
        setSelectedDeviceId(cameras[0].deviceId);
      // }
    });

  }, []);
  // const getCameraSelection = async function () {
  //   const devices = await navigator.mediaDevices.enumerateDevices();
  //   const videoDevices = devices.filter(device => device.kind === 'videoinput');
  //   // console.log(videoDevices)
  //   videoDevices.map(videoDevice => {
  //     console.log(videoDevice.deviceId, videoDevice.label)
  //     // return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`
  //   });
  //   // options()
  //   // cameraOptions.innerHTML = options.join('');
  // }
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
    var data = await Postdata(`${process.env.REACT_APP_VERIFY_URL}place/verify`, { url: qrValue })
    console.log(data)
    set_show_data(data.mssg)

  }
  // function checkcamera() {
  //   if (qrReaderRef.current) {
  //     // Get the underlying video element created by QrReader
  //     const videoElement = qrReaderRef.current.video;
  //     if (videoElement) {
  //       console.log('mobile')
  //       // Use getUserMedia to set facingMode to 'environment' for the back camera
  //       // navigator.mediaDevices({ video: { facingMode: { exact: 'environment' } } })
  //       navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
  //         // navigator.mediaDevices.getUserMedia({video: true})
  //         .then((stream) => {
  //           videoElement.srcObject = stream;
  //         })
  //         .catch((error) => {
  //           console.error('Error accessing the camera:', error);
  //         });
  //     }
  //   }
  // }
  const handleCameraChange = (event) => {
    setSelectedDeviceId(event.target.value);
    console.log(event.target.value)
    handleStartScan(event.target.value);
  };

  const handleStartScan = (d) => {
    var vd  ;
    console.log(d)
      // console.log(qrReaderRef.current)
      // console.log(selectedDeviceId)

      navigator.mediaDevices.getUserMedia({ video: {  deviceId: { exact: d} } })
        .then((stream) => {
          vd = document.querySelector('video')
          // qrReaderRef.current.srcObject = stream;
          vd.constraints = {facingMode:'environment'}
          vd.srcObject = stream;

          vd.play()
        })
        .catch((error) => {
          console.error('Error accessing the camera:', error);
        });
  }
  

  return (
    <div className="App" >
      {/* el => { qrReaderRef.current = el; */}
      <div id='main_container' >

          <select onChange={function(event){ handleStartScan(event.target.value);setSelectedDeviceId(event.target.value);}} value={selectedDeviceId}>
            {devices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${devices.indexOf(device) + 1}`}
              </option>
            ))}
            <option value="bashar">a</option>
          </select>


        {
          // scanner !== false ? <QrCodeReader delay={100} width={350} height={350} onScan={handleRead} onError={handleError} /> : <span></span>
          scanner !== false ? <div ref={qrReaderRef}> <QrReader   delay={100} onError={handleError} onScan={handleScan} style={{ width: 350, height: 350 }} /></div> : <span></span>
        }

        {
          showdata !== '' ? <p>{showdata}</p> : <span></span>

        }
        <br />
        <button onClick={function () { setscanner(true); set_show_data("") }}>Scan Ticket</button>
      </div>

    </div>
  );
}

export default App;
