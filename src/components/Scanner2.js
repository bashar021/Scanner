
import QrReader from 'react-qr-scanner';
import React, {useState} from "react";
export default function Scanner2() {
  const [result, setResult] = useState("No result");
  const delay = 500;
  const previewStyle = {
    height: 240,
    width: 320
  };
  const handleScan = (result) => {
    if (result) {
      setResult(result.text);
      console.log(result.text)
    }
  };
  const handleError = (error) => {
    console.log(error);
  };
  return (
    <>
    <QrReader
        delay={delay}
        style={previewStyle}
        onError={handleError}
        onScan={handleScan}
      />
      <p>{result}</p>
    </>
  )
}
