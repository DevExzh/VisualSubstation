/**
 * 检查当前浏览器是否支持离屏渲染
 * @author Three.js
 */
export function safariVersionSupportOffscreenCanvas(): boolean {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    // If it's Safari, then check the version because Safari < 17 doesn't support OffscreenCanvas with a WebGL context.
    if (isSafari) {
        const versionMatch = navigator.userAgent.match( /version\/(\d+)/i );
        const safariVersion = versionMatch ? parseInt(versionMatch[1]) : 0;
        return safariVersion >= 17;
    }
    return true;
}