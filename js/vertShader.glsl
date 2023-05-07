#version 300 es

in vec4 aVertexPosition;
in vec3 aVertexNormal;
in vec2 aTextureCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uCameraViewMatrix;
uniform mat4 normalMatrix;
uniform vec3 ambientLightColor;
uniform vec3 specularLightColor;
uniform vec3 lightDirection;
uniform vec3 diffuseLightColor;
uniform float shininess;
out vec2 vTextureCoord;
out vec3 vLighting;

void main(void) {
gl_Position = uProjectionMatrix * uCameraViewMatrix * uModelViewMatrix * aVertexPosition;
vTextureCoord = aTextureCoord;

// Apply lighting effect
vec3 Ia = ambientLightColor;
vec3 N = normalize(vec3( normalMatrix * vec4(aVertexNormal, 0.0)));
vec3 fragPosition = vec3(uModelViewMatrix * aVertexPosition) ;
vec3 diffuseLightDirection = normalize( lightDirection - fragPosition); // get a vector from point to light source
vec3 L = diffuseLightDirection ; 
float lambert = max(0.0, dot(N, L));
vLighting = diffuseLightColor  * lambert + Ia;
// Specular lighting
vec3 V = normalize(-fragPosition);
vec3 R = reflect(-L, N);
float specular = pow(max(dot(R, V), 0.0), shininess);

vLighting = diffuseLightColor * lambert + specularLightColor * specular + Ia;
}