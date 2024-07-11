uniform vec3 _LocalLightDirection;
uniform vec2 _CloudScale1;
uniform vec2 _CloudScale2;
uniform vec4 _CloudUV;
uniform mat4 _Projector;

varying vec4 vCloudUV;
varying float vShape;

void main() {
    vec3 vertnorm = -_LocalLightDirection;
    vec2 vertuv = vertnorm.xz / pow(vertnorm.y + 0.1, 0.75);

    vec4 projPos = _Projector * vec4(position, 1.0);
    vec2 uvoffset = 0.5 + projPos.xy / projPos.w;

    vCloudUV.xy = uvoffset + (vertuv + _CloudUV.xy) / _CloudScale1;
    vCloudUV.zw = uvoffset + (vertuv + _CloudUV.zw) / _CloudScale2;
    vShape = _CloudSharpness * 0.15 - max(0.0, 1.0 - _CloudSharpness) * 0.3;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}