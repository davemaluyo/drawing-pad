const canvas = document.querySelector('#drawing-pad')
const toolbar = document.querySelector('.toolbar')
const backgroundPicker = document.querySelector('#background')
const colorPicker = document.querySelector('#color')
const strokeWidthPicker = document.querySelector('#stroke')
const eraserCheckbox = document.querySelector('#eraser')
const clearCanvasButton = document.querySelector('.toolbar__clear')
const ctx = canvas.getContext('2d')

// Make sure the canvas is smooth on retina displays
function setCanvasDimensions() {
    const dpr = window.devicePixelRatio || 1

    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr

    canvas.style.height = window.innerHeight + 'px'
    canvas.style.width = window.innerWidth + 'px'

    ctx.scale(dpr, dpr)
}

// State 
let isDraw = false
let isEraser = false
let mouse = {
    x: 0,
    y: 0
}
let currentColor = colorPicker.value
let currentStrokeWidth = strokeWidthPicker.value
let arcs = []

function draw(ts) {
    // Normalize the timestamp to seconds
    ts /= 1000

    // Set drawing mode and toolbar visibility based on if the mouse is down
    canvas.addEventListener('mousedown', () => {
        isDraw = true
        toolbar.classList.add('hide')
    })
    canvas.addEventListener('mouseup', () => {
        isDraw = false
        toolbar.classList.remove('hide')
    })

    // Watch for changes to toolbar and set updated current values
    colorPicker.addEventListener('change', e => {
        currentColor = e.target.value
    })

    strokeWidthPicker.addEventListener('change', e => {
        currentStrokeWidth = e.target.value
    })

    backgroundPicker.addEventListener('change', e => {
        canvas.style.background = e.target.value
    })

    eraserCheckbox.addEventListener('change', () => {
        if (eraserCheckbox.checked) {
            isEraser = true
        } else {
            isEraser = false
        }
    })

    // Set updated mouse coordinates
    canvas.addEventListener('mousemove', e => {
        mouse.x = e.layerX
        mouse.y = e.layerY
    })


    // If you are in drawing mode add to the canvas with the current state values
    if (isDraw) {
        // Add all arcs to the state
        arcs.push({ x: mouse.x, y: mouse.y, color: currentColor, strokeWidth: currentStrokeWidth })

        if (isEraser) {
            ctx.clearRect(mouse.x, mouse.y, currentStrokeWidth, currentStrokeWidth)
        } else {
            // Re-render each arc per frame
            arcs.map(item => {
                ctx.beginPath()
                // Note the last values of the arc 0 and 2 * Math.PI are required to
                // make the arc a perfect circle
                ctx.arc(item.x, item.y, item.strokeWidth, 0, 2 * Math.PI)
                ctx.fillStyle = item.color
                ctx.fill()
            })
        }
    }

    // Handle canvas clear
    clearCanvasButton.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        arcs = []
    })


    requestAnimationFrame(draw)
}

setCanvasDimensions()
canvas.style.background = backgroundPicker.value
draw()
window.addEventListener('resize', setCanvasDimensions)