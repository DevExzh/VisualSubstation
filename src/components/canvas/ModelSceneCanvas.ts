export interface ModelSceneOperations {
    addObjectFunction: (filePath: string) => Promise<string | undefined>,
    removeObjectFunction: (uuid: string) => Promise<void>,
}

export const keySceneOperations = 'MODEL_SCENE_OP';