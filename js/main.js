let obj; // used for debugging in web-browser console

let ModelMaterialsArray = []; // an array of materials
let ModelAttributeArray = []; // vertices, normals, textcoords, uv
let TextureArray = [['Mars_Diffuse_2K.png',"Dust_2K.png","Clouds_2K.png","Bump_2K.png"],['base_color.jpg'],['Earth_Diffuse_2K.png','Earth_Bump_2K.png','Earth_Clouds_2K.png'],['Mercury_Diffuse_1K.png','Mercury_Bump_1K.png'],['Venus_Atmosphere_2K.png','Venus_Diffuse_1K.png'],['2k_sun.jpg'],['rocket.jpg','rocket.jpg','rocket.jpg','rocket.jpg','rocket.jpg','rocket.jpg'],['rocket.jpg','rocket.jpg','rocket.jpg','rocket.jpg','rocket.jpg','rocket.jpg']]; // store texture
let applyTexture = [[0,2],[0],[0,2],[0,1],[0,1],[0],[0],[0]];
let jsonFile = ['./model/Mars 2K.json','./model/Moon_2K.json','./model/Earth 2K.json','./model/Mercury 1K.json','./model/Venus_1K.json','./model/Moon_2K.json','./model/BUS.json'];
// let TextureArray = [["Clouds_2K.png","Bump_2K.png","Dust_2K.png",'Mars_Diffuse_2K.png']]; // store texture

/**
 * Entry Point for HTML <body onload() >
 * Uses Asynchronous HTTP request to load 3D Mesh Model in JSON format
 * 
 */
let camera;
let load_model = 0;
let sun_x = 0.5;
let sun_y = -0.5;
let sun_z = -15.0;
let sun_pos = [sun_x,sun_y,sun_z];
let translate_list = [[sun_x,sun_y,sun_z-45.0],[sun_x,sun_y,sun_z-10.0],[sun_x,sun_y,sun_z-30.0],[sun_x,sun_y,sun_z-5.0],[sun_x,sun_y,sun_z-10.0],sun_pos,[sun_x,sun_y,sun_z-32.0]];
// let translate_list = [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]];

let rotation_speed = [0.98,0.03,1.01,0.0172,-0.00412,0.04,0.1];
let revolution_speed = [1/684,1/365,1/365,1/87,1/227,0,1/200];
let revolution_center = [sun_pos,sun_pos,sun_pos,sun_pos,sun_pos,sun_pos,[sun_x,sun_y,sun_z-30.0]];
// let revolution_center = [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]];

let scale_size = [1.5,0.5,1.5,2.0,2.0,4.0,0.5];
let model_load_list = [];
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
    let model_num = 0;
    for (model_num = 0;model_num<jsonFile.length;model_num++){
      loadExternalJSON(jsonFile[model_num],model_num);
    }







    


    

    console.log("ModelMaterialsArray.length");
}

function loadShadersSetUp() {
  const vertexShaderPromise = fetch('./js/vertShader.glsl')
    .then(result => result.text());
  const fragmentShaderPromise = fetch('js/fragShader.glsl')
    .then(result => result.text());
  // Promise.all says "wait for these promises to finish, then
  //  call a function that takes the results as parameters"

  Promise.all([vertexShaderPromise, fragmentShaderPromise])
    .then(([vertexShaderText, fragmentShaderText]) => {
      console.log('here!!!')
      console.log(fragmentShaderText);
      setUpWebGL(vertexShaderText, fragmentShaderText);
    })
    .catch((error) => {
      console.error('Failed to load shader files', error);
    });
}

function setUpWebGL(vsSource,fsSource) {
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
      texture_num: gl.getUniformLocation(program, "texture_num"),
      uSampler0: gl.getUniformLocation(program, "uSampler0"),
      uSampler1:gl.getUniformLocation(program, "uSampler1"),
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
  let buffers_list = [];
  let idx_ = 0;
  let total  = model_load_list.length
  for (idx_ = 0;idx_< total;idx_++){
    const buffers = initBuffers(gl,idx_);
    buffers_list.push(buffers);
  }
  


  // Load texture
  // console.log('/texture/'+ ModelAttributeArray[0].textureFile);
  let texture_list = [];
  let idx = 0;
  
  for (idx = 0; idx<total;idx++){
    let model = model_load_list[idx][0];
    let index = model_load_list[idx][1];
    console.log('./texture/'+ TextureArray[model][index]);
    const texture = loadTexture(gl, './texture/'+ TextureArray[model][index]);
    texture_list.push(texture);

  }
  // Flip image pixels into the bottom-to-top order that WebGL expects.
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  // Draw the scene repeatedly
  function render(now) {
    drawScene(gl, programInfo, buffers_list, texture_list,camera.cameraMatrix,now);

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
function createModelAttributeArray(obj2,model_num) {
    // obj.mesh[x] is an array of attributes
    // vertices, normals, texture coord, indices

    // get number of meshes
    // console.log(obj2);
    let numMeshIndexs = obj2.meshes.length;
    let idx = 0;
    for (idx = 0; idx < numMeshIndexs; idx++) {
        let modelObj = {};

        // get vertices
        console.log("in create model");
        modelObj.vertices = obj2.meshes[idx].vertices;
        // normals (if they exists)
        modelObj.normals = obj2.meshes[idx].normals;
        // texture coordinates (if they exists)
        modelObj.textCoord = obj2.meshes[idx].texturecoords[0];
        

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
        model_load_list.push([model_num,idx]);
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
        // met.shadingm = obj2.materials[idx].properties[1].value;
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
    console.log(obj2);
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
function loadExternalJSON(url,model_num) {
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
            createModelAttributeArray(ModelInJson,model_num);
            if (load_model < 0){
              load_model+=1;
            }else{
              console.log(url);
              loadShadersSetUp();
            }

        })
        .catch(function (error) {
            // error retrieving resource put up alerts...
            alert(error);
            console.log(error);
        });
}


function initBuffers(gl,idx) {
    const positionBuffer = initPositionBuffer(gl,idx);
  
    const textureCoordBuffer = initTextureBuffer(gl,idx);
  
    const indexBuffer = initIndexBuffer(gl,idx);
  
    const normalBuffer = initNormalBuffer(gl,idx);
  
    return {
      position: positionBuffer,
      normal: normalBuffer,
      textureCoord: textureCoordBuffer,
      indices: indexBuffer,
    };
  }
  
  function initPositionBuffer(gl,idx) {
    // Create a buffer for the square's positions.
    // let global_positionBuffer = [];
    // let idx=0;
    // for (idx = 0; idx < numMeshIndexs; idx++){

    // }

      const positionBuffer = gl.createBuffer();
      
      // Select the positionBuffer as the one to apply buffer
      // operations to from here out.
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    
      const positions = ModelAttributeArray[idx].vertices;
    
      // Now pass the list of positions into WebGL to build the
      // shape. We do this by creating a Float32Array from the
      // JavaScript array, then use it to fill the current buffer.
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    
    return positionBuffer;
  }
  

  
  function initIndexBuffer(gl,idx) {
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  
    // This array defines each face as two triangles, using the
    // indices into the vertex array to specify each triangle's
    // position.
  
    const indices = ModelAttributeArray[idx].indices;
  
    // Now send the element array to GL
  
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      gl.STATIC_DRAW
    );
  
    return indexBuffer;
  }
  
  function initTextureBuffer(gl,idx) {
    const textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
  
    const textureCoordinates = ModelAttributeArray[idx].textCoord;
  
  
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(textureCoordinates),
      gl.STATIC_DRAW
    );
  
    return textureCoordBuffer;
  }
  
  function initNormalBuffer(gl,idx) {
    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  
    const vertexNormals = ModelAttributeArray[idx].normals;
  
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(vertexNormals),
      gl.STATIC_DRAW
    );
  
    return normalBuffer;
  }
  function drawScene(gl, programInfo, buffers, texture, camera_view_matrix,now) {
    now *= 0.001;
    
    gl.clearColor(0.0, 0.0, 0.0, 1.0); 
    gl.clearDepth(1.0); 
    gl.enable(gl.DEPTH_TEST); 
    gl.depthFunc(gl.LEQUAL); 
  
  
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  
    let idx = 0;
    let total = model_load_list.length;

    for (idx=0;idx<total;idx++){
      // console.log(idx);
      let model_idx = model_load_list[idx][0];
      let mesh_idx = model_load_list[idx][1];
      const texture_apply_list = [];
      if (model_idx < 6){
        if (mesh_idx != 0){
          continue;
        }else{
          for (let idx_t=0;idx_t<total;idx_t++){
            if (model_load_list[idx_t][0] == model_idx){
              if (applyTexture[model_idx].includes(model_load_list[idx_t][1])){
                texture_apply_list.push(texture[idx_t]);
              }
            }
          }
        }
      }
        
      const fieldOfView = (45 * Math.PI) / 180; 
      const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
      const zNear = 0.1;
      const zFar = 100.0;
      const projectionMatrix = mat4.create();
    
    
      mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
    
    
      let modelViewMatrix = mat4.create();
      
      let modelMatrix_s = mat4.create();
      mat4.translate(
        modelMatrix_s, 
        modelMatrix_s, 
        revolution_center[model_idx]
      ); 

      mat4.rotate(modelMatrix_s,modelMatrix_s,now*10*revolution_speed[model_idx],[0.0,1.0,0.0]);
      // console.log(revolution_center[model_idx],model_idx);
        
      if (model_idx == 6){
        
        mat4.translate(
          modelViewMatrix, 
          modelViewMatrix, 
          translate_list[model_idx]
          
        ); 
        mat4.multiply(modelViewMatrix,modelMatrix_s,modelViewMatrix);
        if (model_idx == 6 && mesh_idx == 1){
          mat4.translate(
            modelViewMatrix, 
            modelViewMatrix, 
            [0,0.20/2,3.78/2]
            
          ); 
          mat4.rotate(modelViewMatrix, modelViewMatrix, now*rotation_speed[model_idx]*5, [1.0, 0.0, 0.0]);
          mat4.translate(
            modelViewMatrix, 
            modelViewMatrix, 
            [0,-0.20/2,-3.78/2]
            
          );
          
        }
        if (model_idx == 6 && mesh_idx == 2){
          mat4.translate(
            modelViewMatrix, 
            modelViewMatrix, 
            [0,0.20/2,-3.78/2]
            
          ); 
          mat4.rotate(modelViewMatrix, modelViewMatrix, now*rotation_speed[model_idx]*5, [1.0, 0.0, 0.0]);
          mat4.translate(
            modelViewMatrix, 
            modelViewMatrix, 
            
            [0,-0.20/2,3.78/2]
          );
          
        }
        
        


      }else{
        
        mat4.translate(
          modelViewMatrix, 
          modelViewMatrix, 
          translate_list[model_idx]
          
        ); 
        if (model_idx != 5){
          mat4.multiply(modelViewMatrix,modelMatrix_s,modelViewMatrix);
          // mat4.translate(modelViewMatrix, 
          //   modelViewMatrix,-revolution_center[model_idx])
        }
  
        mat4.rotate(modelViewMatrix, modelViewMatrix, now*rotation_speed[model_idx], [0.0, 1.0, 0.0]);
        // if (idx==5){
        //   mat4.scale(modelViewMatrix, modelViewMatrix, [0.00001, 0.00001, 0.00001]);
  
        // }
      }
      
      
    
      mat4.scale(modelViewMatrix, modelViewMatrix, [scale_size[model_idx], scale_size[model_idx],scale_size[model_idx]]);
      setPositionAttribute(gl, buffers[idx], programInfo);
    
      setTextureAttribute(gl, buffers[idx], programInfo);
    
    
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers[idx].indices);
    
      setNormalAttribute(gl, buffers[idx], programInfo);
    
    
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
      
      gl.uniform3fv(programInfo.uniformLocations.diffuseLightColor, [0.8,0.8,0.8]);
      gl.uniform3fv(programInfo.uniformLocations.lightDirection, sun_pos);
      // gl.uniform3fv(programInfo.uniformLocations.ambientLightColor, ModelMaterialsArray[ModelAttributeArray[0].materialIndex].ambient);
      if (model_idx == 5){
        gl.uniform3fv(programInfo.uniformLocations.ambientLightColor, [1.0,1.0,1.0]);
      }else{
        gl.uniform3fv(programInfo.uniformLocations.ambientLightColor, [0.4,0.4,0.4]);
      }
      
      
      gl.uniform3fv(programInfo.uniformLocations.specularLightColor, ModelMaterialsArray[ModelAttributeArray[0].materialIndex].specular);
      gl.uniform1f(programInfo.uniformLocations.shininess, ModelMaterialsArray[ModelAttributeArray[0].materialIndex].shininess);

      if (model_idx>5){
        gl.uniform1i(programInfo.uniformLocations.texture_num,1.0);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture[idx]);
        gl.uniform1i(programInfo.uniformLocations.uSampler0, 0);
      } else{
        gl.uniform1i(programInfo.uniformLocations.texture_num,texture_apply_list.length);
      // console.log(texture_apply_list.length+"length");
      if (texture_apply_list.length == 1){
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture_apply_list[0]);
        gl.uniform1i(programInfo.uniformLocations.uSampler0, 0);
      }else{
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture_apply_list[0]);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, texture_apply_list[1]);
        gl.uniform1i(programInfo.uniformLocations.uSampler0, 0);
        gl.uniform1i(programInfo.uniformLocations.uSampler1, 1);
      }
      }
      
      
    
    
      
      
      
    
    
      

    
      const vertexCount = ModelAttributeArray[idx].indices.length;
      // console.log(buffers.indices.length)
      const type = gl.UNSIGNED_SHORT;
      const offset = 0;
      gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
      
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