import Replicate from 'replicate'
import type { NextApiRequest, NextApiResponse } from 'next'

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const output = await replicate.run(
        "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
        {
          input: {
            width: 768,
            height: 768,
            prompt: 'an elegant picture titled ' + req.body.prompt + '',
            refine: "expert_ensemble_refiner",
            scheduler: "PNDM",
            lora_scale: 0.6,
            num_outputs: 1,
            guidance_scale: 7.5,
            apply_watermark: false,
            high_noise_frac: 0.8,
            disable_safety_checker: true,
            negative_prompt: "portrait, anime, text, logo, title, letters, characters, frame",
            prompt_strength: 0.8,
            num_inference_steps: 25
          }
        }
    )
    res.status(200).json(output)
}
