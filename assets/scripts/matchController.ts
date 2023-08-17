import { _decorator, Component, Node, director, view, screen, Sprite, SpriteFrame, resources, Texture2D, UITransform} from 'cc';
import { PlayerController } from './playerController';
import { DeckController } from './deckController';
import { addComponentNoDup } from '../Utils'
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
    private _deck: DeckController;
    onLoad(): void {
        this._name = "match";
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
    }

    start() {
        this.generateDeck();
    }

    update(deltaTime: number) {
        
    }
    generateDeck(): void{
        const deckNode: Node = new Node();
        deckNode.name = "deck";
        const drSize = view.getDesignResolutionSize();
        deckNode.setPosition(drSize.width/ 2, drSize.height / 2)
        const deckComponent: DeckController = deckNode.addComponent(DeckController);
        deckComponent.generateCards();
        this.node.addChild(deckNode)
        this._deck = deckComponent;
    }
}

