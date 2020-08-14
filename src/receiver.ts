/*!
 * Licensed under the MIT License.
 */

import * as MRE from '@microsoft/mixed-reality-extension-sdk';
//import * as MRE from '../../mixed-reality-extension-sdk/packages/sdk/';

import WebSocket from 'ws';

export interface RCallback {
	(message: Buffer): void;
}

export class PianoReceiver {
	public ourCallbacks: RCallback[] = [];
	private wss: WebSocket.Server

	private lastNote=0;
	private lastVel=0;
	private lastChannel=0;
	private lastTime=0;

	public addReceiver(callback: RCallback){
		MRE.log.info("app", "adding receiver callback");
		this.ourCallbacks.push(callback);
		MRE.log.info("app", "size of callback array now: " + this.ourCallbacks.length);
	}

	public removeReceiver(callback: RCallback){
		MRE.log.info("app", "attempting to remove receiver callback");

		const index=this.ourCallbacks.indexOf(callback);
		if(index>-1){
			this.ourCallbacks.splice(index, 1);
		}
		MRE.log.info("app", "size of callback array now: " + this.ourCallbacks.length);

	}

	constructor() {
		this.wss = new WebSocket.Server({ port: 3902 });

		this.wss.on('connection', (ws: WebSocket) => {
			MRE.log.info("app", 'remote midi keyboard has connected!');


			ws.on('message', (message: Buffer) => {
				for (const singleCallback of this.ourCallbacks) { //broadcast to all listeners
					if (singleCallback) {
						singleCallback(message);
					}
				}
			});
		});
	}
}
