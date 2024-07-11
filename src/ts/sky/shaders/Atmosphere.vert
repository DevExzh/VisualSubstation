uniform vec3 _LocalSunDirection;
uniform vec3 _LocalMoonDirection;
uniform vec3 _SunColor;
uniform vec3 _MoonColor;
uniform vec4 _AdditiveColor;
uniform vec3 _CloudColor;
uniform vec4 _MoonHaloColor;

uniform float _Contrast;
uniform float _Haziness;
uniform float _Horizon;
uniform float _Fogginess;
uniform vec2 _OpticalDepth;
uniform vec3 _OneOverBeta;
uniform vec3 _BetaRayleigh;
uniform vec3 _BetaRayleighTheta;
uniform vec3 _BetaMie;
uniform vec3 _BetaMieTheta;
uniform vec2 _BetaMiePhase;
uniform vec3 _BetaNight;

varying vec4 vColor;

vec3 L(vec3 viewdir, vec3 sundir) {
    vec3 res;
    float cosTheta = max(0.0, dot(viewdir, sundir));
    float angular = (1.0 + cosTheta * cosTheta);
    vec3 betaTheta = _BetaRayleighTheta + _BetaMieTheta / pow(_BetaMiePhase.x - _BetaMiePhase.y * cosTheta, 1.5);
    res = angular * betaTheta * _OneOverBeta;
    return res;
}

vec3 L() {
    return _BetaNight;
}

vec3 T(float height) {
    vec3 res;
    float h = clamp(height + _Horizon, 0.001, 1.0);
    float f = pow(h, _Haziness);
    float sh = (1.0 - f) * 190000.0;
    float sr = sh + f * (_OpticalDepth.x - sh);
    float sm = sh + f * (_OpticalDepth.y - sh);
    vec3 beta = _BetaRayleigh * sr + _BetaMie * sm;
    res = exp(-beta);
    return res;
}

void main() {
    vec3 viewdir = normalize(normalMatrix * normal);
    vec3 T_val  = T(viewdir.y);
    vec3 E_sun  = _SunColor;
    vec3 E_moon = _MoonColor;
    vec3 L_sun  = L(-viewdir, _LocalSunDirection);
    vec3 L_moon = L();
    vColor.rgb = (1.0 - T_val) * (E_sun * L_sun + E_moon * L_moon);
    vColor.a   = 10.0 * max(max(vColor.r, vColor.g), vColor.b);
    vColor += _MoonHaloColor * pow(max(0.0, dot(_LocalMoonDirection, -viewdir)), 10.0);
    vColor += _AdditiveColor;
    vColor.rgb = mix(vColor.rgb, _CloudColor, _Fogginess);
    vColor.a += _Fogginess;
    vColor.a = clamp(vColor.a, 0.0, 1.0);
    vColor.rgb = pow(vColor.rgb, vec3(_Contrast));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}