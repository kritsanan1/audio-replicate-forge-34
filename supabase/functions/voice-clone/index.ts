import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get the user from the request
    const authHeader = req.headers.get('Authorization')!
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const body = await req.json()
    const { action, audioData, fileName, predictionId, text, voice_id, speed, volume, pitch, emotion } = body

    const REPLICATE_API_TOKEN = Deno.env.get('REPLICATE_API_TOKEN')
    if (!REPLICATE_API_TOKEN) {
      throw new Error('REPLICATE_API_TOKEN is not configured')
    }

    // Text-to-speech synthesis
    if (action === 'synthesize' && text && voice_id) {
      // Validate text length (max 5000 characters)
      if (text.length > 5000) {
        return new Response(JSON.stringify({ error: 'Text exceeds maximum length of 5000 characters' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      // Start Replicate prediction for text-to-speech
      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: "minimax/speech-01", // Using a text-to-speech model
          input: {
            text: text,
            voice_id: voice_id,
            speed: speed || 1.0,
            volume: volume || 1.0,
            pitch: pitch || 0,
            emotion: emotion || "neutral",
            sample_rate: 44100,
            bitrate: 128000,
            channel: "mono",
            english_normalization: true
          }
        })
      })

      const prediction = await response.json()

      return new Response(JSON.stringify(prediction), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Check prediction status
    if (action === 'status' && predictionId) {
      const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
        headers: {
          'Authorization': `Token ${REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      })

      const prediction = await response.json()
      
      // If completed successfully, save to database
      if (prediction.status === 'succeeded' && prediction.output?.voice_id) {
        const { error: insertError } = await supabase
          .from('cloned_voices')
          .insert({
            user_id: user.id,
            voice_id: prediction.output.voice_id,
            name: fileName || 'Cloned Voice',
            original_filename: fileName,
            preview_url: prediction.output.preview,
            model_used: prediction.input?.model || 'speech-02-hd'
          })

        if (insertError) {
          console.error('Error saving cloned voice:', insertError)
        }
      }

      return new Response(JSON.stringify(prediction), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Start voice cloning
    if (action === 'clone' && audioData) {
      // Convert base64 to blob and upload to temporary storage
      const audioBuffer = Uint8Array.from(atob(audioData), c => c.charCodeAt(0))
      const timestamp = Date.now()
      const tempPath = `temp-audio/${user.id}/${timestamp}-${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('voice-memos')
        .upload(tempPath, audioBuffer, {
          contentType: 'audio/wav',
          upsert: true
        })

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`)
      }

      // Get public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('voice-memos')
        .getPublicUrl(tempPath)

      // Start Replicate prediction
      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: "hidden", // Using the minimax/voice-cloning model
          input: {
            model: "speech-02-hd",
            voice_file: urlData.publicUrl,
            accuracy: 0.7,
            need_noise_reduction: true,
            need_volume_normalization: true
          }
        })
      })

      const prediction = await response.json()

      // Clean up temporary file after a delay
      setTimeout(async () => {
        await supabase.storage.from('voice-memos').remove([tempPath])
      }, 60000) // Remove after 1 minute

      return new Response(JSON.stringify(prediction), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Voice clone function error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})