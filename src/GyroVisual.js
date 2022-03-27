import React, { Suspense } from "react";
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import * as THREE from "three";

const pointSize = 0.1;

const gyroData = [
    [-0.9, 1.3, 2.2],
    [-0.5, 0.9, 1.8],
    [-0.2, 0.7, 1.3],
    [0.0, 0.4, 1.2],
    [0.6, 0.2, 1.0],
    [0.8, 0.0, 0.7],
    [1.1, 0.5, 0.3],
    [1.5, 0.7, 0.1],
    [1.8, 1.2, -0.3],
    [2.0, 1.6, -0.5],
    [2.5, 1.9, -0.7],
    [2.8, 1.7, -1.0],
]

const calculateFadeColor = (fadePos) => {
    let color = new THREE.Color();
    color.setHSL(fadePos, 1, 0.5);
    return color;
}

const GyroPoint = (props) => {
    return (
        <mesh scale={pointSize} position={props.pointPosition}>
            <sphereBufferGeometry />
            <meshBasicMaterial color={calculateFadeColor(props.fadePosition)} />
        </mesh>
    )
}

const GyroVisual = () => {
    return (
        <Canvas>
            <color attach="background" args={["grey"]} />
            <OrbitControls />
            <Suspense fallback={null}>
                {gyroData.map((gPos, index) => {
                    return <GyroPoint key={index} fadePosition={index / gyroData.length} pointPosition={gPos} />
                })}
            </Suspense>
            <primitive object={new THREE.AxesHelper(5)} />
        </Canvas>
    )
}

export default GyroVisual;