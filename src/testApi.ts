import { render, getRenderInfo, RenderRequest, RenderInfoResponse } from './veedApi/render';

const VEED_KEY = process.env['VEED_KEY'];

async function start() {
  if (!VEED_KEY) {
    throw new Error('VEED_KEY environment variable not set, please set it to your veed key');
  }

  // request the video to be trimmed and text appended
  const renderRequest: RenderRequest = {
    elements: [
      {
        type: 'video',
        params: {
          source: {
            url: 'https://storage.googleapis.com/veed-docs/sample-video.mp4'
          },
          trim: {
            from: 2.0,
            to: 5.0
          }
        }
      },
      {
        type: 'text',
        params: {
          value: 'My First Render!',
          position: {
            x: 'center',
            y: 'top'
          }
        }
      }
    ]
  };

  const result = await render(VEED_KEY, renderRequest);
  const renderId = result.id;

  // poll the api every 5 seconds until the result is complete
  // you should use the webhooks for this but this will do for testing
  let renderInProgress = true;

  let renderInfo: RenderInfoResponse = null;

  while (renderInProgress) {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    renderInfo = await getRenderInfo(VEED_KEY, renderId);
    renderInProgress = !renderInfo?.latest_event?.payload?.progress || renderInfo.latest_event.payload.progress !== 100;
    console.log(renderInfo);
  }
  if (renderInfo?.latest_event?.type === 'RENDER/SUCCESS') {
    console.log(`Process complete! Access the video at ${renderInfo.latest_event.payload.url}`);
  } else {
    console.error(`Process failed! Error: ${renderInfo?.latest_event?.payload?.message}`);
  }
}

start().catch((e) => console.error(e));
