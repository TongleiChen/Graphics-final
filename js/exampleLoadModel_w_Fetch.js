let obj; // used for debugging in web-browser console

let ModelMaterialsArray = []; // an array of materials
let ModelAttributeArray = []; // vertices, normals, textcoords, uv

/**
 * Entry Point for HTML <body onload() >
 * Uses Asynchronous HTTP request to load 3D Mesh Model in JSON format
 * 
 */
let camera;
document.addEventListener("keydown", ProcessKeyPressedEvent, false )

class Camera{
    
    /**
     * Initialize member variables and create
     */
    constructor(){
        // our lookAt matrix
        this.cameraMatrix = mat4.create();
  
        // lookAt Point. where camera is pointing. Initially looking down
        // -Z-axis
        this.viewDirectionVector = vec3.fromValues(0.0, 0.0, -1.0);
  
        // our default up vector always <0, 1, 0>
        this.upVector = vec3.fromValues(0.0, 1.0, 0.0);
  
        // or the eye vector. position of camera
        this.positionVector = vec3.fromValues(0.0, 0.0, 0.0);
  
        // amount we scale movement by
        this.delta = 0.25;
    }
    /*
    * moves a delta in direction of viewDirectionVector
    * creats a vector that is in direction of viewDirectionVector and scale-by delta
    * adds this vector to the viewDirectionVector and recomputes lookAt matrix
    */
    moveForward(){
        let deltaForward = vec3.create();
        vec3.scale(deltaForward, this.viewDirectionVector, this.delta);
        vec3.add(this.positionVector, this.positionVector, deltaForward )
        this.updateCameraMatrix();
    }
    moveBackward(){
      let deltaForward = vec3.create();
      vec3.scale(deltaForward, this.viewDirectionVector, this.delta);
      vec3.sub(this.positionVector, this.positionVector, deltaForward )
      this.updateCameraMatrix();
    }
    strafeLeft(){
        let rightAxis = vec3.create();
        vec3.cross(rightAxis, this.viewDirectionVector, this.upVector);
        vec3.scale(rightAxis, rightAxis, this.delta);
        vec3.sub(this.positionVector, this.positionVector, rightAxis);
        this.updateCameraMatrix();
  
        //let newPosition = v
    }
    strafeRight(){
        let rightAxis = vec3.create();
        vec3.cross(rightAxis, this.viewDirectionVector, this.upVector);
        vec3.scale(rightAxis, rightAxis, this.delta);
        vec3.add(this.positionVector, this.positionVector, rightAxis);
        this.updateCameraMatrix()
    }
    rotateLeft(){
      let rotateAxis = vec3.create();
      vec3.cross(rotateAxis, this.viewDirectionVector, this.upVector);
      vec3.scale(rotateAxis, rotateAxis, this.delta);
      vec3.sub(this.viewDirectionVector, this.viewDirectionVector, rotateAxis);
  
        this.updateCameraMatrix()
    }
    rotateRight(){
        // your code here...
        let rotateAxis = vec3.create();
        vec3.cross(rotateAxis, this.viewDirectionVector, this.upVector);
        vec3.scale(rotateAxis, rotateAxis, this.delta);
        vec3.add(this.viewDirectionVector, this.viewDirectionVector, rotateAxis);
  
        this.updateCameraMatrix()
    }
    moveUp(){
        let deltaUp = vec3.create();
        vec3.scale(deltaUp, this.upVector, this.delta);
        vec3.add(this.positionVector, this.positionVector, deltaUp);
        this.updateCameraMatrix();
    }
    moveDown(){
        let deltaUp = vec3.create();
          vec3.scale(deltaUp, this.upVector, this.delta);
          vec3.sub(this.positionVector, this.positionVector, deltaUp);
          this.updateCameraMatrix();
    }
  
    /** 
     * recaluates the lookAt matrix, call this member function after a move
     */
    updateCameraMatrix()
    {
        let deltaMove = vec3.create()
        vec3.add(deltaMove, this.positionVector, this.viewDirectionVector)
        mat4.lookAt(this.cameraMatrix, this.positionVector, deltaMove, this.upVector)
    }
  }
  function ProcessKeyPressedEvent(e){
    /**
      Process Camera Movement Key   
               w
            A    D
               S
    */
      if(e.code === "KeyW")
      {
          console.log("^^^^--Forward")
          camera.moveForward()
      }
      if(e.code === "KeyS"){
        console.log("vvvvv--Backward")
        camera.moveBackward()
      }
      if(e.code === "KeyA"){
        console.log("<<<--Strafe Left")
        camera.strafeLeft()
      }
      if(e.code === "KeyD"){
        console.log(">>--Strafe Right")
        camera.strafeRight()
      }
      if(e.code === "KeyI"){
        console.log("^^--Up")
        camera.moveUp()
      }
      if(e.code === "KeyK"){
        console.log("vvv--Down")
        camera.moveDown()
      
      
      }
      if(e.code === "KeyJ"){
        console.log("<<--Rotate Left")
        camera.rotateLeft()
      }
      if(e.code === "KeyL"){
        console.log(">>--Rotate Right")
        camera.rotateRight()
      }
    console.log(e)
    
  }


function createShader(gl, type, source){
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }
   
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

// we need a function to link shaders into a program
function createProgram(gl, vertexShader, fragmentShader){
    let  program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }
   
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  }
function myMain() {

    /**
    *   Load external model. The model is stored in
        two Arrays
            * ModelMaterialsArray[]
                each index has set material of uniforms for a draw call
                {ambient, diffuse, specular, ...}

            * ModelAttributeArray[]
                each index contains set of attributes for a draw call
                {vertices, normals, texture coords, indices and materialindex number}

                the materialindex number specifies which index in the ModelMaterialsArray[]
                has the illumination uniforms for this draw call

    */

    // uri is relative to directory containing HTML page
    camera = new Camera();
    // loadExternalJSON('./model/crate.json');
    loadExternalJSON('./model/Mars 2K.json');
    

    

    console.log("ModelMaterialsArray.length");
}

function setUpWebGL() {
        // get webGL context
    let canvas = document.querySelector("#c");
  
    /** @type {WebGLRenderingContext} */
    let gl = canvas.getContext('webgl2'); 

    // create a shader program
    /* compile vertex shader source
     compile fragment shader source
     create program (using vertex and shader)
    */
        // create shader program
        // setup attribute buffers
        // draw/Renderloop


        // Set clear color to black, fully opaque
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // Clear the color buffer with specified clear color
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Vertex shader program

  const vsSource = `#version 300 es

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
`;

  // Fragment shader program

  const fsSource = `#version 300 es
  precision highp float;
  in vec2 vTextureCoord;
  in vec3 vLighting;
  uniform sampler2D uSampler;
  out vec4 fragColor;
  

  void main(void) {
    vec4 texelColor = texture(uSampler, vTextureCoord);

    fragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
  }
`;


  const program = initprogram(gl, vsSource, fsSource);

  const programInfo = {
    program: program,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(program, "aVertexPosition"),
      vertexNormal: gl.getAttribLocation(program, "aVertexNormal"),
      textureCoord: gl.getAttribLocation(program, "aTextureCoord"),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(
        program,
        "uProjectionMatrix"
      ),
      modelViewMatrix: gl.getUniformLocation(program, "uModelViewMatrix"),
      cameraViewMatrix: gl.getUniformLocation(program, "uCameraViewMatrix"),
      uSampler: gl.getUniformLocation(program, "uSampler"),
      ambientLightColor: gl.getUniformLocation(program, "ambientLightColor"),
      lightDirection: gl.getUniformLocation(program, "lightDirection"),
      diffuseLightColor: gl.getUniformLocation(program, "diffuseLightColor"),
      specularLightColor: gl.getUniformLocation(program, "specularLightColor"),
      shininess: gl.getUniformLocation(program, "shininess"),
      normalMatrix: gl.getUniformLocation(program, "normalMatrix"),
    },
  };

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  const buffers = initBuffers(gl);

  // Load texture
  // console.log('/texture/'+ ModelAttributeArray[0].textureFile);
  const texture = loadTexture(gl, './texture/'+ 'Mars_Diffuse_2K.png');
  // Flip image pixels into the bottom-to-top order that WebGL expects.
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  // Draw the scene repeatedly
  function render(now) {
    drawScene(gl, programInfo, buffers, texture,camera.cameraMatrix);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

}

/**
 * @function createModelAttributeArray - Extracts the Attributes from JSON and stores them in ModelAttribute Array
 * attributes include {vertices, normals, indices, and texture coordinates}
 * 
 * @param {JSON} obj2 3D Model in JSON Format
 */
function createModelAttributeArray(obj2) {
    // obj.mesh[x] is an array of attributes
    // vertices, normals, texture coord, indices

    // get number of meshes
    // console.log(obj2);
    let numMeshIndexs = obj2.meshes.length;
    let idx = 0;
    for (idx = 0; idx < numMeshIndexs; idx++) {
        let modelObj = {};

        // get vertices
        modelObj.vertices = obj2.meshes[idx].vertices;
        // normals (if they exists)
        modelObj.normals = obj2.meshes[idx].normals;
        // texture coordinates (if they exists)
        modelObj.textCoord = obj2.meshes[idx].texturecoords[0];
        console.log("here")

        // indices (for drawElements)

        modelObj.indices = [];
        for (let i = 0; i < obj2.meshes[idx].faces.length; i++){
            for (let j = 0; j < obj2.meshes[idx].faces[i].length; j++){
                modelObj.indices.push(obj2.meshes[idx].faces[i][j])
            }
        }
        // materialIndex (materials to use for these attributes)

        modelObj.materialIndex = obj2.meshes[idx].materialindex;
        /* similar for 
            normals (if they exists)
            texture coordinates (if they exists)
            texture (if it exists)
            indices (for drawElements)
            materialIndex (materials to use for these attributes)
        */
        // modelObj.textureFile = obj2.materials[modelObj.materialIndex].properties.find(x => x.key === '$tex.file').value;
        // push onto array
        ModelAttributeArray.push(modelObj);
    }
}
/**
 * @function createMaterialsArray - Extracts the Materials from JSON and stores them in ModelAttribute Array
 * attributes include {ambient, diffuse, shininess, specular and possible textures}
 * @param {JSON} obj2 3D Model in JSON Format
 * 
 */
function createMaterialsArray(obj2){
    console.log('In createMaterialsArray...');
    console.log(obj2.meshes.length);
    // length of the materials array
    // loop through array extracting material properties 
    // needed for rendering
    let itr = obj2.materials.length;
    let idx = 0;

    // each iteration extracts a group of materials from JSON 
    for (idx = 0; idx < itr; idx++) {
        let met = {};
        // shading 
        met.shadingm = obj2.materials[idx].properties[1].value;
        met.ambient = obj2.materials[idx].properties.find(x => x.key === '$clr.ambient').value;
        met.diffuse = obj2.materials[idx].properties.find(x => x.key === '$clr.diffuse').value;
        met.specular = obj2.materials[idx].properties.find(x => x.key === '$clr.specular').value;
        met.shininess = obj2.materials[idx].properties.find(x => x.key === '$mat.shininess').value;


        /**
         * similar for
         * ambient
         * diffuse
         * specular
         * shininess
         */


        // object containing all the illumination comp needed to 
        // illuminate faces using material properties for index idx
        ModelMaterialsArray.push(met);
    }
}


// load an external object using 
// newer fetch() and promises
// input is url for requested object
// 

/**
 * loadExternalJson - Loads a 3D Model (in JSON Format)
 *  1. request json file from server
 *  2. call createMaterialsArray 
 *     Populates JavaScript array with Model Materials {ambient, diffuse, shiniess, and textures}
 * 
 *  3. call crateModelAttributeArray
 *     Populates JavaScript array with Model Attributes {vertices, normals, textCoords, }
 * 
 *  4. call setUpWebGL
 *     create WebGL context
 *     Creates and binds buffers
 *     rendering loop
 * 
 * @param {uri} url -- the uri for the 3D Model to load. File should be a JSON format
 */
function loadExternalJSON(url) {
    fetch(url)
        .then((resp) => {
            // if the fetch does not result in an network error
            if (resp.ok)
                return resp.json(); // return response as JSON
            throw new Error(`Could not get ${url}`);
        })
        .then(function (ModelInJson) {
            // get a reference to JSON mesh model for debug or other purposes 
            obj = ModelInJson;
            createMaterialsArray(ModelInJson);
            createModelAttributeArray(ModelInJson);
            setUpWebGL();
        })
        .catch(function (error) {
            // error retrieving resource put up alerts...
            alert(error);
            console.log(error);
        });
}


function initBuffers(gl) {
    const positionBuffer = initPositionBuffer(gl);
  
    const textureCoordBuffer = initTextureBuffer(gl);
  
    const indexBuffer = initIndexBuffer(gl);
  
    const normalBuffer = initNormalBuffer(gl);
  
    return {
      position: positionBuffer,
      normal: normalBuffer,
      textureCoord: textureCoordBuffer,
      indices: indexBuffer,
    };
  }
  
  function initPositionBuffer(gl) {
    // Create a buffer for the square's positions.
    const positionBuffer = gl.createBuffer();
  
    // Select the positionBuffer as the one to apply buffer
    // operations to from here out.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  
    const positions = ModelAttributeArray[0].vertices;
  
    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  
    return positionBuffer;
  }
  

  
  function initIndexBuffer(gl) {
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  
    // This array defines each face as two triangles, using the
    // indices into the vertex array to specify each triangle's
    // position.
  
    const indices = ModelAttributeArray[0].indices;
  
    // Now send the element array to GL
  
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      gl.STATIC_DRAW
    );
  
    return indexBuffer;
  }
  
  function initTextureBuffer(gl) {
    const textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
  
    const textureCoordinates = ModelAttributeArray[0].textCoord;
  
  
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(textureCoordinates),
      gl.STATIC_DRAW
    );
  
    return textureCoordBuffer;
  }
  
  function initNormalBuffer(gl) {
    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  
    const vertexNormals = ModelAttributeArray[0].normals;
  
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(vertexNormals),
      gl.STATIC_DRAW
    );
  
    return normalBuffer;
  }
  function drawScene(gl, programInfo, buffers, texture, camera_view_matrix) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0); 
    gl.clearDepth(1.0); 
    gl.enable(gl.DEPTH_TEST); 
    gl.depthFunc(gl.LEQUAL); 
  
  
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  
  
    const fieldOfView = (45 * Math.PI) / 180; 
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();
  
  
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
  
  
    const modelViewMatrix = mat4.create();
  
  
    mat4.translate(
      modelViewMatrix, 
      modelViewMatrix, 
      [-1.0, -0.5, -6.0]
    ); 
  
    
    setPositionAttribute(gl, buffers, programInfo);
  
    setTextureAttribute(gl, buffers, programInfo);
  
  
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
  
    setNormalAttribute(gl, buffers, programInfo);
  
  
    gl.useProgram(programInfo.program);
  
    gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix,false,projectionMatrix);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix,false,modelViewMatrix);
    gl.uniformMatrix4fv(programInfo.uniformLocations.cameraViewMatrix,false,camera_view_matrix);
    // var normalMatrix = mat4.create();
    const normalMatrix = mat4.create();
    mat4.invert(normalMatrix, modelViewMatrix);
    mat4.transpose(normalMatrix, normalMatrix);
  
    gl.uniformMatrix4fv(
      programInfo.uniformLocations.normalMatrix,
      false,
      normalMatrix
    );
    
    gl.uniform3fv(programInfo.uniformLocations.diffuseLightColor, ModelMaterialsArray[ModelAttributeArray[0].materialIndex].diffuse);
    gl.uniform3fv(programInfo.uniformLocations.lightDirection, [-5.0, 1.0, 1.0]);
    gl.uniform3fv(programInfo.uniformLocations.ambientLightColor, ModelMaterialsArray[ModelAttributeArray[0].materialIndex].ambient);
    
    gl.uniform3fv(programInfo.uniformLocations.specularLightColor, ModelMaterialsArray[ModelAttributeArray[0].materialIndex].specular);
    gl.uniform1f(programInfo.uniformLocations.shininess, ModelMaterialsArray[ModelAttributeArray[0].materialIndex].shininess);
    
      
      
  
    gl.activeTexture(gl.TEXTURE0);
  
  
    gl.bindTexture(gl.TEXTURE_2D, texture);
  
  
    gl.uniform1i(programInfo.uniformLocations.uSampler, 0);
  
    const vertexCount = ModelAttributeArray[0].indices.length;
    // console.log(buffers.indices.length)
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }
  
  
  function setPositionAttribute(gl, buffers, programInfo) {
    const numComponents = 3;
    const type = gl.FLOAT; 
    const normalize = false; 
    const stride = 0; 
    const offset = 0; 
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexPosition,
      numComponents,
      type,
      normalize,
      stride,
      offset
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
  }
  
  
  
  function setTextureAttribute(gl, buffers, programInfo) {
    const num = 2; 
    const type = gl.FLOAT; 
    const normalize = false; 
    const stride = 0; 
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
    gl.vertexAttribPointer(
      programInfo.attribLocations.textureCoord,
      num,
      type,
      normalize,
      stride,
      offset
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
  }
  
  
  function setNormalAttribute(gl, buffers, programInfo) {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexNormal,
      numComponents,
      type,
      normalize,
      stride,
      offset
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);
  }

  function initprogram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  
    // Create the shader program
  
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
  
    // If creating the shader program failed, alert
  
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      alert(
        `Unable to initialize the shader program: ${gl.getProgramInfoLog(
          program
        )}`
      );
      return null;
    }
  
    return program;
  }
  
  //
  // creates a shader of the given type, uploads the source and
  // compiles it.
  //
  function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
  
    // Send the source to the shader object
  
    gl.shaderSource(shader, source);
  
    // Compile the shader program
  
    gl.compileShader(shader);
  
    // See if it compiled successfully
  
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert(
        `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`
      );
      gl.deleteShader(shader);
      return null;
    }
  
    return shader;
  }
  
  //
  // Initialize a texture and load an image.
  // When the image finished loading copy it into the texture.
  //
  function loadTexture(gl, url) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
  
    // Because images have to be downloaded over the internet
    // they might take a moment until they are ready.
    // Until then put a single pixel in the texture so we can
    // use it immediately. When the image has finished downloading
    // we'll update the texture with the contents of the image.
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
    gl.texImage2D(
      gl.TEXTURE_2D,
      level,
      internalFormat,
      width,
      height,
      border,
      srcFormat,
      srcType,
      pixel
    );
  
    const image = new Image();
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        level,
        internalFormat,
        srcFormat,
        srcType,
        image
      );
  
      // WebGL1 has different requirements for power of 2 images
      // vs non power of 2 images so check if the image is a
      // power of 2 in both dimensions.
      if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
        // Yes, it's a power of 2. Generate mips.
        gl.generateMipmap(gl.TEXTURE_2D);
      } else {
        // No, it's not a power of 2. Turn off mips and set
        // wrapping to clamp to edge
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      }
    };
    image.src = url;
  
    return texture;
  }
  
  function isPowerOf2(value) {
    return (value & (value - 1)) === 0;
  }