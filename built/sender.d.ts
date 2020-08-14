/*!
 * Licensed under the MIT License.
 */
interface RCallback {
    (note: number, vel: number): void;
}
export default class OscSender {
    ourCallback: RCallback;
    private wss;
    private oscRemotes;
    constructor();
    send(message: string): void;
}
export {};
//# sourceMappingURL=sender.d.ts.map