const KeyBoardEventCodeRegex =
    /^(?:Key[A-Z]|Digit[0-9]|Arrow(?:Up|Down|Left|Right)|Enter|Escape|Backspace|Tab|Space|Shift(?:Left|Right)|Control(?:Left|Right)|Alt(?:Left|Right)|Meta(?:Left|Right)|CapsLock|NumLock|ScrollLock|Pause|Insert|Delete|Home|End|PageUp|PageDown|F[1-9][0-9]?|ContextMenu)$/;

export type Key = {
    code: string;
    isContinuous?: boolean;
    ctrlKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
    metaKey?: boolean;
};

/**
 * 按键绑定发生变化的事件
 * @see KeyBinds
 */
export class KeyBindsChangeEvent extends Event {
    public readonly code: Key;
    public readonly bindName: string;
    public constructor(bindName: string, code: Key) {
        super('key-binds-change');
        this.code = code;
        this.bindName = bindName;
    }
}

export class KeyBindsEvent extends Event {
    public readonly bindName: string;
    public readonly isDown: boolean;
    public constructor(bindName: string, down: boolean = true) {
        super('key-binds');
        this.bindName = bindName;
        this.isDown = down;
    }
}

const isMatchedKey = (event: KeyboardEvent, key: Key): boolean => {
    return event.code === key.code &&
        event.ctrlKey == (key.ctrlKey ?? false) &&
        event.metaKey == (key.metaKey ?? false) &&
        event.shiftKey == (key.shiftKey ?? false) &&
        event.altKey == (key.altKey ?? false);
}

/**
 * 按键绑定
 * @description
 * 默认按键绑定：
 * <ul>
 *     <li><b>跳跃</b>：<code>空格</code></li>
 *     <li><b>冲刺</b>：<code>左 Control</code></li>
 *     <li><b>向左扫视</b>：<code>A</code></li>
 *     <li><b>向右扫视</b>：<code>D</code></li>
 *     <li><b>向前走</b>：<code>W</code></li>
 *     <li><b>向后走</b>：<code>S</code></li>
 *     <li><b>切换视角</b>：<code>左 Shift</code></li>
 * </ul>
 * @author Ryker Zhu <ryker.zhu@nuist.edu.cn>
 * @since 2 July 2024
 */
export class KeyBinds extends EventTarget {
    // 跳跃
    private _jump: Key = { code: 'Space' };
    public set jump(key: Key) {
        if (KeyBinds.isValidKey(key)) {
            this._jump = key;
            this.dispatchEvent(new KeyBindsChangeEvent('jump', key));
        } else {
            console.warn(`Invalid key ${key}`);
        }
    }
    public get jump(): Key {
        return this._jump;
    }

    // 冲刺
    private _sprint: Key = { code: 'ControlLeft', ctrlKey: true };
    public set sprint(key: Key) {
        if (KeyBinds.isValidKey(key)) {
            this._sprint = key;
            this.dispatchEvent(new KeyBindsChangeEvent('sprint', key));
        } else {
            console.warn(`Invalid key ${key}`);
        }
    }
    public get sprint(): Key {
        return this._sprint;
    }

    // 向左扫视
    private _strafeLeft: Key = { code: 'KeyA' };
    public set strafeLeft(key: Key) {
        if (KeyBinds.isValidKey(key)) {
            this._strafeLeft = key;
            this.dispatchEvent(new KeyBindsChangeEvent('strafeLeft', key));
        } else {
            console.warn(`Invalid key ${key}`);
        }
    }
    public get strafeLeft(): Key {
        return this._strafeLeft;
    }

    // 向右扫视
    private _strafeRight: Key = { code: 'KeyD' };
    public set strafeRight(key: Key) {
        if (KeyBinds.isValidKey(key)) {
            this._strafeRight = key;
            this.dispatchEvent(new KeyBindsChangeEvent('strafeRight', key));
        } else {
            console.warn(`Invalid key ${key}`);
        }
    }
    public get strafeRight(): Key {
        return this._strafeRight;
    }

    // 向前走
    private _walkForwards: Key = { code: 'KeyW' };
    public set walkForwards(key: Key) {
        if (KeyBinds.isValidKey(key)) {
            this._walkForwards = key;
            this.dispatchEvent(new KeyBindsChangeEvent('walkForwards', key));
        } else {
            console.warn(`Invalid key ${key}`);
        }
    }
    public get walkForwards(): Key {
        return this._walkForwards;
    }

    // 向后走
    private _walkBackwards: Key = { code: 'KeyS' };
    public set walkBackwards(key: Key) {
        if (KeyBinds.isValidKey(key)) {
            this._walkBackwards = key;
            this.dispatchEvent(new KeyBindsChangeEvent('walkBackwards', key));
        } else {
            console.warn(`Invalid key ${key}`);
        }
    }
    public get walkBackwards(): Key {
        return this._walkBackwards;
    }

    // 切换相机视角
    private _toggleCamera: Key = { code: 'KeyV' };
    public set toggleCamera(key: Key) {
        if (KeyBinds.isValidKey(key)) {
            this._toggleCamera = key;
            this.dispatchEvent(new KeyBindsChangeEvent('toggleCamera', key));
        } else {
            console.warn(`Invalid key ${key}`);
        }
    }
    public get toggleCamera(): Key {
        return this._toggleCamera;
    }

    public static isValidKey(key: Key): boolean {
        if (key.code.length === 0) return false;
        return KeyBoardEventCodeRegex.test(key.code);
    }

    public eventHandler(event: KeyboardEvent): boolean {
        if(event.type !== 'keydown' && event.type !== 'keyup') return false;
        switch (event.code) {
            case this._jump.code: {
                if(isMatchedKey(event, this._jump) && event.type === 'keydown') {
                    this.dispatchEvent(new KeyBindsEvent('jump'));
                    return true;
                } else {
                    return false;
                }
            }
            case this._sprint.code: {
                if(isMatchedKey(event, this._sprint)) {
                    this.dispatchEvent(new KeyBindsEvent('sprint', event.type === 'keydown'));
                    return true;
                } else {
                    return false;
                }
            }
            case this._strafeLeft.code: {
                if(isMatchedKey(event, this._strafeLeft)) {
                    this.dispatchEvent(new KeyBindsEvent('strafeLeft', event.type === 'keydown'));
                    return true;
                } else {
                    return false;
                }
            }
            case this._strafeRight.code: {
                if(isMatchedKey(event, this._strafeRight)) {
                    this.dispatchEvent(new KeyBindsEvent('strafeRight', event.type === 'keydown'));
                    return true;
                } else {
                    return false;
                }
            }
            case this._walkForwards.code: {
                if(isMatchedKey(event, this._walkForwards)) {
                    this.dispatchEvent(new KeyBindsEvent('walkForwards', event.type === 'keydown'));
                    return true;
                } else {
                    return false;
                }
            }
            case this._walkBackwards.code: {
                if(isMatchedKey(event, this._walkBackwards)) {
                    this.dispatchEvent(new KeyBindsEvent('walkBackwards', event.type === 'keydown'));
                    return true;
                } else {
                    return false;
                }
            }
            case this._toggleCamera.code: {
                if(isMatchedKey(event, this._toggleCamera) && event.type === 'keyup') {
                    this.dispatchEvent(new KeyBindsEvent('toggleCamera'));
                    return true;
                } else {
                    return false;
                }
            }
            default: return false;
        }
    }

    /**
     * 构造函数
     * @see KeyBinds
     */
    public constructor() {
        super();
    }
}
