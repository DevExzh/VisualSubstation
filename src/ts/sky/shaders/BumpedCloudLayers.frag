uniform sampler2D _NoiseTexture1;
uniform sampler2D _NoiseTexture2;
uniform sampler2D _NoiseNormals1;
uniform sampler2D _NoiseNormals2;
uniform float _CloudSharpness;

varying vec3 vColor;
varying vec4 vCloudUV;
varying vec3 vLightDir;
varying vec3 vParams;

vec3 UnpackNormal(vec4 packedNormal) {
    return 2.0 * packedNormal.xyz - 1.0;
}

void main() {
    vec4 color = vec4(vColor, 1.0);

    float noise1 = texture2D(_NoiseTexture1, vCloudUV.xy).a;
    float noise2 = texture2D(_NoiseTexture2, vCloudUV.zw).a;
    float a = pow(noise1 * noise2, _CloudSharpness) * vParams.x;
    float d = 0.1 + 1.0 / exp(0.2 * a);

    color.a = clamp(a, 0.0, 1.0);

    vec4 noiseNormal1 = texture2D(_NoiseNormals1, vCloudUV.xy);
    vec4 noiseNormal2 = texture2D(_NoiseNormals2, vCloudUV.zw);
    vec3 cloud_normal = UnpackNormal(0.5 * (noiseNormal1 + noiseNormal2));
    float cloud_shading = (1.0 + dot(cloud_normal, vLightDir)) / 2.0;

    color.rgb += vParams.y * clamp(1.5 - a, 0.0, 1.0);
    color.rgb *= 0.1 + pow(cloud_shading, vParams.z);
    color.rgb *= d;

    gl_FragColor = color;
}