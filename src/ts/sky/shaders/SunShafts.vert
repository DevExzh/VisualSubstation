varying vec2 vUv;
varying vec2 vUv1;
varying vec2 vBlurVector;

uniform vec4 _SunPosition;
uniform vec4 _BlurRadius4;

void main() {
    vUv = uv;
    vUv1 = uv;

    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewPosition;

    vBlurVector = (_SunPosition.xy - uv) * _BlurRadius4.xy;
}