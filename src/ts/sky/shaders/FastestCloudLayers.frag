uniform sampler2D _NoiseTexture;
uniform float _CloudSharpness;

varying vec3 vColor;
varying vec2 vCloudUV;
varying vec3 vParams;

void main() {
    vec4 color = vec4(vColor, 1.0);

    float noise1 = texture2D(_NoiseTexture, vCloudUV).a;
    float a = (noise1 - vParams.z) * vParams.x;
    float d = 0.1 * a;

    color.a = clamp(a, 0.0, 1.0);

    color.rgb += vParams.y * clamp(1.5 - a, 0.0, 1.0);
    color.rgb -= d;

    gl_FragColor = color;
}