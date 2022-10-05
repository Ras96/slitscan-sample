import { useEffect, useState } from 'react'
// images from http://placeimg.com/
import animal0 from './assets/animal0.png'
import animal1 from './assets/animal1.png'
import animal2 from './assets/animal2.png'
import animal3 from './assets/animal3.png'
import animal4 from './assets/animal4.png'
import animal5 from './assets/animal5.png'
import animal6 from './assets/animal6.png'
import animal7 from './assets/animal7.png'
import animal8 from './assets/animal8.png'
import animal9 from './assets/animal9.png'

const width = 1000
const height = 500
const animals = [animal0, animal1, animal2, animal3, animal4, animal5, animal6, animal7, animal8, animal9]

function Slitscan() {
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)

  useEffect(() => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement
    const canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D
    setContext(canvasContext)
  }, [])

  useEffect(() => {
    if (context) {
      for (let i = 0; i < animals.length; i++) {
        const img = new Image()
        img.src = animals[i]
        img.onload = () => {
          context.drawImage(
            img,
            // source x, y, width, height
            100 * i,
            0,
            100,
            500,
            // destination x, y, width, height
            100 * i,
            0,
            100,
            500
          )
        }
      }
    }
  }, [context])

  return (
    <div>
      <canvas id="canvas" width={width} height={height}></canvas>
    </div>
  )
}

export default Slitscan
