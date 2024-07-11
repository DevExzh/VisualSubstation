export enum GradientDirection {
    LeftToRight,
    RightToLeft,
    TopToBottom,
    BottomToTop
}

export async function createLinearGradientBitmap(
    width: number,
    height: number,
    direction: GradientDirection,
    colorStops: { offset: number, color: string }[]
): Promise<ImageBitmap> {
    // 创建一个 OffscreenCanvas
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('Failed to get 2D context');
    }
    let startX: number, startY: number, endX: number, endY: number;
    // 基于所给的方向设置起点和终点
    switch (direction) {
        case GradientDirection.LeftToRight:
            startX = 0;
            startY = 0;
            endX = width;
            endY = 0;
            break;
        case GradientDirection.RightToLeft:
            startX = width;
            startY = 0;
            endX = 0;
            endY = 0;
            break;
        case GradientDirection.TopToBottom:
            startX = 0;
            startY = 0;
            endX = 0;
            endY = height;
            break;
        case GradientDirection.BottomToTop:
            startX = 0;
            startY = height;
            endX = 0;
            endY = 0;
            break;
        default:
            throw new Error('Invalid gradient direction');
    }
    // 创建线性渐变
    const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
    colorStops.forEach(stop => {
        gradient.addColorStop(stop.offset, stop.color);
    });
    // 将该渐变填充满 canvas
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    // 把 canvas 转换成 ImageBitmap
    return canvas.transferToImageBitmap();
}

export async function createTextImageBitmap(
    text: string,
    width: number,
    height: number,
    direction: 'horizontal' | 'vertical',
    font: string = 'Arial',
    color: string = 'black'
): Promise<ImageBitmap> {
    // Get the device pixel ratio
    const dpr = window.devicePixelRatio || 1;

    // Create an OffscreenCanvas element
    const canvas = new OffscreenCanvas(width * dpr, height * dpr);
    const context = canvas.getContext('2d');
    if (!context) {
        throw new Error('Could not get canvas context');
    }

    // Scale the canvas context to account for the device pixel ratio
    context.scale(dpr, dpr);

    // Calculate the number of lines based on the number of newline characters
    const lines = text.split('\n');
    const lineCount = lines.length;
    const columnWidth = width / lineCount;

    // Function to get the maximum font size that fits within the width and height for vertical text
    const getMaxFontSizeVertical = () => {
        let fontSize = columnWidth;
        context.font = `${fontSize}px ${font}`;
        let maxHeight;
        do {
            fontSize--;
            context.font = `${fontSize}px ${font}`;
            maxHeight = Math.max(...lines.map(line => line.length * fontSize * 1.2));
        } while ((maxHeight > height || fontSize * 1.2 * lineCount > width) && fontSize > 0);
        return fontSize;
    };

    // Function to get the maximum font size that fits within the width and height for horizontal text
    const getMaxFontSizeHorizontal = () => {
        let fontSize = 10;
        context.font = `${fontSize}px ${font}`;
        let textWidth, textHeight;
        do {
            fontSize++;
            context.font = `${fontSize}px ${font}`;
            textWidth = Math.max(...lines.map(line => context.measureText(line).width));
            textHeight = fontSize * lineCount;
        } while (textWidth < width * 0.9 && textHeight < height * 0.9);
        return fontSize - 1; // Reduce by 1 to ensure it fits within the dimensions
    };

    // Get the maximum font size based on direction
    let fontSize;
    if (direction === 'horizontal') {
        fontSize = getMaxFontSizeHorizontal();
    } else {
        fontSize = getMaxFontSizeVertical();
    }
    context.font = `${fontSize}px ${font}`;

    // Clear the canvas
    context.clearRect(0, 0, width, height);

    // Draw the text
    context.fillStyle = color;
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    if (direction === 'horizontal') {
        context.save();
        const lineHeight = fontSize * 1.2;
        const startY = (height - lineHeight * lineCount) / 2 + lineHeight / 2;
        lines.forEach((line, i) => {
            context.fillText(line, width / 2, startY + i * lineHeight);
        });
        context.restore();
    } else {
        context.save();
        for (let col = 0; col < lineCount; col++) {
            const line = lines[col];
            for (let row = 0; row < line.length; row++) {
                const x = (col + 0.5) * columnWidth;
                const y = (row + 0.5) * fontSize * 1.2;
                context.fillText(line[row], x, y);
            }
        }
        context.restore();
    }

    // Create ImageBitmap from OffscreenCanvas
    return canvas.transferToImageBitmap();
}