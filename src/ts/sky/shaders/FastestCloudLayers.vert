uniform float _OneOverGamma;
uniform vec3 _CloudColor;
uniform vec3 _LocalSunDirection;
uniform vec3 _LocalMoonDirection;
uniform float _SunGlow;
uniform float _MoonGlow;
uniform float _CloudDensity;
uniform float _CloudSharpness;
uniform vec2 _CloudScale1;
uniform vec4 _CloudUV;

varying vec3 vColor;
varying vec2 vCloudUV;
varying vec3 vParams;

void main() {
    vec3 vertnorm = normalize(position.xyz);
    vec2 vertuv = vertnorm.xz / pow(vertnorm.y + 0.1, 0.75);
    float vertfade = clamp(100.0 * vertnorm.y * vertnorm.y, 0.0, 1.0);

    vec3 sunvec = -_LocalSunDirection;
    vec3 moonvec = -_LocalMoonDirection;

    vColor = pow(_CloudColor, vec3(_OneOverGamma));
    vCloudUV = (vertuv + _CloudUV.xy) / _CloudScale1;
    vParams.x = _CloudDensity * vertfade;
    vParams.y = pow(_MoonGlow * max(0.0, dot(normal, moonvec)) + _SunGlow * max(0.0, dot(normal, sunvec)), 10.0);
    vParams.z = _CloudSharpness * 0.15 - max(0.0, 1.0 - _CloudSharpness) * 0.3;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}