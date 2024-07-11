import * as THREE from "three";
import {SVGLoader} from "three/examples/jsm/loaders/SVGLoader.js";

const loader = new SVGLoader();

export class SVGMesh extends THREE.Object3D {
    constructor(url: string) {
        super();
        loader.load(
            url,
            texture => {
                let renderOrder = 0;
                for ( const path of texture.paths ) {
                    const fillColor = path.userData?.style.fill;
                    if ( fillColor !== undefined && fillColor !== 'none' ) {
                        const material = new THREE.MeshBasicMaterial( {
                            color: new THREE.Color().setStyle( fillColor ),
                            opacity: path.userData?.style.fillOpacity,
                            transparent: true,
                            side: THREE.DoubleSide,
                            depthWrite: false,
                        } );
                        const shapes = SVGLoader.createShapes( path );
                        for ( const shape of shapes ) {
                            const geometry = new THREE.ShapeGeometry( shape );
                            geometry.applyMatrix4(new THREE.Matrix4().makeScale ( 1, -1, 1 ))
                            const mesh: THREE.Mesh = new THREE.Mesh( geometry, material );
                            mesh.renderOrder = renderOrder ++;
                            this.add(mesh);
                        }
                    }
                    const strokeColor = path.userData?.style.stroke;
                    if ( strokeColor !== undefined && strokeColor !== 'none' ) {
                        const material = new THREE.MeshBasicMaterial( {
                            color: new THREE.Color().setStyle( strokeColor ),
                            opacity: path.userData?.style.strokeOpacity,
                            transparent: true,
                            side: THREE.DoubleSide,
                            depthWrite: false,
                        } );
                        for ( const subPath of path.subPaths ) {
                            const geometry: THREE.BufferGeometry =
                                SVGLoader.pointsToStroke( subPath.getPoints(), path.userData?.style );
                            geometry.applyMatrix4(new THREE.Matrix4().makeScale ( 1, -1, 1 ))
                            if ( geometry ) {
                                const mesh: THREE.Mesh = new THREE.Mesh( geometry, material );
                                mesh.renderOrder = renderOrder ++;
                                this.add(mesh);
                            }
                        }
                    }
                }
            },
            req => console.log(req),
            error => console.error(error)
        );
    }
}