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

  _renderer !: THREE.WebGLRenderer;
  _scene !: THREE.Scene;
  _camera !: THREE.Camera;

  constructor(private noiseSvc: NoiseService) 
  {
  }
  
  ngOnInit(): void
  {
    this._renderer = new THREE.WebGLRenderer();
    document.body.appendChild(this._renderer.domElement);
    this.onResize(null);

    this._scene =   new THREE.Scene();
    this._scene.fog = new THREE.FogExp2( 0x000000, 0.007);
    this._camera = this.setupCamera();


    this.renderAxis(this._scene);
    this.addLights(this._scene);
    

  this.noiseSvc.getSimplex2d() 
    .subscribe(data => this.renderTerrain(data));
      
    this.animate();
    this._renderer.render( this._scene, this._camera );
  }

  onResize(event:any) {
    this._renderer.setSize( window.innerWidth, window.innerHeight);
  }

  animate() {
    //var ref = this;
    //requestAnimationFrame(ref.animate);

    //pointLight1.position.x += -0.2;
    //pointLight1.position.y += -0.2;
    this._renderer.render(  this._scene,  this._camera );
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

  private renderTerrain(data : number[][]) {
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
    
    this._scene.add(mesh);
    this._renderer.render(  this._scene,  this._camera );
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
