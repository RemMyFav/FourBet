import { _decorator, Component, Node } from 'cc';
import { CardController } from './cardController';
const { ccclass, property } = _decorator;

@ccclass('playerController')
export class PlayerController extends Component {
    @property
    private money: number;

    start() {

    }

    update(deltaTime: number) {
        
    }
}

