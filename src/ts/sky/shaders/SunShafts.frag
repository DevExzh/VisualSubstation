uniform sampler2D _MainTex;
uniform sampler2D _ColorBuffer;
uniform sampler2D _CameraDepthTexture;

uniform vec4 _SunColor;
uniform vec4 _BlurRadius4;
uniform vec4 _SunPosition;
uniform vec4 _MainTex_TexelSize;

varying vec2 vUv;
varying vec2 vUv1;
varying vec2 vBlurVector;

const float SAMPLES_FLOAT = 6.0;
const int SAMPLES_INT = 6;

float TransformColor(vec4 skyboxValue) {
    return max(1.01 - skyboxValue.a, dot(skyboxValue.rgb, vec3(0.59, 0.3, 0.11)));
}

vec4 frag_depth() {
    float depthSample = texture2D(_CameraDepthTexture, vUv1).r;
    depthSample = Linear01Depth(depthSample);

    vec4 tex = texture2D(_MainTex, vUv);

    vec2 vec = _SunPosition.xy - vUv1;
    float dist = saturate(_SunPosition.w - length(vec));

    vec4 outColor = vec4(0.0);

    if (depthSample > 0.99) {
        outColor = vec4(TransformColor(tex) * dist);
    }

    return outColor;
}

vec4 frag_nodepth() {
    vec4 tex = texture2D(_MainTex, vUv);

    vec2 vec = _SunPosition.xy - vUv1;
    float dist = saturate(_SunPosition.w - length(vec));

    return vec4(TransformColor(tex) * dist);
}

vec4 frag_radial() {
    vec4 color = vec4(0.0);
    vec2 uv = vUv;

    for (int j = 0; j < SAMPLES_INT; j++) {
        vec4 tmpColor = texture2D(_MainTex, uv);
        color += tmpColor;
        uv += vBlurVector;
    }

    return color / SAMPLES_FLOAT;
}

vec4 frag_screen() {
    vec4 colorA = texture2D(_MainTex, vUv);
    vec4 colorB = texture2D(_ColorBuffer, vUv1);
    vec4 depthMask = saturate(colorB * _SunColor);
    return 1.0 - (1.0 - colorA) * (1.0 - depthMask);
}

vec4 frag_add() {
    vec4 colorA = texture2D(_MainTex, vUv);
    vec4 colorB = texture2D(_ColorBuffer, vUv1);
    vec4 depthMask = saturate(colorB * _SunColor);
    return colorA + depthMask;
}

void main() {
    // Placeholder to choose the correct fragment function to call
    gl_FragColor = frag_screen(); // This is just a placeholder function call
}