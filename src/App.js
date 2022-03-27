import React from "react";
import GyroVisual from './GyroVisual'
import PressureBall from './PressureBall'
import './App.css';

const buttonPress = () => {
    console.log("Trying to open Bluetooth Menu...");
    // navigator.bluetooth.requestDevice({acceptAllDevices: true})
    navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [0x184B]
    }).then(device => {
        console.log("CONNECTED!")
        console.log(device)
        device.gatt.connect().then(server => {
            console.log(server)
            server.getPrimaryService(0x1800).then(service => {
                console.log(service)
                service.getCharacteristic("").then(characteristic => {
                    console.log(characteristic)
                    console.log("DONE!!!")
                })
            })
        })
    }).catch(error => {
        console.error(error);
    });
};

const App = () => {
    return (
        <div id="app">
            <button onClick={buttonPress}>Connect to Ball...</button>
            <div id="visuals">
                <GyroVisual />
                <PressureBall />
            </div>
        </div>
    )
}

export default App;
