import React from "react";
import GyroVisual from './GyroVisual'
import PressureBall from './PressureBall'
import './App.css';

const readUpdate = (update) => {
    console.log("Received Update");
    console.log(update)
}

const buttonPress = () => {
    console.log("Trying to open Bluetooth Menu...");
    // navigator.bluetooth.requestDevice({acceptAllDevices: true})
    navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [0x0003, '00001800-0000-1000-8000-00805f9b34fb',
            '00001801-0000-1000-8000-00805f9b34fb',
            '0000febb-0000-1000-8000-00805f9b34fb',
            'adaf0001-4369-7263-7569-74507974686e']
    }).then(device => {
        console.log("CONNECTED!")
        console.log(device)
        device.gatt.connect().then(server => {
            console.log(server)
            server.getPrimaryService('0000febb-0000-1000-8000-00805f9b34fb').then(service => {
                service.getCharacteristics().then(chars => {
                    console.log(chars)
                })
                console.log(service)
                service.getCharacteristic('adaf0100-4369-7263-7569-74507974686e').then(characteristic => {
                    console.log(characteristic)
                    console.log("READing...")
                    // characteristic.getDescriptor('gatt.characteristic_user_description').then(desc => {
                    //     console.log("Description");
                    //     console.log(desc);

                    // })
                    characteristic.addEventListener('characteristicvaluechanged',
                        readUpdate);
                    characteristic.readValue().then((val) => {
                        console.log(val)
                        console.log("DONE!!!")

                    })
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
