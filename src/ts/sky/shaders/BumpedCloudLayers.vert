uniform float _OneOverGamma;
uniform vec3 _CloudColor;
uniform vec3 _LocalSunDirection;
uniform vec3 _LocalMoonDirection;
uniform vec3 _LocalLightDirection;

uniform float _SunGlow;
uniform float _MoonGlow;
uniform float _CloudDensity;
uniform vec2 _CloudScale1;
uniform vec2 _CloudScale2;
uniform vec4 _CloudUV;

attribute vec3 tangent;

varying vec3 vColor;
varying vec4 vCloudUV;
varying vec3 vLightDir;
varying vec3 vParams; // density, glow, gammahalf

void main() {
    vec3 vertnorm = normalize(position);
    vec2 vertuv = vertnorm.xz / pow(vertnorm.y + 0.1, 0.75);
    float vertfade = clamp(100.0 * vertnorm.y * vertnorm.y, 0.0, 1.0);

    vec3 lightvec = -_LocalLightDirection;
    vec3 sunvec = -_LocalSunDirection;
    vec3 moonvec = -_LocalMoonDirection;

    vColor = pow(_CloudColor, vec3(_OneOverGamma));
    vCloudUV.xy = (vertuv + _CloudUV.xy) / _CloudScale1;
    vCloudUV.zw = (vertuv + _CloudUV.zw) / _CloudScale2;
    vParams.x = _CloudDensity * vertfade;
    vParams.y = pow(_MoonGlow * max(0.0, dot(normal, moonvec)) + _SunGlow * max(0.0, dot(normal, sunvec)), 10.0) * _OneOverGamma * 0.5;
    vParams.z = _OneOverGamma * 0.5;

    mat3 rotation = mat3(normalize(tangent), normalize(cross(normal, tangent)), normal);
    vLightDir = rotation * lightvec;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
