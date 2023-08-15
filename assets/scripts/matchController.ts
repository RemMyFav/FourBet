import { _decorator, Component, Node, director, view, screen} from 'cc';
import { PlayerController } from './playerController';
import { DeckController } from './deckController';
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
    scrWidth: number;
    scrHeight: number;
    private _deck: DeckController;
    
    onLoad(): void {
        this.scrWidth = screen.windowSize.width;
        this.scrHeight = screen.windowSize.height;
    }
    // private _timer: Timer;
    start() {
        console.log("hi")
        this.generateDeck();
        console.log(this.node);
    }

    update(deltaTime: number) {
        
    }
    generateDeck(): void{
        let deckNode: Node = new Node();
        deckNode.setPosition(this.scrWidth / 2, this.scrHeight / 2)
        let deckComponent: DeckController = deckNode.addComponent(DeckController);
        deckComponent.generateCards();
        this.node.addChild(deckNode)
        this._deck = deckComponent;
    }
}

