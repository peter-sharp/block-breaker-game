import Vect from './vect.js'
import eqProps from '/web_modules/ramda/es/eqProps.js'

export function Block({
  color = "#333",
  state = 'alive',
  pos = Vect(),
  id = getId(),
  width = 0,
  height = 0,
} = {}) {
  pos = Vect(pos);
  return {
    color,
    state: state || 'alive',
    id: id || getId(),
    width,
    height,
    get pos() {
      return pos
    },
    set pos(newPos) {
      pos = newPos
    },
    get x() {
      return pos.x;
    },
    get y() {
      return pos.y;
    }
  };
}

function getId() {
  getId.lastId += 1;
  return getId.lastId;
}
getId.lastId = 0;

Block.sameColor = eqProps('color')

Block.setBroken = block => {
  block = Block(block)
  block.state = 'broken'
  return block
}

Block.setFalling = block => {
  block = Block(block)
  block.state = 'falling'
  return block
}
  
export default Block