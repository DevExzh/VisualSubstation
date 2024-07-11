uniform sampler2D _NoiseTexture;
uniform float _Alpha;
uniform float _CloudDensity;

varying vec4 vCloudUV;
varying float vShape;

void main() {
    float alpha1 = texture2D(_NoiseTexture, vCloudUV.xy).a;
    float alpha2 = texture2D(_NoiseTexture, vCloudUV.zw).a;
    float alpha = (alpha1 * alpha2) - vShape * _CloudDensity;

    gl_FragColor = vec4(0.0, 0.0, 0.0, clamp(alpha, 0.0, 1.0) * _Alpha);
}