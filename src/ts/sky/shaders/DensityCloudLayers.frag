uniform sampler2D _NoiseTexture1;
uniform sampler2D _NoiseTexture2;
uniform float _CloudSharpness;

varying vec3 vColor;
varying vec4 vCloudUV;
varying vec2 vParams;

void main() {
    vec4 color = vec4(vColor, 1.0);

    float noise1 = texture2D(_NoiseTexture1, vCloudUV.xy).a;
    float noise2 = texture2D(_NoiseTexture2, vCloudUV.zw).a;
    float a = pow(noise1 * noise2, _CloudSharpness) * vParams.x;
    float d = 0.05 * a * a;

    color.a = clamp(a, 0.0, 1.0);

    color.rgb += vParams.y * clamp(1.5 - a, 0.0, 1.0);
    color.rgb -= d;

    gl_FragColor = color;
}