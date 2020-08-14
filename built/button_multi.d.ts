/*!
 * Licensed under the MIT License.
 */
import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import App from './app';
export default class ButtonMulti {
    private ourApp;
    private ourChoice;
    private ourLabels;
    private buttonActor;
    private buttonText;
    ourHolder: MRE.Actor;
    constructor(ourApp: App);
    destroy(): void;
    setPos(pos: MRE.Vector3): void;
    createAsync(pos: MRE.Vector3, parentId: MRE.Guid, labels: string[], ourVal: number, callback: (n: number) => any, width?: number, height?: number): Promise<void>;
    setValue(val: number): void;
    getValue(): number;
    private setGreen;
    private setRed;
    private updateDisplayValue;
}
//# sourceMappingURL=button_multi.d.ts.map