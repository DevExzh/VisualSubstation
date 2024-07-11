import * as THREE from 'three';

/**
 * @since 1 July 2024
 * @experimental
 */
export class RasterizedSVGMesh extends THREE.Mesh {
    constructor(url: string) {
        super();
        RasterizedSVGMesh.rasterizeSvg(url)
            .then(img => new THREE.Texture(img))
            .then(texture => {
                this.geometry = new THREE.PlaneGeometry(10, 10);
                this.material = new THREE.MeshBasicMaterial({
                    map: texture,
                });
            });
    }

    public static async rasterizeSvg(url: string): Promise<ImageBitmap> {
        // Fetch the SVG content from the URL
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch SVG: ${response.statusText}`);
        }
        // Get the SVG content as text
        const svgText = await response.text();
        // Create an OffscreenCanvas
        const canvas = new OffscreenCanvas(1, 1);
        const context = canvas.getContext('2d')!;
        if (!context) {
            throw new Error('2D context not supported');
        }
        // Function to parse SVG attributes
        function parseAttributes(attributes: string): Record<string, string> {
            const attrs: Record<string, string> = {};
            const regex = /(\w+)="([^"]*)"/g;
            let match;
            while ((match = regex.exec(attributes)) !== null) {
                attrs[match[1]] = match[2];
            }
            return attrs;
        }
        // Function to draw SVG elements
        function drawElement(element: string) {
            const [tag, ...attrParts] = element.trim().split(/\s+/);
            const attributes = parseAttributes(attrParts.join(' '));
            context.save();
            // Set common styles
            if (attributes.fill) {
                context.fillStyle = attributes.fill;
            }
            if (attributes.stroke) {
                context.strokeStyle = attributes.stroke;
            }
            if (attributes['stroke-width']) {
                context.lineWidth = parseFloat(attributes['stroke-width']);
            }
            switch (tag) {
                case '<rect': {
                    const x = parseFloat(attributes.x || '0');
                    const y = parseFloat(attributes.y || '0');
                    const width = parseFloat(attributes.width || '0');
                    const height = parseFloat(attributes.height || '0');
                    context.fillRect(x, y, width, height);
                    if (attributes.stroke) {
                        context.strokeRect(x, y, width, height);
                    }
                    break;
                }
                case '<circle': {
                    const cx = parseFloat(attributes.cx || '0');
                    const cy = parseFloat(attributes.cy || '0');
                    const r = parseFloat(attributes.r || '0');
                    context.beginPath();
                    context.arc(cx, cy, r, 0, 2 * Math.PI);
                    context.fill();
                    if (attributes.stroke) {
                        context.stroke();
                    }
                    break;
                }
                case '<line': {
                    const x1 = parseFloat(attributes.x1 || '0');
                    const y1 = parseFloat(attributes.y1 || '0');
                    const x2 = parseFloat(attributes.x2 || '0');
                    const y2 = parseFloat(attributes.y2 || '0');
                    context.beginPath();
                    context.moveTo(x1, y1);
                    context.lineTo(x2, y2);
                    if (attributes.stroke) {
                        context.stroke();
                    }
                    break;
                }
                case '<polyline': {
                    const points = attributes.points.split(/\s+/).map(parseFloat);
                    context.beginPath();
                    for (let i = 0; i < points.length; i += 2) {
                        const x = points[i];
                        const y = points[i + 1];
                        if (i === 0) {
                            context.moveTo(x, y);
                        } else {
                            context.lineTo(x, y);
                        }
                    }
                    context.stroke();
                    break;
                }
                case '<polygon': {
                    const points = attributes.points.split(/\s+/).map(parseFloat);
                    context.beginPath();
                    for (let i = 0; i < points.length; i += 2) {
                        const x = points[i];
                        const y = points[i + 1];
                        if (i === 0) {
                            context.moveTo(x, y);
                        } else {
                            context.lineTo(x, y);
                        }
                    }
                    context.closePath();
                    context.fill();
                    if (attributes.stroke) {
                        context.stroke();
                    }
                    break;
                }
                case '<path': {
                    const d = attributes.d;
                    const path = new Path2D(d);
                    context.fill(path);
                    if (attributes.stroke) {
                        context.stroke(path);
                    }
                    break;
                }
                default: break;
            }
            context.restore();
        }

        // Function to extract and draw SVG elements
        function extractAndDrawElements(svgText: string) {
            const svgHeaderRegex = /<svg[^>]*>/;
            const svgHeaderMatch = svgText.match(svgHeaderRegex);
            if (!svgHeaderMatch) {
                throw new Error('Invalid SVG format');
            }

            const svgHeader = svgHeaderMatch[0];
            const svgAttributes = parseAttributes(svgHeader);
            canvas.width = parseInt(svgAttributes.width || '100');
            canvas.height = parseInt(svgAttributes.height || '100');

            const elementRegex = /<(\w+)[^>]*>/g;
            let match;
            while ((match = elementRegex.exec(svgText)) !== null) {
                drawElement(match[0]);
            }
        }

        // Extract and draw SVG elements
        extractAndDrawElements(svgText);

        // Convert the OffscreenCanvas to an ImageBitmap
        const imageBitmap = canvas.transferToImageBitmap();

        return imageBitmap;
    }
}