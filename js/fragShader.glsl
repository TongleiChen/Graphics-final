#version 300 es
precision highp float;
in vec2 vTextureCoord;
in vec3 vLighting;
uniform int texture_num;
uniform sampler2D uSampler0;
uniform sampler2D uSampler1;
out vec4 fragColor;


void main(void) {
    if (texture_num == 1){
        vec4 texelColor = texture(uSampler0, vTextureCoord);
        fragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
    }else{
    vec4 texelColor1 = texture(uSampler0, vTextureCoord);
    vec4 texelColor2 = texture(uSampler1, vTextureCoord);


    // fragColor = vec4(mix(texelColor1.rgb, texelColor2.rgb, 0.5) * vLighting, texelColor1.a);
    fragColor = vec4((texelColor1.rgb + texelColor2.rgb*0.5) * vLighting, texelColor1.a);

    }

}