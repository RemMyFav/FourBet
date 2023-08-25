import { _decorator, Component, Node, director, view, screen, Sprite, SpriteFrame, resources, Texture2D, UITransform, Event} from 'cc';
import { PlayerController } from './playerController';
import { DeckController } from './deckController';
import { addComponentNoDup, MyEvent } from '../Utils'
import { SeatController } from './seatController';
const { ccclass, property } = _decorator;

@ccclass('matchController')
export class matchController extends Component {
    // @property
    // private winner: playerController;
    // @property
    // private players: [playerController, playerController, playerController, playerController, playerController, playerController];
    // private _blind: playerController;
    // private _pool: number;
    // private _progress: Progress;
    private deck: Node;
    private seats: Node[];
    private seatNum: number = 6;
    onLoad(): void {
        this._name = "match";
        // this.node.name = "MATCH";
        /** 
         * Add a sprite component to matchNode and set the sprite.spriteFrame to image bg.png as background
         * Adaptively modify the background scale to make sure the background image covers the whole visable area
         * https://blog.csdn.net/qq_26069551/article/details/129813471
        */
        resources.load("image/bg/spriteFrame", SpriteFrame, (err, spriteFrame) => {
            // Load background image
            let matchSprite: Sprite = addComponentNoDup(this.node, Sprite);
            matchSprite.spriteFrame = spriteFrame;
            matchSprite.type = Sprite.Type.SIMPLE;
            // Calculate the scale and adaptively modify the scale
            const drSize = view.getDesignResolutionSize();
            const bgSize = this.node.getComponent(UITransform).contentSize;
            const widthAdaptScale = drSize.width/bgSize.width;
            const heightAdaptScale = drSize.height/bgSize.height;
            const adaptScale = widthAdaptScale > heightAdaptScale ? widthAdaptScale : heightAdaptScale;
            this.node.setScale(adaptScale, adaptScale);
        });
        // When the MATCH begins generate one DECK for it
        this.generateDeck().then((deck)=>{
        }).catch((err) => {
            console.log(err);
        })
        this.generateSeat().then((seat)=>{
            // console.log(seat)
            this.seats = seat;
        }).catch((err) => {
            console.log(err);
        })
    }

    start() {
        this.begin(this.seats).then(()=>{
            this.node.children.forEach(element => {
                console.log(element);
            });
        }).catch((err) => {
            console.log(err);
        })
    }

    update(deltaTime: number) {
        
    }
    // begin(callback: (err: Error | null) => void): void{
    //     this.deck.getComponent(DeckController).dealCard(this.seats, () =>{
    //     })
    // }

    private async begin(seats: Node[]): Promise<void>{
        this.deck.getComponent(DeckController).deckBegin(seats);
        return await new Promise((reslove, reject) =>{
            reslove();
        })
    }

    

    private async generateSeat(): Promise<Node[]>{
        const seats: Node[] = [];
        for(let i = 0; i < this.seatNum; i++){
            const seatNode: Node = new Node("SEAT");
            const seatComponent: SeatController= seatNode.addComponent(SeatController);
            this.node.addChild(seatNode);
            seats.push(seatNode);
        }
        const count = seats.length;
        return await new Promise((reslove, reject) =>{
            //check if there are 6 nodes
            if(!this.node.getChildByName){
                reject(new Error("Generate DECK node Failed"));
            }
            if(seats.length !== this.seatNum){
                reject(new Error("Seat number is not correct"));
            }
            reslove(seats);
        }
    )};

    async generateDeck(): Promise<void>{
        const deckNode: Node = new Node("DECK");
        const drSize = view.getDesignResolutionSize();
        deckNode.setPosition(drSize.width/ 2, drSize.height / 2)
        const deckComponent: DeckController = deckNode.addComponent(DeckController);
        this.node.addChild(deckNode)
        this.deck = deckNode;
        return await new Promise((reslove, reject) =>{
            if(!this.node.getChildByName("DECK")){
                reject(new Error("Generate DECK node Failed"))
            }
            reslove();
        })
    }
}

