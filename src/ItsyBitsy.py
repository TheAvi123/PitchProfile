import math
import time
import json
import board
import random
from analogio import AnalogIn
from adafruit_ble import BLERadio
from adafruit_ble.services.nordic import UARTService
from adafruit_ble.advertising.standard import ProvideServicesAdvertisement

class sensor:
    def __init__(self, boardInput):
        self.boardInput = boardInput

    def get_voltage(self):
        return random.uniform(0.0, 1.0) # (AnalogIn(self.boardInput).value * 3.3) / 65536

numSensors = 12
boardValues = [board.A0, board.A1, board.A2, board.A3, board.A4, board.A5, board.D10, board.D11]
sensorArray = []

for i in range(numSensors):
    sensorArray.append(sensor(board.A0)) # board_values[i]))

def getPressureData():
    pressureData = {}
    for i in range(numSensors):
        pressureData["s" + str(i+1)] = sensorArray[i].get_voltage()
    return json.dumps(pressureData)

ble = BLERadio()
uart = UARTService()
advertisement = ProvideServicesAdvertisement(uart)

while True:
    print("Starting...")
    ble.start_advertising(advertisement)
    print("Waiting to Connect...")
    while not ble.connected:
        pass
    print("Connected!")
    tick = 0
    while ble.connected:
        # print("Waiting to Read...")
        # one_byte = uart.read(10)
        # print("Read Successful " + str(tick))
        # print(one_byte)
        # if one_byte:
        #     print(one_byte)
        #     uart.write(one_byte)
        # else:
        time.sleep(3.5)
        data = getPressureData()
        print(data)
        uart.write(data)
        print("Write Complete!")
        tick += 1

    print("Disconnected.")
