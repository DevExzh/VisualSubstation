uniform sampler2D _MainTex;
uniform vec4 _Color;

varying vec2 vUv;

void main() {
    float alpha = texture2D(_MainTex, vUv).a;
    vec4 color = alpha * _Color.a * _Color * 2.0;
    gl_FragColor = color;
}