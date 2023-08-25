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
        // When the MATCH begins generate SEATs for it
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

    /**
     * After all element in the game is generated, the game shall begins
     * the first step is to deal card
     * @returns Promise<void>
     */
    private async begin(seats: Node[]): Promise<void>{
        this.deck.getComponent(DeckController).deckBegin(seats);
        return await new Promise((reslove, reject) =>{
            reslove();
        })
    }

    /**
     * Generate SEATs for this MATCH the number of SEATs depending on the max number of
     * player that one round could be SEATs could be taken by an AI or real player
     * @returns Promise<Node[]>
     */
    private async generateSeat(): Promise<Node[]>{
        const seats: Node[] = [];
        for(let i = 0; i < this.seatNum; i++){
            const seatNode: Node = new Node("SEAT");
            const seatComponent: SeatController= addComponentNoDup(seatNode, SeatController);
            this.node.addChild(seatNode);
            seats.push(seatNode);
        }
        return await new Promise((reslove, reject) =>{
            //check if there are correct number of SEATs are being generated
            if(this.node.getComponentsInChildren(SeatController).length !== this.seatNum){
                reject(new Error("Generate SEAT node Failed"));
            }
            reslove(seats);
        }
    )};
    
    /**
     * Generate the only DECK for this MATCH this DECK contains
     * all the CARDs will be shown in the game and has the method
     * to deal card.
     * @returns Promise<void> 
     */
    async generateDeck(): Promise<void>{
        const deckNode: Node = new Node("DECK");
        const drSize = view.getDesignResolutionSize();
        deckNode.setPosition(drSize.width/ 2, drSize.height / 2);
        const deckComponent: DeckController = addComponentNoDup(deckNode, DeckController);
        this.node.addChild(deckNode)
        this.deck = deckNode;
        return await new Promise((reslove, reject) =>{
            // check if the DECK node is successfully generated
            if(!this.node.getChildByName("DECK")){
                reject(new Error("Generate DECK node Failed"))
            }
            reslove();
        })
    }
}

