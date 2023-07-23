
import React, { useState, useRef,useEffect } from 'react';
// import QrReader from 'react-qr-reader';
import QrReader from 'react-qr-scanner'

export default function Appp() {
    const [selectedCamera, setSelectedCamera] = useState(null);
    const [cameras, setCameras] = useState([]);
    const [qrcodevalue,setqrcodevalue] = useState("");
    const qrReaderRef = useRef(null);

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
        console.log(v)
        if (selectedDeviceId) {
            const constraints = {
            video: {
                facingMode:{exact :"environment"} ,
                deviceId: selectedDeviceId 
            },
            };
            // { video: {  deviceId: { exact: d} } }
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
            console.log(cameras)
            setCameras(cameras)
            if (cameras.length > 0) {
                // Set the first available camera as the default selectedCamera
                setSelectedCamera(cameras[0].deviceId);
            }
        };
        getCameras();
    }, []);

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
            <div>
               
                <QrReader
                   
                    delay={300}
                    onError={handleError}
                    onScan={handleScan}
                    constraints = {{facingMode :{exact:"environment"}}}
                    // facingMode={selectedCamera ? { exact: 'environment', deviceId: selectedCamera } : 'environment'}
                    style={{ width: '50%'}}
                />
                {/* <p>{qrcodevalue}</p> */}
            </div>
        </>
    )
}
