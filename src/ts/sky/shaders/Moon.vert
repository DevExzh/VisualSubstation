varying vec2 vTexCoord;
varying vec3 vNormal;
varying vec3 vShadeDir;
varying float vShading;

uniform vec3 _WorldSpaceCameraPos;
uniform float _Phase;
uniform vec4 _MainTex_ST;

vec3 rightHandedVec3(vec3 leftHand) {
    return vec3(leftHand.x, leftHand.y, -leftHand.z);
}

vec3 ObjSpaceViewDir(vec3 vertex) {
    return (modelMatrix * vec4(vertex, 1.0)).xyz - _WorldSpaceCameraPos;
}

vec4 objectToClipPos(vec3 vertex) {
    return projectionMatrix * viewMatrix * modelMatrix * vec4(vertex, 1.0);
}

void main()
{
    float phaseabs = abs(_Phase);
    vec3 offset = vec3(_Phase, -phaseabs, -phaseabs) * 5.0;
    vec3 viewdir = (normalize(ObjSpaceViewDir(position)));

    gl_Position = objectToClipPos(position);
    vTexCoord = uv * _MainTex_ST.xy + _MainTex_ST.zw;
    vNormal = normal;
    vShadeDir = normalize(viewdir + offset);
    vShading = 2.0 * (1.0 - phaseabs);
}