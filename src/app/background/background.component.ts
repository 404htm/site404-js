import { Component, OnInit } from '@angular/core';
import { Data } from '@angular/router';
import * as THREE from 'three';
import { MeshBasicMaterial, MeshLambertMaterial, MeshNormalMaterial, MeshPhongMaterial, MeshPhysicalMaterial, MeshStandardMaterial, PlaneGeometry } from 'three';
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
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 100 );

    camera.position.set(50, 0, 20);
    camera.rotateX(90* Math.PI/180);


    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    const pointLight1 = new THREE.PointLight(0xaaffff);
    pointLight1.intensity = 2;
    pointLight1.position.set(200,25,25);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffbbff);
    pointLight2.position.set(-30 ,-30,-30);
    scene.add(pointLight2);

    this.noiseSvc.getSimplex2d()
      .subscribe(data => buildTerrain(data));

    /*
    var geometry = new THREE.TorusGeometry(20, 5, 15, 15);
    var material = new THREE.MeshStandardMaterial( { color: 0x555555, wireframe: false } );
    var cube = new THREE.Mesh( geometry, material );
    scene.add( cube );
    */
    
    //addPlane();

    var animate = function () {
      requestAnimationFrame( animate );

      pointLight1.position.x += -0.2;
      //pointLight1.position.y += -0.2;

      renderer.render( scene, camera );
    };

    function buildTerrain(data : number[][]) {
        console.log(data);
        //const geometry = new THREE.PlaneBufferGeometry(200, 200, 200, 200);
        const material = new MeshStandardMaterial( { color: 0x05aaaaff, wireframe:  false } );

        //const plane = new THREE.Mesh(geometry, material);

        //plane.rotation.x = -80 * Math.PI/180;
        //plane.position.z = -50;

       // var vertices =  plane.geometry.attributes["position"];

        
      
        for (var y = 0; y < 100; y++) {
          var row = data[y];
          for (var x = 0; x <100; x++) {
            const geometry = new THREE.BoxGeometry(1, 1, row[x]/80);
            const cube = new THREE.Mesh( geometry, material );
            cube.position.set(x, y, 0);
            scene.add(cube);
          }
        }

        console.log("done");
      //  console.log(geometry.heigh)

    }

    function addPlane(){
      
      const geometry = new THREE.PlaneBufferGeometry(200, 200, 50, 50);
      const material = new MeshStandardMaterial( { color: 0x05aaaaff, wireframe:  false } );
      const plane = new THREE.Mesh(geometry, material);

      plane.rotation.x = -87 * Math.PI/180;
      plane.position.z = -80;

      var vertices =  plane.geometry.attributes["position"];

      for (var i = 0; i<= 100*100; i+= 1)
      {
        vertices.setZ(i, Math.random() * 4);
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

    Array(1000).fill(0).forEach(addPoints);
    animate();
  }


}
