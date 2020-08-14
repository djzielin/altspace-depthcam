/*!
 * Licensed under the MIT License.
 */
import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import App from './app';
export default class Console {
    private ourApp;
    private consoleTextActor;
    private consoleText;
    private consoleOn;
    private consoleParent;
    private ourParent;
    constructor(ourApp: App);
    setConsoleOn(b: boolean): void;
    createAsyncItems(pos: MRE.Vector3, ourParent: MRE.Guid): Promise<void>;
    logMessage(message: string): void;
}
//# sourceMappingURL=console.d.ts.map