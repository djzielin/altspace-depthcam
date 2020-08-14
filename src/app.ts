/*!
 * Licensed under the MIT License.
 */

import * as MRE from '@microsoft/mixed-reality-extension-sdk';
//import * as MRE from '../../mixed-reality-extension-sdk/packages/sdk/';

import { PianoReceiver, RCallback } from './receiver'
import Console from './console';
import Button from './button';
import GrabButton from './grabbutton';
import Users from './users';
import GuiPanel from './gui_panel';
import MusicModule from './music_module';

interface PatchPointProperties{
	module: MusicModule;
	messageType: string;
	isSender: boolean;
	gui: GuiPanel;
	button: Button;
}

interface PatchProperties{
	sender: PatchPointProperties;
	receiver: PatchPointProperties;
	line: MRE.Actor;
}

export default class App {
	public assets: MRE.AssetContainer;	

	public showGUIs=false;

	public allGUIs: GuiPanel[] = [];
	
	public ourConsole: Console = null;
	public menuGrabber: GrabButton = null;

	public boxMesh: MRE.Mesh;
	public redMat: MRE.Material;
	public greenMat: MRE.Material;
	public whiteMat: MRE.Material;
	public blackMat: MRE.Material;
	public grayMat: MRE.Material;

	public handMesh: MRE.Mesh = null;
	public handTexture: MRE.Texture = null;
	public handMaterial: MRE.Material = null;

	public ourUsers: Users;

	private receiverCallback: RCallback;

	private ourPatches: PatchProperties[]=[]; //TODO patcher could be its own class
	private potentialPatchStack: PatchPointProperties[] = [];

	public depthCubes: MRE.Actor[]=[];

	public isPatchPointEqual(patchP1: PatchPointProperties, patchP2: PatchPointProperties){
		if(patchP1.gui!==patchP2.gui){
			return false;
		}

		if(patchP1.isSender!==patchP2.isSender){
			return false;
		}

		if(patchP1.messageType!==patchP2.messageType){
			return false;
		}
		if(patchP1.module!==patchP2.module){
			return false;
		}
		if(patchP1.button!==patchP2.button){
			return false;
		}

		return true;
	}

	public isPatchEqual(patch1: PatchProperties, patch2: PatchProperties){
		if(!this.isPatchPointEqual(patch1.sender,patch2.sender)){
			return false;
		}

		if(!this.isPatchPointEqual(patch1.receiver,patch2.receiver)){
			return false;
		}

		return true;
	}

	public getPatchPointWorldPosition(patchPoint: PatchPointProperties, isSender: boolean): MRE.Vector3{
		const offset=new MRE.Vector3(0.75/2,0.1/2,0);
		if(!isSender){
			offset.x=-0.75/2
		}

		return patchPoint.gui.transformPoint(patchPoint.button.getHolderPos().add(offset));
	}

	public updatePatchLines(gui: GuiPanel){
		this.ourConsole.logMessage("Grab Release happening. Updating Patcher Lines!");

		for (const existingPatch of this.ourPatches) {
			if(existingPatch.sender.gui===gui || existingPatch.receiver.gui===gui){
				const pos1=this.getPatchPointWorldPosition(existingPatch.sender,true);
				const pos2=this.getPatchPointWorldPosition(existingPatch.receiver,false);
				existingPatch.sender.gui.updatePatchLine(existingPatch.line,pos1,pos2);		
			}
		}
	}

	public showPatchLines(){
		for (const existingPatch of this.ourPatches) {
			if(existingPatch.line){
				existingPatch.line.appearance.enabled=true;
			}
		}
	}

	public hidePatchLines(){
		for (const existingPatch of this.ourPatches) {
			if(existingPatch.line){
				existingPatch.line.appearance.enabled=false;
			}
		}
	}

	public applyPatch(sender: PatchPointProperties, receiver: PatchPointProperties) {
		const newPatch = {
			sender: sender,
			receiver: receiver,
			line: null as MRE.Actor
		}

		for (const existingPatch of this.ourPatches) {
			if (this.isPatchEqual(existingPatch,newPatch)) { //already exists! so DELETE
				this.ourConsole.logMessage("  patch already exists. deleting!");
				sender.module.removeSendDestination(receiver.module);
				if(existingPatch.line){
					existingPatch.line.destroy();
				}
				const index = this.ourPatches.indexOf(existingPatch);
				this.ourPatches.splice(index, 1);

				return;
			}
		}

		this.ourConsole.logMessage("  patch doesn't yet exist. adding!");
		sender.module.sendDestinations.push(receiver.module);

		if (newPatch.sender.gui && newPatch.receiver.gui) {
			const pos1 = this.getPatchPointWorldPosition(newPatch.sender, true);
			const pos2 = this.getPatchPointWorldPosition(newPatch.receiver, false);
			newPatch.line = sender.gui.createPatchLine(pos1, pos2);
		}

		this.ourPatches.push(newPatch);
	}

	public patcherClickEvent(module: MusicModule, messageType: string, isSender: boolean, 
			gui: GuiPanel, button: Button) {
		const patchType: string = isSender ? "sender" : "receiver";
		this.ourConsole.logMessage("received patch point: " + messageType + " " + patchType );
		
		const potentialPatchPoint = {
			module: module,
			messageType: messageType,
			isSender: isSender,
			gui: gui,
			button: button
		}

		this.potentialPatchStack.push(potentialPatchPoint);

		if(this.potentialPatchStack.length===2){ 
			this.ourConsole.logMessage("  have 2 pending patch points, checking if we have a match!");

			let sender: PatchPointProperties=null;
			let receiver: PatchPointProperties=null;

			for(const singlePatchPoint of this.potentialPatchStack){
				if(singlePatchPoint.isSender){
					sender=singlePatchPoint;
				}else{
					receiver=singlePatchPoint;
				}
			}

			if(sender && receiver){ //great, we got both a sender and a receiver
				if(sender.messageType===receiver.messageType){ //do message types match? ie both midi?
					if(sender.gui!==receiver.gui){
						this.ourConsole.logMessage("  we have a match!");
						this.applyPatch(sender,receiver);
					} else{
						this.ourConsole.logMessage("  not allowing user to route back to self");
					}
				} else{
					this.ourConsole.logMessage("  incompatible message type");
				}
			} else {
				this.ourConsole.logMessage("  no match. both are senders or receivers");
			}
		
			sender.button.setValue(true);
			receiver.button.setValue(true);

			this.potentialPatchStack.pop();
			this.potentialPatchStack.pop();
		}
	}

	constructor(public context: MRE.Context, public baseUrl: string, public baseDir: string,
		public ourReceiver: PianoReceiver) {
		this.ourConsole = new Console(this);

		this.assets = new MRE.AssetContainer(context);
		this.boxMesh = this.assets.createBoxMesh('boxMesh', 1.0, 1.0, 1.0);

		this.redMat = this.assets.createMaterial('redmat', {
			color: new MRE.Color4(1, 0, 0)
		});

		this.greenMat = this.assets.createMaterial('redmat', {
			color: new MRE.Color4(0, 1, 0)
		});
		this.blackMat = this.assets.createMaterial('blackMat', {
			color: new MRE.Color4(0, 0, 0)
		});
		this.whiteMat = this.assets.createMaterial('whiteMat', {
			color: new MRE.Color4(1, 1, 1)
		});
		this.grayMat = this.assets.createMaterial('whiteMat', {
			color: new MRE.Color4(0.5, 0.5, 0.5)
		});

		const filename = `${this.baseUrl}/` + "hand_grey.png";
		this.handTexture = this.assets.createTexture("hand", {
			uri: filename
		});

		this.handMaterial = this.assets.createMaterial('handMat', {
			color: new MRE.Color4(1, 1, 1),
			mainTextureId: this.handTexture.id
		});

		this.handMesh = this.assets.createBoxMesh('boxMesh', 0.25, 0.1, 0.25);

		this.menuGrabber = new GrabButton(this);
		this.menuGrabber.create(new MRE.Vector3(3, 0.1, 0));

		this.ourUsers=new Users(this);

		this.context.onStarted(() => this.started());
		this.context.onStopped(() => this.stopped());
		this.context.onUserLeft(user => this.ourUsers.userLeft(user));
		this.context.onUserJoined(user => this.ourUsers.userJoined(user));
	}

	private websocketReceiveCallback(info: Int8Array[]){

	}

	public degToRad(degrees: number) {
		const pi = Math.PI;
		return degrees * (pi / 180);
	}
	private doReset() {
		process.exit(0);
	}

	public vector2String(v: MRE.Vector3, precision: number) {
		return "{X: " + v.x.toFixed(precision) +
			" Y: " + v.y.toFixed(precision) +
			" Z: " + v.z.toFixed(precision) + "}";
	}

	/*
		https://stackoverflow.com/questions/10073699/pad-a-number-with-leading-zeros-in-javascript	
	*/
	public pad(value: number, maxWidth: number, padChar: string) {
		const n = value.toString();
		return n.length >= maxWidth ? n : new Array(maxWidth - n.length + 1).join(padChar) + n;
	}

	public showAllGuis(b: boolean) {
		for (const singlePanel of this.allGUIs) {
			if (b) {
				singlePanel.show();

			} else {
				singlePanel.hide();
			}
		}

		if (b) {
			this.showPatchLines();
		} else {
			this.hidePatchLines();
		}
	}	

	private async loadAsyncItems() {
		this.ourConsole.logMessage("creating console");
		await this.ourConsole.createAsyncItems(new MRE.Vector3(-0.7, 0, 0.9),this.menuGrabber.getGUID());

		this.ourConsole.logMessage("Creating Reset Button ");
		const button = new Button(this);
		await button.createAsync(new MRE.Vector3(-0.7, 0, 0.5), this.menuGrabber.getGUID(), "Reset", "Reset",
			false, this.doReset.bind(this));

		this.ourConsole.logMessage("Creating ShowGUI Button ");
		const guiButton = new Button(this);
		await guiButton.createAsync(new MRE.Vector3(-0.7, 0, 0.1), this.menuGrabber.getGUID(), "GUIs ON", "GUIs OFF",
			this.showGUIs, this.showAllGuis.bind(this));

		let xPos = 1.5;	

		this.ourConsole.logMessage("Waiting for all patch lines to be created");

		for(const singlePatch of this.ourPatches){
			await singlePatch.line.created();
		}

		const decimation=16;
		const yMax=480/decimation;
		const xMax=640/decimation;

		for(let y=0;y<yMax;y++){
			for(let x=0;x<xMax;x++){
				const depthCube = MRE.Actor.Create(this.context, {
					actor: {
						//parentId: this.ourHolder.id,
						name: "depthCube",
						appearance: {
							meshId: this.boxMesh.id
							//materialId: mat
						},
						//collider: { geometry: { shape: MRE.ColliderType.Auto } },
						transform: {
							local: {
								position: { x: x/decimation*2.0-5, y: y/decimation*2.0+1.0, z: 1000},
								scale: new MRE.Vector3(1/decimation*2.0,1/decimation*2.0,1/decimation*2.0)
							}
						}
					}
				});
				this.depthCubes.push(depthCube);
			}
		}

		this.showAllGuis(false);
	}

	public dIndex=0;
	public timer: NodeJS.Timeout;

	public PianoReceiveCallback(message: Buffer){
		this.ourConsole.logMessage("we got data from remote: " + message.length);

		if(this.dIndex>0){
			this.ourConsole.logMessage("still processing old image");
			return;
		}

		this.timer = setInterval(() => {
			for (let i = 0; i < 600; i++) {
				//this.ourConsole.logMessage("i: " + this.dIndex);
				let zPos: number = message[this.dIndex];
				if (zPos > 0) {
					this.depthCubes[this.dIndex].transform.local.position.z = -3 + (zPos / 255.0)*4.0;
				}
				else {
					this.depthCubes[this.dIndex].transform.local.position.z = 1000;
				}
				this.dIndex++;
				if (this.dIndex === message.length) {
					clearInterval(this.timer);
					this.dIndex=0;
					break;
				}
			}
		}, 1);

		/*for(let i=0;i<message.length;i++){
			
		}*/
	}

	private stopped() {
		MRE.log.info("app", "stopped callback has been called");
		this.ourReceiver.removeReceiver(this.receiverCallback);
	}

	private started() {
		this.ourConsole.logMessage("started callback has begun");

		this.loadAsyncItems().then(() => {
			this.ourConsole.logMessage("all async items created/loaded!");
			this.receiverCallback = this.PianoReceiveCallback.bind(this)
			this.ourReceiver.addReceiver(this.receiverCallback);			
		});
	}
}
