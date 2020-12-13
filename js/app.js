document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    const width = 10
    let timerId
    let nextRandom = 0
    let score = 0
    const colors = [
        'orange',
        'red',
        'purple',
        'green',
        'blue'
    ]

    // The Tetrominios
     const lTetromino = [
         [1, 2, width + 1, width * 2 + 1],
         [width, width + 1, width + 2, width * 2 + 2],
         [1, width + 1, width * 2, width * 2 + 1],
         [width, width * 2, width * 2 + 1, width * 2 + 2]
     ]

     const zTetromino = [
         [width + 1, width + 2, width * 2, width * 2 + 1],
         [0, width, width + 1, width * 2 + 1],
         [width + 1, width + 2, width * 2, width * 2 + 1],
         [0, width, width + 1, width * 2 + 1]
     ]

     const tTetromino = [
         [1, width, width + 1, width + 2],
         [1 , width + 1, width + 2, width * 2 + 1],
         [width, width + 1, width + 2, width * 2 + 1],
         [1, width, width + 1, width * 2 + 1]
     ]

     const oTetromino = [
         [0, 1, width, width + 1],
         [0, 1, width, width + 1],
         [0, 1, width, width + 1],
         [0, 1, width, width + 1]
     ]

     const iTetromino = [
         [1, width + 1, width * 2 + 1, width * 3 + 1],
         [width, width + 1, width + 2, width + 3],
         [1, width + 1, width * 2 + 1, width * 3 + 1],
         [width, width + 1, width + 2, width + 3]
     ]

     const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

     let currentPosition = 4
     let currentRotation = 0

     // Randomly select a tetromino and it's first rotation
     let random = Math.floor(Math.random() * theTetrominoes.length) 
     let current = theTetrominoes[random][currentRotation]

     // Draw the tetromino
     function draw() {
         current.forEach(index => {
             squares[currentPosition + index].classList.add('tetromino')
             squares[currentPosition + index].style.backgroundColor = colors[random]
         })
     }

     // Undraw the tetromino
     function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition + index].style.backgroundColor = ''
        })
    }

    // Assign functions to keCodes
    function control(e) {
        if (e.keyCode === 37) {
            moveLeft()
        } else if (e.keyCode === 38) {
            rotate()
        } else if (e.keyCode === 39) {
            moveRight()
        } else if (e.keyCode === 40) {
            moveDown()
        }
    } 
    document.addEventListener('keyup', control)

    // Move down function 
    function moveDown() {
        undraw()
        currentPosition += width
        draw()
        freeze()
    }

    //freeze function 
    function freeze() {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            // Start a new tetromino falling 
            random = nextRandom
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            current = theTetrominoes[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }

    // Move the tetromino left, unless it's at the edge or there is a blockage
    function moveLeft() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

        if (!isAtLeftEdge) currentPosition--

        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition++
        }

        draw()
    }

    // Move the tetromino right, unless it's at the edge or there is a blockage
    function moveRight() {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)
        if (!isAtRightEdge) currentPosition++
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition--
        }
        draw()
    }

    //rotate the tetromino
    function rotate() {
        undraw()
        currentRotation++
        if (currentRotation === current.length) { // if the current rotation gets to 4, make it go back to 0
            currentRotation = 0
        }
        current = theTetrominoes[random][currentRotation]
        draw()
    }

    // show up next tetromino in the mini-grid display
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    let displayIndex = 0

    // The tetrominos without rotation
    const upNextTetrominoes = [
        [1, 2, displayWidth + 1, displayWidth * 2 + 1], // lTetromino
        [displayWidth + 1, displayWidth + 2, displayWidth * 2, displayWidth * 2 + 1], // zTetromino
        [1, displayWidth, displayWidth + 1, displayWidth + 2], // tTetromino
        [0, 1, displayWidth, displayWidth + 1], // oTetromino
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] // iTetromino
    ]

    // Display the shape in the mini-grid display 
    function displayShape() {
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundColor = ''
        })
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })
    }

    // Add funtionality to the button
    startBtn.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId)
            timerId = null
        } else {
            draw()
            // Make the tetromino move down every second
            timerId = setInterval(moveDown, 1000)
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            displayShape()
        }
    })

    // Add score
    function addScore() {
        for (let i = 0; i < 199; i += width) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]

            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 10
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                    squares[index].style.backgroundColor = ''
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

    // Game over
    function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'end'
            clearInterval(timerId)
        }
    }
}) 