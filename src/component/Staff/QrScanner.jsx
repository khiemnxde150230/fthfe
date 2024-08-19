import React, { useState, useEffect } from "react";
import QrScanner from "react-qr-scanner";
import { Select, Typography, Switch } from "antd";
import styled from "styled-components";

const { Option } = Select;

const CustomSwitch = styled(Switch)`
  &.ant-switch-checked {
    background-color: #EC6C21;
  }
  &:hover.ant-switch-checked:not(.ant-switch-disabled) {
    background-color: #b74f18;
  }

  .ant-switch-inner {
    font-size: 16px;
  }
`;

const QrScannerComponent = ({ onScanResult }) => {
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((deviceInfos) => {
      const videoDevices = deviceInfos.filter(
        (device) => device.kind === "videoinput"
      );
      setDevices(videoDevices);
      if (videoDevices.length > 0) {
        setSelectedDeviceId(videoDevices[0].deviceId);
      }
    });
  }, []);

  const handleScan = (data) => {
    if (data) {
      onScanResult(data.text);
      setScanning(false);
      setTimeout(() => setScanning(true), 2000);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const scannerContainerStyle = {
    position: 'relative',
    width: '200px',
    paddingBottom: '200px',
    border: '2px solid #EC6C21',
    borderRadius: '10px',
    overflow: 'hidden',
    margin: '0 auto',
  };

  const previewStyle = {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  return (
    <div className="pt-3" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <div className="m-auto">
          <Select
            onChange={(value) => setSelectedDeviceId(value)}
            value={selectedDeviceId}
          >
            {devices.map((device, idx) => (
              <Option value={device.deviceId} key={idx}>
                {device.label || `Device ${idx + 1}`}
              </Option>
            ))}
          </Select>
        </div>
      </div>
      <CustomSwitch
        checked={cameraActive}  
        onChange={() => setCameraActive(!cameraActive)}
        style={{ marginBottom: '10px' }}
        unCheckedChildren="Tắt"
        checkedChildren="Bật"
      >
        {cameraActive ? 'Tắt Camera' : 'Bật Camera'}
      </CustomSwitch>
      <div style={scannerContainerStyle}>
        {cameraActive && scanning && (
          <QrScanner
            delay={300}
            style={previewStyle}
            onError={handleError}
            onScan={handleScan}
            constraints={{ video: { deviceId: selectedDeviceId } }}
          />
        )}
      </div>
    </div>
  );
};

export default QrScannerComponent;