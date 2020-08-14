/*!
 * Licensed under the MIT License.
 */
/// <reference types="node" />
export interface RCallback {
    (message: Buffer): void;
}
export declare class PianoReceiver {
    ourCallbacks: RCallback[];
    private wss;
    private lastNote;
    private lastVel;
    private lastChannel;
    private lastTime;
    addReceiver(callback: RCallback): void;
    removeReceiver(callback: RCallback): void;
    constructor();
}
//# sourceMappingURL=receiver.d.ts.map