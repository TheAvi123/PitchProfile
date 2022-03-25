const fragmentShader =  /* glsl */  `

  varying vec3 vNormal;
  varying vec3 vPos;

  uniform vec3 sensorPositions[12];
  uniform float sensorPressures[12];

  vec3 calcPressureColor(float pressure) {
    if (pressure <= 0.125) {
      float b = 0.5 + (0.5 * (pressure / 0.125));
      return vec3(0.0, 0.0, b);
    } else if (pressure <= 0.375) {
      float g = ((pressure - 0.125) / 0.25);
      return vec3(0.0, g, 1.0);
    } else if (pressure <= 0.625) {
      float r = ((pressure - 0.375) / 0.25);
      float b = 1.0 - r;
      return vec3(r, 1.0, b);
    } else if (pressure <= 0.875) {
      float g = 1.0 - ((pressure - 0.625) / 0.25);
      return vec3(1.0, g, 0.0);
    } else {
      float r = 1.0 - (0.5 * ((pressure - 0.875) / 0.125));
      return vec3(r, 0.0, 0.0);
    }
  }

  int[3] findClosestPoints(vec3 position) {
    int closestPointA = 0;
    float closestDistanceA = 100.0;
    for (int i = 0; i < 12; i++) {
      if (distance(position, sensorPositions[i]) < closestDistanceA) {
        closestDistanceA = distance(position, sensorPositions[i]);
        closestPointA = i;
      }
    }

    int closestPointB = 0;
    float closestDistanceB = 100.0;
    for (int i = 0; i < 12; i++) {
      if (distance(position, sensorPositions[i]) < closestDistanceB) {
        if (i == closestPointA) {
          continue;
        }
        closestDistanceB = distance(position, sensorPositions[i]);
        closestPointB = i;
      }
    }

    int closestPointC = 0;
    float closestDistanceC = 100.0;
    for (int i = 0; i < 12; i++) {
      if (distance(position, sensorPositions[i]) < closestDistanceC) {
        if (i == closestPointA || i == closestPointB) {
          continue;
        }
        closestDistanceC = distance(position, sensorPositions[i]);
        closestPointC = i;
      }
    }

    return int[3](closestPointA, closestPointB, closestPointC);
  }

  float calculateAveragePressure(vec3 position, int[3] points) {
    vec3 aPos = sensorPositions[points[0]];
    vec3 bPos = sensorPositions[points[1]];
    vec3 cPos = sensorPositions[points[2]];

    float dLen = dot(aPos - cPos, bPos - cPos) / distance(bPos, cPos);
    vec3 dPos = ((dLen / distance(bPos, cPos)) * (bPos - cPos)) + cPos;

    float factorBC = dot(position - cPos, bPos - cPos) / distance(cPos, bPos) / distance(cPos, bPos);
    float expFactorBC = pow((factorBC / (1.0 - factorBC)), 2.0);
    float finalFactorBC = expFactorBC / (1.0 + expFactorBC);

    float factorABC = dot(position - dPos, aPos - dPos) / distance(aPos, dPos) / distance(dPos, aPos);
    float expFactorABC = pow((factorABC / (1.0 - factorABC)), 2.0);
    float finalFactorABC = expFactorABC / (1.0 + expFactorABC);

    float pressureBC = sensorPressures[points[1]] * finalFactorBC + sensorPressures[points[2]] * (1.0-finalFactorBC);
    float pressureABC = sensorPressures[points[0]] * finalFactorABC + pressureBC * (1.0-finalFactorABC);
    return pressureABC;
  }

  void main() {
    float averagePressure = 0.0;

    int[3] closestPoints = findClosestPoints(vPos);

    float averagePressure1 = calculateAveragePressure(vPos, closestPoints);
    float averagePressure2 = calculateAveragePressure(vPos, int[3](closestPoints[1], closestPoints[2], closestPoints[0]));
    float averagePressure3 = calculateAveragePressure(vPos, int[3](closestPoints[2], closestPoints[0], closestPoints[1]));
    
    averagePressure = (averagePressure1 + averagePressure2 + averagePressure3) / 3.0;
    
    float alpha = 1.0;
    gl_FragColor = vec4(calcPressureColor(averagePressure), alpha);
  } 
`;

export default fragmentShader;