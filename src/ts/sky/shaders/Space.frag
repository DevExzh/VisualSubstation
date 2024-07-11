uniform sampler2D _MainTex;
uniform float _Subtract;

varying vec2 vUv;

void main() {
    vec3 texColor = texture2D(_MainTex, vUv).rgb;
    vec3 resultColor = max(texColor - _Subtract, 0.0);
    gl_FragColor = vec4(resultColor, 1.0);
}