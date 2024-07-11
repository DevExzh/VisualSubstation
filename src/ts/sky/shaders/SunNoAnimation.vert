uniform vec4 _MainTex_ST;

varying vec2 vUv;

void main() {
    vUv = uv * _MainTex_ST.xy + _MainTex_ST.zw;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}