
import React, { useState, useRef, useEffect } from 'react';
// import QrReader from 'react-qr-reader';
import QrReader from 'react-qr-scanner'

export default function Appp() {
    const [selectedCamera, setSelectedCamera] = useState(null);
    const [cameras, setCameras] = useState([]);
    const [qrcodevalue, setqrcodevalue] = useState("");
    const qrReaderRef = useRef(null);
    const [scan, setScan] = useState(false)

    const handleScan = (data) => {
        if (data) {
            console.log('Scanned data:', data.text);
            alert(data.text)
        }
    };

    const handleError = (error) => {
        console.error('QR scan error:', error);
    };
    const handleStartScan = (selectedDeviceId) => {
        const v = document.querySelector('video');
       
        if (selectedDeviceId && cameras.length > 1) {
            console.log(cameras.length)
            const constraints = {
                video: {
                    facingMode: "environment",
                    deviceId: selectedDeviceId
                },
            };
            navigator.mediaDevices.getUserMedia(constraints)
                .then((stream) => {
                    v.srcObject = stream;
                    v.openImageDialog();
                })
                .catch((error) => {
                    console.error('Error accessing the camera:', error);
                });
        }

    }
    const handleCameraChange = (event) => {
        const selectedDeviceId = event.target.value;
        setSelectedCamera(selectedDeviceId);
        handleStartScan(selectedDeviceId)
    };


    const enumerateCameras = async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const cameras = devices.filter((device) => device.kind === 'videoinput');
            setCameras(cameras)
            return cameras;
        } catch (error) {
            console.error('Error enumerating cameras:', error);
            return [];
        }
    };

    // Fetch the list of cameras when the component mounts
    useEffect(() => {
        const getCameras = async () => {
            const cameras = await enumerateCameras();
            // if (cameras.length > 0) {
                setSelectedCamera(cameras[0].deviceId);
            // }
        };
        console.log(selectedCamera)
        getCameras();
    }, [0]);

    return (
        <>
            <div>
                <select value={selectedCamera} onChange={handleCameraChange}>
                    {cameras.map((camera) => (
                        <option key={camera.deviceId} value={camera.deviceId}>
                            {camera.label}
                        </option>

                    ))}
                    <option value="bashar">bashar</option>
                </select>

            </div>
            {
                scan == false ? <div>
                    <QrReader delay={300} onError={handleError} onScan={handleScan} style={{ width: '50%' }}
                        // constraints = {cameras > 1 ?{facingMode :'environment'} :{facingMode :{exact:'user'}}}
                        // constraints={{ facingMode:  {exact:'user'} }}
                    // facingmode={selectedCamera ? { exact: 'environment' } : 'environment'}
                    />
                    {/* <p>{qrcodevalue}</p> */}
                </div>:<p></p>
            }

            <button onClick={function () {handleStartScan(selectedCamera); setScan(false);  console.log(selectedCamera); }}>Scan Ticket</button>
        </>
    )
}
