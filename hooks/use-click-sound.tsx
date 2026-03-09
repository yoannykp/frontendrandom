import useSound from "use-sound"

const useClickSound = (soundPath: string, volume: number = 0.5) => {
  const [playClickSound] = useSound(soundPath, { volume })

  return playClickSound
}

export default useClickSound
