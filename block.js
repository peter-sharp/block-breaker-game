import Vect from './vect.js'
import eqProps from 'https://unpkg.com/ramda@0.25.0/es/eqProps.js'

export function Block({color, state, pos}) {
    return {color: color || "#333", state: 'alive', pos: pos || Vect()}
  }
  
  Block.sameColor = eqProps('color')
  
  Block.setBroken = block => {
    block = Block(block)
    block.state = 'broken'
    block.color = '#333'
    return block
  }
  
export default Block