export interface ModelSceneOperations {
    addObjectFunction: (filePath: string) => Promise<string | undefined>,
    removeObjectFunction: (uuid: string) => Promise<void>,
    setObjectPosition: (uuid: string, position: [number, number, number]) => Promise<void>,
}

export const keySceneOperations = 'MODEL_SCENE_OP';