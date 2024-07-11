uniform vec4 _MainTex_ST;

varying vec2 vUv;

void main() {
    vec3 vertnorm = normalize(position.xyz);
    vec2 starUV = vertnorm.xz / (vertnorm.y + 1.0);

    vUv = starUV * _MainTex_ST.xy + _MainTex_ST.zw;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}