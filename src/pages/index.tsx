import Image from 'next/image'
import { Courier_Prime, Inter } from 'next/font/google'
import { createRef, useState } from 'react'
import ColorThief from "colorthief";

const inter = Inter({ subsets: ['latin'] })
const courierPrime = Courier_Prime({
    subsets: ['latin'],
    weight: '400',
    preload: true,
})

export default function Home() {
    const [prediction, setPrediction] = useState<string[] | null>(null)
    const [palette, setPalette] = useState([]);
  
    const rgbToHex = (r: number, g: number, b: number): string => {
        return '#' + [r, g, b].map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    };

    async function generateImage(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const response = await fetch('/api/sdxl', {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt: ((e.target as HTMLFormElement).elements.namedItem('prompt') as HTMLInputElement)?.value || '',
            }),
        })
        let prediction = await response.json()
        setPrediction(prediction)
    }

    const imageRef = createRef<HTMLImageElement>();

    return (
        <main
            className={`flex min-h-screen flex-col items-center justify-between py-16 ${courierPrime.className}`}
            // style={{ backgroundColor: palette[0] }}
        >
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm flex flex-col gap-16">
                <form onSubmit={generateImage} className="flex flex-col items-center w-full">
                    <input
                        type="text"
                        name="prompt"
                        placeholder="Enter a prompt to display an image"
                        style={{ color: palette[palette.length - 1], backgroundColor: palette[0] }}
                        className="px-4 py-2 w-full rounded-md text-center focus:outline-none border-none text-4xl"
                    />
                </form>

                {prediction && (
                    <div className="flex flex-col items-center justify-center gap-10">
                        <Image
                            src={prediction[0]}
                            ref={imageRef}
                            alt="Output"
                            width={500}
                            height={500}
                            className="w-[80%]"
                            onLoad={() => {
                                const colorThief = new ColorThief();
                                const img = imageRef.current
                                const colors = colorThief.getPalette(img, 5);
                                const hexColors = colors.map((rgb: number[]) => rgbToHex(rgb[0], rgb[1], rgb[2]));
                                setPalette(hexColors);
                            }}
                        />
                        <div className="grid grid-cols-5 mt-4 w-[80%] gap-0 h-20">
                          {palette.slice(0,5).map((color, index) => (
                            <div
                              key={index}
                              className="w-full h-full aspect-square shrink-0 cursor-pointer"
                              style={{ backgroundColor: color }}
                              onClick={() => navigator.clipboard.writeText(color)}
                              title="Click to copy color"
                            ></div>
                          ))}
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}
