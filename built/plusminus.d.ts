/*!
 * Licensed under the MIT License.
 */
import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import App from './app';
export default class PlusMinus {
    private ourApp;
    private ourValue;
    private ourLabel;
    private ourChangeAmount;
    private buttonValueDisplay;
    constructor(ourApp: App);
    createAsync(pos: MRE.Vector3, parentId: MRE.Guid, label: string, ourVal: number, changeAmount: number, callback: (n: number) => any): Promise<void>;
    private updateDisplayValue;
}
//# sourceMappingURL=plusminus.d.ts.map