import {
    Group,
    Color,
    Shape,
    Object3D,
    ExtrudeGeometry,
    Mesh,
    MeshStandardMaterial, LineLoop, LineBasicMaterial, BufferGeometry, Float32BufferAttribute,
} from 'three';
import {Feature, FeatureCollection} from "./GeoJson.ts";
import {geoMercator, GeoProjection} from 'd3-geo';
import {mergeOptions} from "../common/Types.ts";
import {MeshLine} from "../meshes/MeshLine.ts";

export enum LineType {
    NormalLine,
    MeshLine
}

const defaultOptions = {
    areaColor: new Color('#887908'), // 板块颜色
    areaOpacity: 0.975,
    borderColor: new Color('#FFF9C4'), // 板块边界的线条颜色
    borderWidth: 1, // 板块边界的线条粗细
    projection: geoMercator(), // 蒙卡托投影
    centroid: [103.38, 35.55], // 中国的地理中心
    areaHeight: 1, // 板块高度
    lineHeight: 0.5,
    lineType: LineType.MeshLine,
    nameOnly: true,
};
export type GeoJsonOptions = typeof defaultOptions;
export const chinaProjection = geoMercator().center([103.38, 35.55]).translate([0, 0]);

/**
 * 将 GeoJson 转换为 Three.js 中的 Object3D
 * @param url GeoJson 的地址
 * @param options 配置 3D 物体的样式
 * @author Ryker Zhu <ryker.zhu@nuist.edu.cn>
 * @since 25 June, 2024
 */
export async function object3DFromGeoJson(
    url: URL | Request | string,
    options?: Partial<GeoJsonOptions>
): Promise<Object3D[]> {
    const meshes: Object3D[] = [];
    const response: Response = await fetch(url);
    const json: FeatureCollection = await response.json() as FeatureCollection;
    const opts: GeoJsonOptions = mergeOptions(defaultOptions, options);
    const proj: GeoProjection = opts.projection
        .center(opts.centroid as [number, number])
        .translate([0, 0]);
    json.features.forEach((feature: Feature) => {
        if(feature.geometry.type !== 'MultiPolygon') return;
        if(opts.nameOnly && !feature.properties.name) return;
        const area: Group = new Group();
        const coords = feature.geometry.coordinates;
        coords.forEach(multiPoly => {
            multiPoly.forEach(poly => {
                const shape: Shape = new Shape();
                (() => {
                    const [x, y] = proj([poly[0][0], poly[0][1]])!;
                    shape.moveTo(x, -y);
                })();
                const vertices: Float32Array = new Float32Array(poly.length * 3);
                for(let i = 0; i < poly.length; i++) {
                    const point = poly[i];
                    const [x, y] = proj([point[0], point[1]])!;
                    shape.lineTo(x, -y);
                    vertices[3 * i] = x;
                    vertices[3 * i + 1] = -y;
                    vertices[3 * i + 2] = opts.lineHeight;
                }
                const region = new Mesh(
                    new ExtrudeGeometry(
                        shape,
                        {
                            depth: opts.areaHeight,
                            bevelEnabled: false
                        }
                    ),
                    new MeshStandardMaterial({
                        color: opts.areaColor,
                        transparent: true,
                        opacity: opts.areaOpacity,
                    }),
                );
                region.receiveShadow = region.castShadow = true;
                const group: Group = new Group().add(
                    region,
                    opts.lineType === LineType.MeshLine
                    ? new MeshLine(
                        vertices, {
                            color: opts.borderColor, lineWidth: opts.borderWidth
                        }
                    ) : new LineLoop(
                        new BufferGeometry()
                            .setAttribute('position', new Float32BufferAttribute(vertices, 3)),
                        new LineBasicMaterial({
                            color: opts.borderColor
                        })
                    )
                )
                group.rotateX(-Math.PI / 2);
                area.add(group);
            });
        });
        area.userData = feature.properties;
        if(!!feature.properties.name) {
            const center = feature.properties.center;
            area.userData.centerMap = proj(center)!;
        }
        meshes.push(area);
    });
    return meshes;
}