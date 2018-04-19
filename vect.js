function Vect(x, y) {
    let vect = {0:x || 0, 1:y || 0};
    Object.defineProperty(vect, 'x', {
      get: function() {return vect[0]; },
      set: function(val) { vect[0] = val; },
    });
    Object.defineProperty(vect, 'y', {
      get: function() {return vect[1]; },
      set: function(val) { vect[1] = val; },
    });
    return vect;
  }
  
  Vect.up = function({x, y}) {
    return Vect(x, y + 1);
  }
  
  Vect.down = function({x, y}) {
    return Vect(x, y - 1);
  }
  
  Vect.left = function({x, y}) {
    return Vect(x - 1, y);
  }
  
  Vect.right = function({x, y}) {
    return Vect(x + 1, y);
  }
  
  export default Vect