const Generation = require('../stability-ai/generation/generation_pb');
const {
  GenerationServiceClient
} = require('../stability-ai/generation/generation_pb_service');
const { grpc: GRPCWeb } = require('@improbable-eng/grpc-web');
const {
  NodeHttpTransport
} = require('@improbable-eng/grpc-web-node-http-transport');
const {
  buildGenerationRequest,
  executeGenerationRequest,
  onGenerationComplete
} = require('../utils/stabilityHelpers');

// Initialize client
GRPCWeb.setDefaultTransport(NodeHttpTransport());
const metadata = new GRPCWeb.Metadata();
metadata.set('Authorization', 'Bearer ' + process.env.STABILITY_API_KEY);

const client = new GenerationServiceClient('https://grpc.stability.ai', {});

// Make the request
const generateArtifact = async (prompt) => {
  const request = buildGenerationRequest('stable-diffusion-512-v2-1', {
    type: 'text-to-image',
    prompts: [
      {
        text: prompt
      }
    ],
    width: 512,
    height: 512,
    samples: 1,
    cfgScale: 13,
    steps: 25,
    sampler: Generation.DiffusionSampler.SAMPLER_K_DPMPP_2M
  });

  const response = await executeGenerationRequest(client, request, metadata);
  const base64Photos = onGenerationComplete(response);

  return base64Photos[0];
};

module.exports = generateArtifact;
