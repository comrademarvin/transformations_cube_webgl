"use strict";

var canvas;
var gl;

var numVertices  = 36;

var directionLoc;
var delta_t_Loc;
var delta_t = [0.0,0.0,0.0];
var delta_r_Loc;
var delta_r = [0.0,0.0,0.0];
var delta_s_Loc;
var delta_s = [1.0,1.0,1.0];

var delta = 1;


var vertices = [
    vec3( -0.3, -0.3,  0.3 ),
    vec3( -0.3,  0.3,  0.3 ),
    vec3(  0.3,  0.3,  0.3 ),
    vec3(  0.3, -0.3,  0.3 ),
    vec3( -0.3, -0.3, -0.3 ),
    vec3( -0.3,  0.3, -0.3 ),
    vec3(  0.3,  0.3, -0.3 ),
    vec3(  0.3, -0.3, -0.3 )
];

var vertexColors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 1.0, 1.0, 1.0, 1.0 ),  // white
    vec4( 0.0, 1.0, 1.0, 1.0 )   // cyan
];

// indices of the 12 triangles that compise the cube

var indices = [
    1, 0, 3,
    3, 2, 1,
    2, 3, 7,
    7, 6, 2,
    3, 0, 4,
    4, 7, 3,
    6, 5, 1,
    1, 2, 6,
    4, 5, 6,
    6, 7, 4,
    5, 4, 0,
    0, 1, 5
];

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);;

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // array element buffer

    var iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);

    // color array atrribute buffer

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertexColors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    // vertex array attribute buffer

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    delta_t_Loc = gl.getUniformLocation(program, "delta_t");
    delta_r_Loc = gl.getUniformLocation(program, "delta_r");
    delta_s_Loc = gl.getUniformLocation(program, "delta_s");

    //event listeners for buttons/keystrokes
    document.getElementById("inc_x").onclick = function () {
        if (document.getElementById("translation").checked) {
            delta_t[0] += 0.025*delta;
        }
        if (document.getElementById("rotation").checked) {
            delta_r[0] += 10*delta;
        }
        if (document.getElementById("scale").checked) {
            delta_s[0] += 0.05*delta;
        }
        
        render();
    };

    document.getElementById("dec_x").onclick = function () {
        if (document.getElementById("translation").checked) {
            delta_t[0] -= 0.025*delta;
        }
        if (document.getElementById("rotation").checked) {
            delta_r[0] -= 10*delta;
        }
        if (document.getElementById("scale").checked) {
            delta_s[0] -= 0.05*delta;
        }
        
        render();
    };

    document.getElementById("inc_y").onclick = function () {
        if (document.getElementById("translation").checked) {
            delta_t[1] += 0.025*delta;
        }
        if (document.getElementById("rotation").checked) {
            delta_r[1] += 10*delta;
        }
        if (document.getElementById("scale").checked) {
            delta_s[1] += 0.05*delta;
        }
        
        render();
    };

    document.getElementById("dec_y").onclick = function () {
        if (document.getElementById("translation").checked) {
            delta_t[1] -= 0.025*delta;
        }
        if (document.getElementById("rotation").checked) {
            delta_r[1] -= 10*delta;
        }
        if (document.getElementById("scale").checked) {
            delta_s[1] -= 0.05*delta;
        }
        
        render();
    };

    document.getElementById("inc_z").onclick = function () {
        if (document.getElementById("translation").checked) {
            delta_t[2] += 0.025*delta;
        }
        if (document.getElementById("rotation").checked) {
            delta_r[2] += 10*delta;
        }
        if (document.getElementById("scale").checked) {
            delta_s[2] += 0.05*delta;
        }
        
        render();
    };

    document.getElementById("dec_z").onclick = function () {
        if (document.getElementById("translation").checked) {
            delta_t[2] -= 0.025*delta;
        }
        if (document.getElementById("rotation").checked) {
            delta_r[2] -= 10*delta;
        }
        if (document.getElementById("scale").checked) {
            delta_s[2] -= 0.05*delta;
        }
        
        render();
    };

    document.getElementById("inc_delta").onclick = function () {
        delta += 1;
        var label = " x " + delta.toString();
        document.getElementById("delta_label").innerHTML = label;
    };

    document.getElementById("dec_delta").onclick = function () {
        if (delta > 1) {
            delta -= 1;
            var label = " x " + delta.toString();
            document.getElementById("delta_label").innerHTML = label;
        } else {
            alert("Cant be smaller than 1.");
        }
    };

    // keyboard keys input
    window.onkeydown = function(event) {
        var key = String.fromCharCode(event.keyCode);
        switch (key) {
            case 'O':
                document.getElementById("dec_x").onclick();
                break;
            case 'P':
                document.getElementById("inc_x").onclick();
                break;
            case 'K':
                document.getElementById("dec_y").onclick();
                break;
            case 'L':
                document.getElementById("inc_y").onclick();
                break;
            case 'N':
                document.getElementById("dec_z").onclick();
                break;
            case 'M':
                document.getElementById("inc_z").onclick();
                break;
            case 'Q':
                document.getElementById("inc_delta").onclick();
                break;
            case 'W':
                document.getElementById("dec_delta").onclick();
                break;
            case 'R':
                document.getElementById("reset").onclick();
                break;
        }
    };

    document.getElementById("reset").onclick = function () {
        delta_t = [0.0,0.0,0.0];
        delta_r = [0.0,0.0,0.0];
        delta_s = [1.0,1.0,1.0];
        delta = 1;
        var label = " x " + delta.toString();
        document.getElementById("delta_label").innerHTML = label;
        document.getElementById("translation").checked = false;
        document.getElementById("rotation").checked = false;
        document.getElementById("scale").checked = false;

        render();
    };

    render();
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniform3fv(delta_t_Loc, flatten(delta_t));
    gl.uniform3fv(delta_r_Loc, flatten(delta_r));
    gl.uniform3fv(delta_s_Loc, flatten(delta_s));

    gl.drawElements( gl.TRIANGLES, numVertices, gl.UNSIGNED_BYTE, 0 );
}
