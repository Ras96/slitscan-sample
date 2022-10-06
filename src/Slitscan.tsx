import { useCallback, useEffect, useRef, useState } from 'react'
import sampleVideo from './assets/sample-from-pexels.mp4'

const useAnimationFrame = (callback: () => void) => {
  const reqIdRef = useRef<number>(0)
  const loop = useCallback(() => {
    // NOTE:
    // requestAnimationFrame requests only one frame at a time,
    // so we need to call it recursively.
    reqIdRef.current = requestAnimationFrame(loop)
    callback()
  }, [callback])

  useEffect(() => {
    reqIdRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(reqIdRef.current)
  }, [loop])
}

function Slitscan() {
  const [context, setContext] = useState<CanvasRenderingContext2D>()
  const [bufferContext, setBufferContext] = useState<CanvasRenderingContext2D>()
  const [video, setVideo] = useState<HTMLVideoElement>()
  const [frames, setFrames] = useState<ImageData[]>([])
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [maxSlices] = useState(200)

  useEffect(() => {
    const canvas = document.getElementById('canvas-main') as HTMLCanvasElement
    const canvasContext = canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D
    setContext(canvasContext)
  }, [])

  useEffect(() => {
    const canvas = document.getElementById('canvas-buffer') as HTMLCanvasElement
    const canvasContext = canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D
    setBufferContext(canvasContext)
  }, [])

  useEffect(() => {
    const videoElement = document.getElementById('video') as HTMLVideoElement
    videoElement.src = sampleVideo
    videoElement.onloadeddata = () => {
      setVideo(videoElement)
      setWidth(videoElement.videoWidth)
      setHeight(videoElement.videoHeight)
    }
  }, [])

  // This is the main function that does the slitscan effect.
  useAnimationFrame(
    useCallback(() => {
      if (!video || !context || !bufferContext) {
        return
      }

      // draw the current video frame to the buffer canvas
      bufferContext.drawImage(video, 0, 0, width, height, 0, 0, width, height)

      // add the current frame to the `frames` and remove the old one
      const currentFrames = frames
      currentFrames.push(bufferContext.getImageData(0, 0, width, height))
      while (currentFrames.length > maxSlices) {
        currentFrames.shift()
      }
      setFrames(currentFrames)

      // draw the parts of the frames to the main canvas
      for (let i = 0; i < maxSlices; i++) {
        context.putImageData(
          frames[i],
          // x, y 
          0,
          0,
          // x, y, width, height of the rectangle to be drawn
          (width * i) / maxSlices,
          0,
          Math.ceil(width / maxSlices),
          height
        )
      }
    }, [context, bufferContext, video, frames, width, height, maxSlices])
  )

  return (
    <div>
      <div>
        <h1>Original</h1>
        <video id="video" width={width} height={height} autoPlay loop muted></video>
      </div>
      <div>
        <h1>Slitscan-ed</h1>
        <canvas id="canvas-main" width={width} height={height}></canvas>
      </div>

      {/* hidden elements */}
      <div>
        <canvas id="canvas-buffer" width={width} height={height} hidden></canvas>
      </div>
    </div>
  )
}

export default Slitscan
