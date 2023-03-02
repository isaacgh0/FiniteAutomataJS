const getTransitions = () => {
  const init_state = link.starting.getAttribute('key')
  const final_state = link.ending.getAttribute('key')

  let transitions = []

  Object.keys(states[init_state].transitions).forEach(key => {
    if (states[init_state].transitions[key].has(final_state))
      transitions.push(key)
  })

  return transitions
}
/* This functino do calculations with the measures of linked states
 * first get the position at center of state, then width alll the
 * positions calc the measures of svg element that connect the states
 * and finally get if the direcction of link in vertical and horiizontal */
const statesVisualData = () => {
  const position = {
    stx: link.starting.offsetLeft + 30, // starting x
    sty: link.starting.offsetTop + 30, // starting y
    edx: link.ending.offsetLeft + 30, // ending x
    edy: link.ending.offsetTop + 30 // ending y
  }
  const vector = {
    t: position.sty < position.edy ? position.sty : position.edy, // top
    l: position.stx < position.edx ? position.stx : position.edx, // left
    h: position.sty > position.edy ? position.sty - position.edy : position.edy - position.sty, // height
    w: position.stx > position.edx ? position.stx - position.edx : position.edx - position.stx // width
  }
  const direction = {
    v: position.sty < position.edy ? 'down' : 'up', // vertical
    h: position.stx < position.edx ? 'right' : 'left' // horizontal
  }
  return {position, vector, direction}
}
/* This function make a link between two states that have
 * all coodinates in defferent places, first get vector and direction
 * from visual data, instanec a svg and a path and calculate the
 * displacement to can see the arrow, then calculate the path position
 * with the displacement, add the measures to svg element and finally
 * add the path into svg and svg to drag area */
const drawDiagonalPath = (svg, path, text) => {
  const {position, vector, direction} = statesVisualData()

  const displacement = 100 * 30 / (vector.h > vector.w ? vector.h : vector.w)
  const move = {
    w: Math.round((vector.w * displacement / 100)),
    h: Math.round((vector.h * displacement / 100))
  }
  const path_data = {
    m: `${direction.h === 'right' ? move.w : vector.w - move.w} ${direction.v === 'down' ? move.h : vector.h - move.h}`,
    c: [
      `${direction.h === 'right' ? move.w : vector.w - move.w} ${direction.v === 'down' ? move.h : vector.h - move.h}`,
      `${direction.h === 'right' ? vector.w - move.w : move.w} ${direction.v === 'down' ? vector.h - move.h : move.h}`,
      `${direction.h === 'right' ? vector.w - move.w : move.w} ${direction.v === 'down' ? vector.h - move.h : move.h}`
    ]
  }

  svg.setAttribute('viewbox', `0 0 ${vector.w} ${vector.h}`)

  svg.style.top = `${vector.t}px`
  svg.style.left = `${vector.l}px`
  svg.style.height = `${vector.h}px`
  svg.style.width = `${vector.w}px`

  path.setAttribute('d', `M ${path_data.m} C ${path_data.c[0]}, ${path_data.c[1]}, ${path_data.c[2]}`)

  text.style.top = `${position.sty + (direction.v === 'down' ? move.h : - move.h * 2)}px`
  text.style.left = `${position.stx + (direction.h === 'right' ? move.w * 1.2 : -move.w * 2)}px`
}
/* Here the program can draw a linear line if one of the both coordinates
 * between the two states are the same, so it receives if the states are in
 * linear horizontal or vertical, then add data to svg, and calculate the info
 * to path, add that information and finally add both elements (svg, path )
 * to drag area */
const drawLinearPath = (side, svg, path, text, reverse_key) => {
  const {position, vector, direction} = statesVisualData()
  const is_second = document.querySelector(`svg.link[key='${reverse_key}']`) ? true : false 
  const measure = is_second ? 40 : 10

  let path_data = undefined

  if (side === 'horizontal') {
    text.style.top = `${position.sty - 10}px`
    text.style.left = `${direction.h === 'right' ? position.stx + 40 : position.stx - 80}px`
  } else {
    text.style.top = `${direction.v === 'down' ? position.sty + 40 : position.sty - 60}px`
    text.style.left = `${position.stx - 10}px`
  }

  svg.setAttribute('viewbox', `0 0 ${side === 'horizontal' ? vector.w : measure} ${side === 'vertical' ? vector.h : measure}`)

  svg.style.top = `${side === 'horizontal' ? vector.t - 5 : vector.t}px`
  svg.style.left = `${side === 'vertical' ? vector.l - 5 : vector.l}px`
  svg.style.width = `${side === 'horizontal' ? vector.w : measure}px`
  svg.style.height = `${side === 'vertical' ? vector.h : measure}px`

  console.log(is_second, reverse_key)

  if (is_second) {
    side === 'horizontal'
    ? path_data = {
        m: `${direction.h === 'right' ? '30' : vector.w - 30} 5`,
        c: [
          `${Math.round(vector.w / 3) * (direction.h === 'right' ? 1 : 2)} 40`,
          `${Math.round(vector.w / 3) * (direction.h === 'right' ? 2 : 1)} 40`,
          `${direction.h === 'left' ? '35' : vector.w - 35} 5`
        ]
      }
    : path_data = {
        m: `5 ${direction.v === 'down' ? '30' : vector.h - 30}`,
        c: [
          `40 ${Math.round(vector.h / 3) * (direction.v === 'up' ? 2 : 1)}`,
          `40 ${Math.round(vector.h / 3) * (direction.v === 'up' ? 1 : 2)}`,
          `5 ${direction.v === 'up' ? '35' : vector.h - 35}`
        ]
      }

    path.setAttribute('d', `M ${path_data.m} C ${path_data.c.map(point => point)}`)
    return false
  }
  
  svg.setAttribute('viewbox', `0 0 ${side === 'horizontal' ? vector.w : '10'} ${side === 'vertical' ? vector.h : '10'}`)

  svg.style.top = `${side === 'horizontal' ? vector.t - 5 : vector.t}px`
  svg.style.left = `${side === 'vertical' ? vector.l - 5 : vector.l}px`
  svg.style.width = `${side === 'horizontal' ? vector.w : '10'}px`
  svg.style.height = `${side === 'vertical' ? vector.h : '10'}px`
  
  side === 'horizontal'
  ? path_data = {
      m: `${direction.h === 'right' ? '30' : vector.w - 30} 5`,
      l: `${direction.h === 'left' ? '35' : vector.w - 35} 5`
    }
  : path_data = {
      m: `5 ${direction.v === 'down' ? '30' : vector.h - 30}`,
      l: `5 ${direction.v === 'up' ? '35' : vector.h - 35}`
    }

  path.setAttribute('d', `M ${path_data.m} L ${path_data.l}`)
}

/* This function draw a semi circle that link the same state
 * if it's the same state all calculous are pre-defined
 * the svg data, path information and only change the postion */
const drawCyclePath = (svg, path, text) => {
  const {position} = statesVisualData()

  svg.setAttribute('viewbox', '0 0 70 70')

  svg.style.top = `${position.sty - 65}px`
  svg.style.left = `${position.stx - 5}px`
  svg.style.width = '70px'
  svg.style.height = '70px'

  path.setAttribute('d', `M 35 65 C 35 65, 65 65, 65 35 C 65 5, 35 5, 35 5 C 5 5, 5 30, 5 30`)

  text.style.top = `${position.sty - 10}px`
  text.style.left = `${position.stx + 35}px`
}

/* This is an object that saves functions linked to actions
 * that user can do with an state */
const stateTools = {
  /* Prevent an console error alert */
  'handleCursor': e => e.preventDefault(),
  /* This function create a link between two states, it first check
   * that both state are selected, then get the postiion of both
   * and get the neme by the user through a promt, if the name is
   * larger than one the question is do it again, if the name is empy
   * or spae that is changed to lambda, then the program draw the link
   * and finally the link is added to states object and the link is clean */
  'handleLink': e => {
    if (!link.starting)
      return link.starting = e.target
      
    link.ending = e.target
    
    const {position} = statesVisualData()
    const init_state = link.starting.getAttribute('key')
    const final_state = link.ending.getAttribute('key') 

    let {transitions} = states[init_state]
    let name = undefined

    while(!name) {
      name = prompt('Nombre de la transición (solo 1 caracter):')
      
      if (name.length > 1)
        name = undefined
      if (name.trim() === '')
        name = 'λ'
    }

    if (!transitions[name])
      transitions[name] = new Set()
    if (!transitions[name].has(final_state))
      transitions[name].add(final_state)
    else
      return alert('Esta transición ya existe')

    ;(() => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      const text = document.createElement('span')
      const svg_key = `${link.starting.getAttribute('key')}[link]${link.ending.getAttribute('key')}`
      const reverse_key = `${link.ending.getAttribute('key')}[link]${link.starting.getAttribute('key')}`

      if ([...box_drag.children].find(child => child.getAttribute('key') === svg_key)) {
        document.querySelector(`span.pointer[key='ptr_${svg_key}']`).innerHTML = `${getTransitions().map(tr => tr)}`
        return false
      }

      svg.classList.add('link')
      svg.setAttribute('key', svg_key)

      text.className = 'pointer'
      text.innerHTML = `${getTransitions().map(tr => tr)}`
      text.setAttribute('key', `ptr_${svg_key}`)

      svg.appendChild(path)
      box_drag.appendChild(svg)
      box_drag.appendChild(text)

      if (init_state === final_state)
        return drawCyclePath(svg, path, text)
      if (position.stx === position.edx)
        return drawLinearPath('vertical', svg, path, text, reverse_key)
      if (position.sty === position.edy)
        return drawLinearPath('horizontal', svg, path, text, reverse_key)
      
      drawDiagonalPath(svg, path, text)
    })()

    link = {starting: undefined, ending: undefined}
  },
  /* Function to remove an state first of the states' object
   * and then fron thw UI */
  'handleRemove': e => {
    delete states[e.target.getAttribute('key')]
    box_drag.removeChild(e.target)
  },
  /* Visual to do a visual change when state is moving */
  'handleDragstart': e => e.target.style.opacity = '0.4',
  /* On this first check if the move is inside the drag area
   * and if its true the visual effect is removed and the
   * state is moved to the position */
  'handleDragend': e => {
    const on_position = {
      'x': draggable.min_x < e.x - 30 && e.x + 30 < draggable.max_x,
      'y': draggable.min_y < e.y - 30 && e.y + 30 < draggable.max_y  
    }

    e.target.style.opacity = '1'

    if (on_position.x && on_position.y) {
      e.target.style.left = `${e.x - 30}px`
      e.target.style.top = `${e.y - 30}px`
    }
  },
  /* Function to hide the default context menu then set
   * the state selected is changed, change the text 
   * inside the options of context menu and make
   * visible on the state */
  'handleContextmenu': e => {
    e.preventDefault()

    ctx_selected_state = e.target

    btn_set_initial.innerText = states[e.target.getAttribute('key')].isInitial
    ? 'Quitar inicial'
    : 'Agregar inicial'

    btn_set_final.innerText = states[e.target.getAttribute('key')].isFinal
    ? 'Quitar final'
    : 'Agregar final'
    
    box_contextmenu.style.top = `${e.y}px`
    box_contextmenu.style.left = `${e.x}px`
    box_contextmenu.className = 'visible'
  }
}

/* This function can add an state to drag area, first create an button DOM element
 * then evaluate if the position to add the button in on area. The name of the
 * state is requested to user, if the name is empty there are a preconfigured name,
 * the button is linked with its fucntions, then its position is asigned and
 * finally if all its alright the node is added to drag area and into states */
const handleAdd = e => {
  const node = document.createElement('button')
  const name = prompt('Nombre del estado:')
  const on_position = {
    'x': draggable.min_x < e.x - 30 && e.x + 30 < draggable.max_x,
    'y': draggable.min_y < e.y - 30 && e.y + 30 < draggable.max_y
  }

  let positioned = false

  node.className = 'state'
  node.draggable = true
  node.tabIndex = '-1'

  node.setAttribute('key', name || `Q${state_num++}`)
  node.innerText = node.getAttribute('key')
  node.addEventListener('dragstart', evt => action === 'Cursor' ? stateTools['handleDragstart'](evt) : false)
  node.addEventListener('dragend', evt => action === 'Cursor' ? stateTools['handleDragend'](evt) : false)
  node.addEventListener('contextmenu', evt => action === 'Cursor' ? stateTools['handleContextmenu'](evt) : false)
  node.addEventListener('click', evt => stateTools[`handle${action}`](evt) ?? false)

  if (on_position.x && on_position.y) {
    node.style.left = `${e.x - 30}px`
    node.style.top = `${e.y - 30}px`
    positioned = true
  }

  if (states[node.getAttribute('key')] || !positioned)
    alert(!positioned ? 'El punto debe estar dentro del area' : 'El estado ya existe')
  else {
    box_drag.appendChild(node)
    states[`${node.getAttribute('key')}`] = {
      'transitions': {},
      'isInitial': false,
      'isFinal': false
    }
  }
}

/* This function change the status of an state, it receive the
 * status to change and if there is a selected state the change is
 * realized, removing or adding the class to state and in the object */
const handleSetStatus = status => {
  if (!ctx_selected_state)
    return false

  const id = ctx_selected_state.getAttribute('key')

  if (status === 'initial') {
    states[id].isInitial
    ? ctx_selected_state.classList.remove('initial')
    : ctx_selected_state.classList.add('initial')
    
    states[id].isInitial = !states[id].isInitial
  }
  
  if (status === 'final') {
    states[id].isFinal
    ? ctx_selected_state.classList.remove('final')
    : ctx_selected_state.classList.add('final')
    
    states[id].isFinal = !states[id].isFinal
  }

  ctx_selected_state = undefined
}

/* DOM elements */
const box_contextmenu = document.querySelector('div#contextmenu')
const box_drag = document.querySelector('div#drag')
const btn_set_initial = document.querySelector('button#set_initial')
const btn_set_final = document.querySelector('button#set_final')
const svg_vector_area = document.querySelector('svg#vector_area')

/* Get size and position of drag area*/
const draggable = {
  min_x: box_drag.offsetLeft,
  min_y: box_drag.offsetTop,
  max_y: box_drag.offsetTop + box_drag.offsetHeight,
  max_x: box_drag.offsetLeft + box_drag.offsetWidth
}

/* Glogal variables */
let ctx_selected_state = undefined
let state_num = 0
let action = 'Cursor'
let link = { 'starting': undefined, 'ending': undefined }

/* Here we create an anonymous array that contain the id
 * of toolbar actions, for each item we select the DOM
 * element and add to it an event on click that changes the
 * selected element and set action to same on indicated button
 */
;['cursor', 'add', 'link', 'remove'].forEach( id => {
  document.querySelector(`button#${id}`).addEventListener('click', e => {
    document.querySelector('.toolbar .selected').className = ''
    e.target.className = 'selected'
    action = `${id[0].toUpperCase()}${id.slice(1)}`
  })
})


box_drag.addEventListener('click', e => action === 'Add' ? handleAdd(e) : false)

btn_set_initial.addEventListener('click', () => handleSetStatus('initial'))
btn_set_final.addEventListener('click', () => handleSetStatus('final'))

/* Functions to check if an state's context menu is visible and
 * hide the default context menu or hide the personalized */
window.addEventListener('click', () => {
  if (box_contextmenu.className === 'visible')
    box_contextmenu.className = 'hidden'
})
window.addEventListener('contextmenu', e => {
  if (box_contextmenu.className === 'visible')
    e.preventDefault()
})