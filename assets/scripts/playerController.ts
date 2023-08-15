import { _decorator, Component, Node } from 'cc';
import { CardController } from './cardController';
const { ccclass, property } = _decorator;

@ccclass('playerController')
export class PlayerController extends Component {
    @property
    private _name: string;
    private _id: number;
    private _isBlind: boolean;
    private _hand: [cardController, cardController, cardController];
    private _money: number;
    private _isAI: boolean;
    private _isFold: boolean;

    start() {

    }

    update(deltaTime: number) {
        
    }
}

