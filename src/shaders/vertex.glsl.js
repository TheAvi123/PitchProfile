const vertexShader = /* glsl */ ` 

  varying vec3 vNormal;
  out vec3 vPos;
  
  void main() {
    vNormal = normal;
    vPos = position;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }  
`;

export default vertexShader;