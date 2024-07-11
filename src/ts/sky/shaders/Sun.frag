uniform sampler2D _MainTex;
uniform vec4 _Color;
uniform float _SinTime;

varying vec2 vUv;

void main() {
    float alpha = texture2D(_MainTex, vUv).a;
    float time = 1.0 + abs(0.25 * _SinTime);
    vec4 color = alpha * _Color.a * _Color * 2.0 * time;
    gl_FragColor = color;
}