uniform sampler2D _NoiseTexture1;
uniform sampler2D _NoiseTexture2;
uniform float _Alpha;
uniform float _CloudDensity;
uniform float _CloudSharpness;

varying vec4 vCloudUV;

void main() {
    float alpha1 = texture2D(_NoiseTexture1, vCloudUV.xy).a;
    float alpha2 = texture2D(_NoiseTexture2, vCloudUV.zw).a;
    float alpha = pow(alpha1 * alpha2, _CloudSharpness) * _CloudDensity;

    gl_FragColor = vec4(0.0, 0.0, 0.0, clamp(alpha, 0.0, 1.0) * _Alpha);
}