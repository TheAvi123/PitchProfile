import React, { useEffect, useState } from 'react';
import PressureBall from './PressureBall';
import GyroVisual from './GyroVisual';
import './App.css';

export default function App() {

    const bleService = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
    const bleCharRX = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
    const bleCharTX = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';

    var bleDevice;
    var rxChar;

    const [txChar, setCharTX] = useState(null);
    const [connected, setConnected] = useState(false);
    const [pressureData, setPressureData] = useState(undefined);

    useEffect(() => {
        var currentMessage = "";
        
        function handleUpdate(event) {
            console.log("Update Received...");
            let value = event.target.value;
            let str = currentMessage;
            for (let i = 0; i < value.byteLength; i++) {
                str += String.fromCharCode(value.getUint8(i));
            }
            try {
                let jsonStr = JSON.parse(str);
                console.log(jsonStr)
                setPressureData(jsonStr);
                currentMessage = "";
            } catch {
                currentMessage = str;
            }
        }
        if (connected) {
            console.log("Listening for Updates...")
            txChar.addEventListener('characteristicvaluechanged', handleUpdate);
            return () => txChar.removeEventListener('characteristicvaluechanged', handleUpdate);
        }
    }, [connected, txChar, pressureData])

    const buttonPress = () => {
        if (!navigator.bluetooth) {
            console.log('WebBluetooth API is not available on this browser');
            return;
        }
        console.log('Requesting Bluetooth Device...');
        navigator.bluetooth.requestDevice({
            // acceptAllDevices: true,
            optionalServices: [bleService],
            filters: [{
                namePrefix: 'CIRCUITPY'
            }]
        }).then(device => {
            bleDevice = device;
            console.log("Found Device: " + device.name);
            console.log(device);
            console.log('Connecting to GATT Server...');
            bleDevice.addEventListener('gattserverdisconnected', onDisconnected);
            device.gatt.connect().then(server => {
                console.log("Found Server: ");
                console.log(server);
                server.getPrimaryService(bleService).then(service => {
                    console.log("Found Service: ");
                    console.log(service);
                    // console.log("Looking for Available Characteristics...")
                    // service.getCharacteristics().then(chars => {
                    //     console.log(chars)
                    // })
                    console.log("Looking for RX Characteristic...");
                    service.getCharacteristic(bleCharRX).then(charRX => {
                        rxChar = charRX;
                        console.log("Found RX Characteristic!");
                        console.log(rxChar);
                    }).then(() => {
                        console.log("Looking for TX Characteristic...");
                        service.getCharacteristic(bleCharTX).then(charTX => {
                            console.log("Found TX Characteristic!");
                            console.log(charTX);
                            charTX.startNotifications().then(() => {
                                console.log("Notifications Started...");
                                setCharTX(charTX);
                                setConnected(true);
                                console.log("Device Fully Connected!!!")
                            })
                        })
                    })
                })
            })
        }).catch(error => {
            console.error(error);
        });
    };

    function onDisconnected() {
        setConnected(false);
        console.log(bleDevice.name + " disconnected :(");
    }
    
    return (
        <div id="app">
            <button onClick={buttonPress}>Connect to Ball...</button>
            <div id="visuals">
                <GyroVisual />
                <PressureBall key={pressureData} pressureData={pressureData} />
            </div>
        </div>
    )
};