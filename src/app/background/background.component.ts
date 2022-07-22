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
  //scene.fog = new THREE.FogExp2( 0xcccccc, 0.07 );

  var renderer = this.setupRenderer();
  var camera = this.setupCamera();
    
  this.renderAxis(scene);
  //this.addLights(scene);


  this.addLights(scene);
    

  this.noiseSvc.getSimplex2d()
    .subscribe(data => {
      this.renderTerrain(data, scene);
      //const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 2);
      //scene.add( light );
      //renderer.render( scene, camera );
    });
      




  renderer.render( scene, camera );

 // this.renderTerrain();

  var animate = function () {
      requestAnimationFrame( animate );

      //pointLight1.position.x += -0.2;
      //pointLight1.position.y += -0.2;

      renderer.render( scene, camera );
    };

    animate();

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
      const material = new MeshLambertMaterial( { color: 0x05aaaaff, wireframe:  false } );
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
    const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 200 );
    camera.position.set( 100, -10, 40 );
    camera.lookAt( 100, 100, 0 );
    return camera;
  }

  private addLights(scene: Scene) {
    console.log("Adding Lights");
    const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, .5);
    scene.add( light );

    /*
    const pointLight1 = new THREE.PointLight(0xaaffff);
    pointLight1.position.set(100,25,300);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffbbff);
    pointLight2.position.set(100, 100, 300);
    scene.add(pointLight2);
    */
  }

  private renderTerrain(data : number[][], scene: Scene) {
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.MeshLambertMaterial({color: 0xcccccc, wireframe: true});

    // create a simple square shape. We duplicate the top left and bottom right
    // vertices because each vertex needs to appear once per triangle.
    let div = 100;
    const points: number[] = [];

    function push(vector: THREE.Vector3) {
      points.push(vector.x);
      points.push(vector.y);
      points.push(vector.z/div);
    }
   
    for (var y = 0; y < 200; y++) {
      for (var x = 0; x <200; x++) {
          var ul = new THREE.Vector3(x, y, data[y][x]);
          var ur = new THREE.Vector3(x+1, y, data[y][x+1]);
          var ll = new THREE.Vector3(x, y+1, data[y+1][x]);
          var lr = new THREE.Vector3(x+1, y+1, data[y+1][x+1]);
          var c = new THREE.Vector3(x+1, y+1, data[y+1][x+1]);
          
          push(ul);
          push(ur);
          push(ll);

          push(ur);
          push(lr);
          push(ll);

          /*
          push(ul);
          push(ll);
          push(c);
          
          push(ll);
          push(lr);
          push(c);

          push(lr);
          push(ur);
          push(c);
          */

      }
    }

    // itemSize = 3 because there are 3 values (components) per vertex
    geometry.setAttribute( 'position', new THREE.BufferAttribute(new Float32Array(points), 3 ));
    geometry.computeVertexNormals();

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
