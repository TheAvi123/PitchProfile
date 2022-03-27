import React, { useRef, Suspense } from "react";
import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import * as dat from "dat.gui";
import * as THREE from "three";
import vShader from './shaders/vertex.glsl.js';
import fShader from './shaders/fragment.glsl.js';

const visualizationSize = 2;

const sensorData = {
    s1: {
        x: 1,
        y: 0,
        z: 0,
        pressure: 1.00
    },
    s2: {
        x: 1 / Math.sqrt(5),
        y: 2 / Math.sqrt(5),
        z: 0,
        pressure: 0.40
    },
    s3: {
        x: 1 / Math.sqrt(5),
        y: (5 - Math.sqrt(5)) / 10,
        z: Math.sqrt((5 + Math.sqrt(5)) / 10),
        pressure: 0.75
    },
    s4: {
        x: 1 / Math.sqrt(5),
        y: (-5 - Math.sqrt(5)) / 10,
        z: Math.sqrt((5 - Math.sqrt(5)) / 10),
        pressure: 0.55
    },
    s5: {
        x: 1 / Math.sqrt(5),
        y: (-5 - Math.sqrt(5)) / 10,
        z: -Math.sqrt((5 - Math.sqrt(5)) / 10),
        pressure: 0.60
    },
    s6: {
        x: 1 / Math.sqrt(5),
        y: (5 - Math.sqrt(5)) / 10,
        z: -Math.sqrt((5 + Math.sqrt(5)) / 10),
        pressure: 0.25
    },
    s7: {
        x: -1,
        y: 0,
        z: 0,
        pressure: 0.0
    },
    s8: {
        x: -1 / Math.sqrt(5),
        y: -2 / Math.sqrt(5),
        z: 0,
        pressure: 0.15
    },
    s9: {
        x: -1 / Math.sqrt(5),
        y: (-5 + Math.sqrt(5)) / 10,
        z: -Math.sqrt((5 + Math.sqrt(5)) / 10),
        pressure: 0.35
    },
    s10: {
        x: -1 / Math.sqrt(5),
        y: (5 + Math.sqrt(5)) / 10,
        z: -Math.sqrt((5 - Math.sqrt(5)) / 10),
        pressure: 0.9
    },
    s11: {
        x: -1 / Math.sqrt(5),
        y: (5 + Math.sqrt(5)) / 10,
        z: Math.sqrt((5 - Math.sqrt(5)) / 10),
        pressure: 0.95
    },
    s12: {
        x: -1 / Math.sqrt(5),
        y: (-5 + Math.sqrt(5)) / 10,
        z: Math.sqrt((5 + Math.sqrt(5)) / 10),
        pressure: 0.2
    },
}

let sPositions = []
let sPressures = []

for (let sensorName in sensorData) {
    let sensor = sensorData[sensorName]
    sPositions.push(new THREE.Vector3(sensor.x, sensor.y, sensor.z));
    sPressures.push(sensor.pressure);
}

const gui = new dat.GUI();

for (var sensor of Object.keys(sensorData)) {
    gui.add(sensorData[sensor], "pressure", 0, 1, 0.01)
}

const pressureMaterial = new THREE.ShaderMaterial({
    vertexShader: vShader,
    fragmentShader: fShader,
    uniforms: {
        sensorPositions: { value: sPositions },
        sensorPressures: { value: sPressures },
    }
});

const wireframeMaterial = new THREE.MeshStandardMaterial({
    wireframe: true,
    wireframeLinewidth: 10.0,
});

const Visualization = () => {
    const ref = useRef();
    useFrame(() => {
        sPressures = []
        for (let sensorName in sensorData) {
            let sensor = sensorData[sensorName]
            sPressures.push(sensor.pressure);
        }
        ref.current.material.uniforms.sensorPressures.value = sPressures
    })
    return (
        <mesh
            scale={visualizationSize}
            geometry={new THREE.IcosahedronGeometry(1, 64)}
            material={pressureMaterial}
            ref={ref}
        />
    )
}

const PressureBall = () => {
    return (
        <Canvas>
            <color attach="background" args={["grey"]} />
            <OrbitControls />
            <Suspense fallback={null}>
                <Visualization />
            </Suspense>
            <mesh
                scale={visualizationSize}
                geometry={new THREE.IcosahedronGeometry(1.01, 8)}
                material={wireframeMaterial}
            />
        </Canvas>
    )
}

export default PressureBall;