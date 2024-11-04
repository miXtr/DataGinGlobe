//import * as THREE from '//unpkg.com/three/build/three.module.js';
import {THREE} from './three-defs.js';


//fetch('../ne_110m_admin_0_countries.geojson').then(res => res.json()).then(countries =>
//fetch('../ne_10m_time_zones_1.geojson').then(res => res.json()).then(timezones =>    
fetch('../timezone_0.geojson').then(res => res.json()).then(timezones =>    
{
    let position = 0;
    let x = -30;
    let y = 3;
    let z = 3;
    let round = 0;

    let dt = +new Date();
    const VELOCITY = 9; // minutes per frame
    const timeEl = document.getElementById('time');
    const world = Globe({ animateIn: false })
    (document.getElementById('globeViz'))
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
    .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
    //.backgroundColor('#FF000000')
    .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
    //.showGraticules(true)
    //.showAtmosphere(true)
    .atmosphereAltitude(0.3)
    .lineHoverPrecision(0)
    //.polygonsData(countries.features.filter(d => d.properties.ISO_A2 !== 'AQ'))
    //.polygonsData(timezones.features)
    .polygonAltitude(0.006)
    .polygonsTransitionDuration(200)
    .polygonCapColor(() => 'rgba(34,139,34, 0.25)')
    .polygonSideColor(() => 'rgba(34,139,34, 0.2)')
    .polygonStrokeColor(() => '#111')
    // .polygonLabel(({ properties: d }) => `
    //     <b>${d.ADMIN} (${d.ISO_A2}):</b> <br />
    //     GDP: <i>${d.GDP_MD_EST}</i> M$<br/>
    //     Population: <i>${d.POP_EST}</i>
    // `)
    .onPolygonClick(log)
    .onPolygonHover(hoverD => world
        .polygonAltitude(d => d === hoverD ? 0.03 : 0.006)
        //.polygonCapColor(d => d === hoverD ? 'steelblue' : 'rgba(200, 0, 0, 0.6)')
    )

    //fetch('../reduced_0.geojson').then(res => res.json()).then(countries => {
        // countries.features.forEach(f => {
        //     timezones.features.push(f);
        // });
        //world.polygonsData(countries.features);
    //})
    //world.polygonsData(timezones.features);

    //world.camera().rotation.x = 20;

    // Auto-rotate
    world.controls().autoRotate = false;
    world.controls().autoRotateSpeed = 0.05;

    // world.camera().rotation.y = 90*Math.PI/180;
    // world.controls().update();

    // let coords = new Object({lat : 50, lng : 50, altitude : 1});
    // world.pointOfView(coords, 5000);

    //world.camera().position.set(100,100,100);

    const geometry = new THREE.BoxGeometry( 10, 10, 10 );
    const material = new THREE.MeshBasicMaterial( {color: 'blue'} );

    var cubeA = new THREE.Mesh( geometry, material );
    cubeA.position.set( 100, 100, 0 );
    cubeA.rotateion= new THREE.Euler( 0, 1, 1.57, 'XYZ' );

    // const cubeB = new THREE.Mesh( geometry, material );
    // cubeB.position.set( -100, -100, 0 );

    // //create a group and add the two cubes
    // //These cubes can now be rotated / scaled etc as a group
    const group = new THREE.Group();
    group.add( cubeA );
    //group.add( cubeB );
    world.scene().add(group);
    
    
    var xSpeed = 1;
    var ySpeed = 1;

    document.addEventListener("keydown", onDocumentKeyDown, false);
    function onDocumentKeyDown(event) {
        var keyCode = event.which;
        if (keyCode == 87) {
            cubeA.position.y += ySpeed;
        } else if (keyCode == 83) {
            cubeA.position.y -= ySpeed;
        } else if (keyCode == 65) {
            cubeA.position.x -= xSpeed;
        } else if (keyCode == 68) {
            cubeA.position.x += xSpeed;
        } else if (keyCode == 32) {
            cubeA.position.set(100, 100, 0 );
        }
    };

    let earthWater = new THREE.TextureLoader().load('//unpkg.com/three-globe/example/img/earth-water.png');//, texture => {
    world.globeMaterial().specularMap = earthWater;
    world.globeMaterial().specular = new THREE.Color('grey');
    world.globeMaterial().shininess = 15;
    
    world.globeMaterial().bumpScale = 10;

    let citylightsT = new THREE.TextureLoader().load('./night_lights_modified.png');
    world.globeMaterial().emissiveMap = citylightsT;
    world.globeMaterial().emissiveIntensity = 0.2;
    world.globeMaterial().emissive = new THREE.Color(0xffff88);

    const colorX = new THREE.Color( 'blue' );
    const colorY = new THREE.Color( 'green' );
    const colorZ = new THREE.Color( 'pink' );
    const axesHelper = new THREE.AxesHelper( 500 );
    axesHelper.setColors(colorX, colorY, colorZ);
    world.scene().add( axesHelper );

    world.lights([]);

    createLight();
    function createLight() 
    {     
        const dirLight1 = new THREE.DirectionalLight( 0xffffff, 0.1 );
        dirLight1.name= "MOONLIGHT";
        dirLight1.color.setHSL( -2, 1, 0.95 );
        dirLight1.position.set( -x, -y, -z );

        const dirLight = new THREE.DirectionalLight( 0xffffff, 5 );
        dirLight.name = "SUNLIGHT";
        dirLight.color.setHSL( -2, 1, 0.95 );
        dirLight.position.set( x, y, z );
        //dirLight.position.multiplyScalar( 30 );

        world.lights([dirLight, dirLight1]);
    }
    
    // Add clouds sphere
    const CLOUDS_IMG_URL = './clouds.png';
    const CLOUDS_ALT = 0.002;
    const CLOUDS_ROTATION_SPEED = 0.003;

    new THREE.TextureLoader().load(CLOUDS_IMG_URL, cloudsTexture => {
    const clouds = new THREE.Mesh(
        new THREE.SphereGeometry(world.getGlobeRadius() * (1 + CLOUDS_ALT), 75, 75),
        new THREE.MeshPhongMaterial({ map: cloudsTexture, transparent: true })
    );
    world.scene().add(clouds);

        (function rotateClouds() {
            clouds.rotation.y += CLOUDS_ROTATION_SPEED * Math.PI / 180;
            requestAnimationFrame(rotateClouds);
        })();
    });

    function log(polygon, event, { lat, lng, altitude }){
        console.log(lat, lng, altitude);
        var rotate = world.controls().autoRotate;
        world.controls().autoRotate = !rotate;

        //world.polygonsData([]);
    };

    requestAnimationFrame(() =>
        (function animate() {
            //let pov = world.pointOfView();
            //pov['lng'] -= 0.05
            //world.pointOfView(pov)

            //world.camera().position.copy(cubeA.position);
            
            requestAnimationFrame(animate);
        })())
    

    // animate time of day
    // requestAnimationFrame(() =>
    //     (function animate() {
    //       dt += VELOCITY * 60 * 1000;
    //       //solarTile.pos = sunPosAt(dt);
    //       //world.tilesData([solarTile]);
    //       timeEl.textContent = new Date(dt).toLocaleString();
    //         round++;
    //         if (round == 100) round = 0;
    //       if ((round % 10) == 0) {
    //       //if (xx < 0.1){

    //           switch(position)
    //           {
    //               case 0:
    //             x = -2;
    //             z = 1.5;      
    //             position = 1;
    //             break;
    //             case 1:
    //                 x = -2;
    //                 z = 0;      
    //                 position = 2;
    //                 break;
    //                 case 2:
    //                     x = -2;
    //                     z = -1.5;      
    //                     position = 3;
    //                     break;
    //                     case 3:
    //                         x = 0;
    //                         z = -1.5;      
    //                         position = 4;
    //                         break;
    //                         case 4:
    //                             x = 2;
    //                             z = -1.5;      
    //                             position = 5;
    //                             break;
    //                             case 5:
    //                                 x = 2;
    //                                 z = 0;      
    //                                 position = 6;
    //                                 break;
    //                                 case 6:
    //                                     x = 2;
    //                                     z = 1.5;      
    //                                     position = 7;
    //                                     break;
    //                                     case 7:
    //             x = 0;
    //             z = 1.5;      
    //             position = 0;
    //             break;
    //         }
            
    //     }
    //     //   //console.log(x, y);

          
    //     const sunLight = world.lights().find(light => light.name === 'SUNLIGHT');
    //     sunLight && sunLight.position.set(x, y , z);
        
    //     // const moonLight = world.lights().find(light => light.name === 'MOONLIGHT');
    //     // moonLight && moonLight.position.set(-x, -y , -z);
        
    //       requestAnimationFrame(animate);
    //     })()
    // );

});