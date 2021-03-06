import { Component, HostListener, OnInit } from '@angular/core';
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

  _widthX: number = 257;
  _widthY: number = 513;

  _renderer !: THREE.WebGLRenderer;
  _scene !: THREE.Scene;
  _camera !: THREE.Camera;
  _pointLight1 = new THREE.PointLight(0x42f5bc);
  _pointLight2 = new THREE.PointLight(0x42f5bc);
  _fog = new THREE.FogExp2( 0x000000, .04);


  constructor(private noiseSvc: NoiseService) 
  {
  }
  
  ngOnInit(): void
  {
    this._renderer = new THREE.WebGLRenderer();
    document.body.appendChild(this._renderer.domElement);
    this.onResize();
    window.onresize = () => this.onResize();

    this._scene =   new THREE.Scene();
    this._scene.fog = this._fog;
    this._camera = this.setupCamera();

    this._pointLight1.position.set(0, 0, 0);
    this._pointLight1.intensity=.01;
    this._scene.add(this._pointLight1);
    
    this._pointLight2.position.set(-100,100,150);
    this._pointLight2.intensity=.3;
    this._scene.add(this._pointLight2);


    //this.renderAxis(this._scene);
    this.addLights(this._scene);
    

  this.noiseSvc.getSimplex2dRepeating(this._widthX, this._widthY) 
    .subscribe(data => this.renderTerrain(data));
      
    this._renderer.render( this._scene, this._camera );
    
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?:any) {
    console.log("resizing...");
    console.log(this._renderer.domElement);
    this._renderer.setSize( window.innerWidth, window.innerHeight);
  }

  animate() {
    //var ref = this;
    requestAnimationFrame(() => this.animate());

    this._pointLight1.position.x += -1;
    this._pointLight2.position.x += 1;

    if(this._fog.density > .007) this._fog.density -= .0001;

    this._renderer.render(  this._scene,  this._camera );
  }

  private setupCamera() : THREE.Camera{
    const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, this._widthY );
    camera.position.set(this._widthX/2, -10, 20 );
    camera.lookAt(this._widthX/2,this._widthY/2, 0 );
    return camera;
  }

  private addLights(scene: Scene) {
    console.log("Adding Lights");
    const light = new THREE.HemisphereLight( 0xffaaaa,  0xffaaaa, .5);
    scene.add( light );
  }

  private renderTerrain(data : number[][]) {
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.MeshPhongMaterial({color: 0x000005, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1});

    // create a simple square shape. We duplicate the top left and bottom right
    // vertices because each vertex needs to appear once per triangle.
    let div = 75;
    const points: number[] = [];

    function push(vector: THREE.Vector3) {
      points.push(vector.x);
      points.push(vector.y);
      points.push(vector.z/div);
    }
   
    for (var y = 0; y < this._widthY -1; y++) {
      for (var x = 0; x <this._widthX -1; x++) {
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
      }
    }

    geometry.setAttribute( 'position', new THREE.BufferAttribute(new Float32Array(points), 3 ));
    geometry.computeVertexNormals();
    const mesh = new THREE.Mesh( geometry, material )

    var edges = new THREE.WireframeGeometry( mesh.geometry ); // or WireframeGeometry
    var lineMat = new THREE.LineBasicMaterial( { color: 0x706f65} );
    var wireframe = new THREE.LineSegments(edges, lineMat);
  
    this._scene.add(mesh);
    this._scene.add(wireframe);
    

    this.animate();
  }

    private renderSceneBase() {

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
