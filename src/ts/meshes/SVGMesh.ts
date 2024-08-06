import {SVGLoader} from "three/examples/jsm/loaders/SVGLoader.js";
import {BufferGeometry, Color, DoubleSide, Matrix4, Mesh, MeshBasicMaterial, Object3D, ShapeGeometry} from "three";

const loader = new SVGLoader();

export class SVGMesh extends Object3D {
    constructor(url: string) {
        super();
        loader.load(
            url,
            texture => {
                let renderOrder = 0;
                for ( const path of texture.paths ) {
                    const fillColor = path.userData?.style.fill;
                    if ( fillColor !== undefined && fillColor !== 'none' ) {
                        const material = new MeshBasicMaterial( {
                            color: new Color().setStyle( fillColor ),
                            opacity: path.userData?.style.fillOpacity,
                            transparent: true,
                            side: DoubleSide,
                            depthWrite: false,
                        } );
                        const shapes = SVGLoader.createShapes( path );
                        for ( const shape of shapes ) {
                            const geometry = new ShapeGeometry( shape );
                            geometry.applyMatrix4(new Matrix4().makeScale ( 1, -1, 1 ))
                            const mesh: Mesh = new Mesh( geometry, material );
                            mesh.renderOrder = renderOrder ++;
                            this.add(mesh);
                        }
                    }
                    const strokeColor = path.userData?.style.stroke;
                    if ( strokeColor !== undefined && strokeColor !== 'none' ) {
                        const material = new MeshBasicMaterial( {
                            color: new Color().setStyle( strokeColor ),
                            opacity: path.userData?.style.strokeOpacity,
                            transparent: true,
                            side: DoubleSide,
                            depthWrite: false,
                        } );
                        for ( const subPath of path.subPaths ) {
                            const geometry: BufferGeometry =
                                SVGLoader.pointsToStroke( subPath.getPoints(), path.userData?.style );
                            geometry.applyMatrix4(new Matrix4().makeScale ( 1, -1, 1 ))
                            if ( geometry ) {
                                const mesh: Mesh = new Mesh( geometry, material );
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