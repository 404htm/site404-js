import { Component, OnInit } from '@angular/core';
import { Data } from '@angular/router';
import * as THREE from 'three';
import { Color, MeshBasicMaterial, MeshLambertMaterial, MeshNormalMaterial, MeshPhongMaterial, MeshPhysicalMaterial, MeshStandardMaterial, PlaneGeometry, Scene } from 'three';
import { randFloat } from 'three/src/math/MathUtils';
import { NoiseService } from '../service/noise.service';

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.scss']
})

export class BackgroundComponent implements OnInit {

  constructor(private noiseSvc: NoiseService) {
  }
  


  ngOnInit(): void {

  var scene = new THREE.Scene();
  //scene.fog = new THREE.FogExp2( 0xefd1b5, 0.001 );

  var renderer = this.setupRenderer();
  var camera = this.setupCamera();
    
  this.addLights(scene);

    

  this.noiseSvc.getSimplex2d()
    .subscribe(data => this.renderTerrain(data, scene));


  this.renderAxis(scene);
 // this.renderTerrain();

  var animate = function () {
      requestAnimationFrame( animate );

      //pointLight1.position.x += -0.2;
      //pointLight1.position.y += -0.2;

      renderer.render( scene, camera );
    };

    function buildTerrain(data : number[][]) {
        console.log(data);
        //const geometry = new THREE.PlaneBufferGeometry(200, 200, 200, 200);
       

        //const plane = new THREE.Mesh(geometry, material);

        //plane.rotation.x = -80 * Math.PI/180;
        //plane.position.z = -50;

       // var vertices =  plane.geometry.attributes["position"];
       const material = new MeshBasicMaterial( { color: 0xffffff, wireframe:  false } );
        
        for (var y = 0; y < 200; y++) {
          var row = data[y];
          for (var x = 0; x <200; x++) {
            try {
              //console.log("x: "+x+",y: "+y+"z: "+ row[x]/50)
              const geometry = new THREE.BoxGeometry(1, 1, row[x]/50);
              const cube = new THREE.Mesh( geometry, material );
              cube.position.set(x, y, 0);
              scene.add(cube);
            }
            catch (Exception) {
              console.log("x: "+x+",y: "+y+"z: "+ row[x]/50)
            }

          }
        }
    }

    function addPlane(data : number[][]){
      
      const geometry = new THREE.PlaneBufferGeometry(200, 200, 50, 50);
      const material = new MeshStandardMaterial( { color: 0x05aaaaff, wireframe:  false } );
      const plane = new THREE.Mesh(geometry, material);

      plane.rotation.x = -87 * Math.PI/180;
     // plane.position.z = -80;

      var vertices =  plane.geometry.attributes["position"];

      for (var i = 0; i<= 10000; i+= 1)
      {
        vertices.setZ(i,200);
      };
      //console.log(vertices);

      vertices.needsUpdate = true;
      geometry.computeVertexNormals();
      scene.add(plane);
    }


    function addPoints(){
      const geometry = new THREE.SphereGeometry(.01, 1, 1);
      const material = new THREE.MeshBasicMaterial();
      const point = new THREE.Mesh(geometry, material);
      const [x, y, z] = Array(3).fill(0).map(() => THREE.MathUtils.randFloatSpread(100));

      point.position.set(x, y, z);
      scene.add(point);
    }

    Array(100).fill(0).forEach(addPoints);
    animate();
  }

  private setupRenderer(){
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    return renderer;
  }

  private setupCamera() : THREE.Camera{
    const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
    camera.position.set( 100, -80, 150 );
    camera.lookAt( 100, 100, 0 );
    return camera;
  }

  private addLights(scene: Scene) {
    const light = new THREE.HemisphereLight();
		scene.add( light );

    const pointLight1 = new THREE.PointLight(0xaaffff);
    pointLight1.intensity = 2;
    pointLight1.position.set(200,25,25);
    //scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffbbff);
    pointLight2.position.set(-30 ,-80,-30);
    //scene.add(pointLight2);
  }

  private renderTerrain(data : number[][], scene: Scene) {
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.MeshStandardMaterial( { color: 0xff0000 } );

    // create a simple square shape. We duplicate the top left and bottom right
    // vertices because each vertex needs to appear once per triangle.

    const points = [];
   
    for (var y = 0; y < 200; y++) {
      var row = data[y];
      var rowNext = data[y+1];

      for (var x = 0; x <200; x++) {
        var div = 50;

        var z = row[x]/div;

        try {
          points.push(x),
          points.push(y),
          points.push(z),

          points.push(x+1),
          points.push(y),
          points.push(row[x+1]/div),

          points.push(x + .5),
          points.push(y + .5),
          points.push(row[x+1]/div)

        }
        catch (Exception) {
          console.log("x: "+x+",y: "+y+"z: "+ row[x]/50)
        }
      }
    }

    // itemSize = 3 because there are 3 values (components) per vertex
    geometry.setAttribute( 'position', new THREE.BufferAttribute(new Float32Array(points), 3 ));

    const mesh = new THREE.Mesh( geometry, material )
    
    scene.add(mesh);
  }

  private renderAxis(scene: Scene) {
    RenderLine(0xff0000, [new THREE.Vector3( -1000, 0, 0 ) ,new THREE.Vector3( 1000, 0, 0 )]); //X - Red
    RenderLine(0x00ff00, [new THREE.Vector3( 0, -1000, 0 ) ,new THREE.Vector3( 0, 1000, 0 )]); //Y - Green
    RenderLine(0x0000ff, [new THREE.Vector3( 0, 0, -1000 ) ,new THREE.Vector3( 0, 0, 1000 )]); //Z - Blue
   
    function RenderLine(color : THREE.ColorRepresentation, points: THREE.Vector3[]) {
      const material = new THREE.LineBasicMaterial( { color: color } );
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line( geometry, material )
      scene.add( line );
    }
  }


}
