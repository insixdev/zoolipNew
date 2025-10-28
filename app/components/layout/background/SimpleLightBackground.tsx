'use client';

import { useEffect, useRef } from 'react';

export default function SimpleLightBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl');
    
    if (!gl) {
      console.error('WebGL not supported in your browser');
      return;
    }

    // Set canvas size
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    }
    
    window.addEventListener('resize', resize);
    resize();

    // Create shaders
    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0, 1);
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;
      uniform vec2 u_resolution;
      uniform float u_time;
      
      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        float gradient = uv.y;
        vec3 color = mix(
          vec3(1.0, 0.8, 0.6),  // Light orange
          vec3(1.0, 0.9, 0.8),  // Light yellow
          gradient
        );
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    // Compile shader
    function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
      const shader = gl.createShader(type);
      if (!shader) return null;
      
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      
      return shader;
    }

    // Create program
    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    if (!vertexShader || !fragmentShader) return;
    
    const program = gl.createProgram();
    if (!program) return;
    
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      return;
    }
    
    // Look up attributes and uniforms
    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
    const timeUniformLocation = gl.getUniformLocation(program, 'u_time');
    
    // Create a buffer and put a rectangle in it (2 triangles)
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    
    // Two triangles to make a rectangle that covers the screen
    const positions = [
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ];
    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    
    // Draw the scene
    function render(time: number) {
      // Resize canvas if needed
      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        resize();
      }
      
      // Clear the canvas
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      
      // Tell it to use our program
      gl.useProgram(program);
      
      // Turn on the attribute
      gl.enableVertexAttribArray(positionAttributeLocation);
      
      // Bind the position buffer
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      
      // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
      gl.vertexAttribPointer(
        positionAttributeLocation,
        2,          // 2 components per iteration
        gl.FLOAT,   // the data is 32bit floats
        false,      // don't normalize the data
        0,          // 0 = move forward size * sizeof(type) each iteration to get the next position
        0           // start at the beginning of the buffer
      );
      
      // Set the resolution
      gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
      
      // Set the time
      gl.uniform1f(timeUniformLocation, time * 0.001);
      
      // Draw the rectangle
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      
      // Request the next frame
      requestAnimationFrame(render);
    }
    
    // Start the animation loop
    requestAnimationFrame(render);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resize);
      if (gl.getExtension('WEBGL_lose_context')) {
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
    />
  );
}
