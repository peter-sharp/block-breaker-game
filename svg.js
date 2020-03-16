const NS = 'http://www.w3.org/2000/svg'

export default function svg(tag, attrs = {}, children = []) {
  let el = document.createElementNS(NS, tag);
  
  for(let attr in attrs) {
    el.setAttributeNS(null, attr, attrs[attr])
  }
  
  children.forEach( (child) => {
    el.appendChild(child)
  })
  return el
}