uniform vec3 color;
uniform sampler2D map;
varying float vSprite;
varying float vOpacity;
void main() {
    vec2 texCoord = vec2(
        gl_PointCoord.x * 0.25 + vSprite,
        gl_PointCoord.y
    );
    gl_FragColor = vec4(texture2D( map, texCoord ).xyz * color, vOpacity);
}