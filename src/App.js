
import './App.css';
import { useState } from 'react';
import QrCodeReader from 'react-qrcode-reader';

function App() {
  const [qrValue, setQrValue] = useState('');
  const [scanner, setscanner] = useState(false)
  const [showdata, set_show_data] = useState('')
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
  };
  const handleRead = (code) => {
    if (code) {
      setQrValue(code.data)
      setscanner(false)
      verify()
      
    }

  };
  async function verify() {
    console.log(qrValue)
    var data  = await Postdata("http://localhost/place/verify",{url:qrValue})
    console.log(data)
    set_show_data(data.mssg)

  }

  return (
    <div className="App">
      <div id='main_container'>
        {
          scanner !== false ? <QrCodeReader delay={100} width={350} height={350} onRead={handleRead} onError={handleError} /> : <span></span>
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
