varying vec2 vTexCoord;
varying vec3 vNormal;
varying vec3 vShadeDir;
varying float vShading;

uniform sampler2D _MainTex;
uniform vec3 _Color;
uniform float _Contrast;

void main()
{
    vec3 color = _Color;

    float shading = vShading * max(0.0, dot(vNormal, vShadeDir));

    vec3 moontex = texture2D(_MainTex, vTexCoord).rgb;
    color *= moontex * shading;

    gl_FragColor = vec4(pow(color, vec3(_Contrast)), 1.0);
}