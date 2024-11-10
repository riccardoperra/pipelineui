import {json} from '@solidjs/router';

export default async function GET() {
  return json({response: 'ok'}, {status: 200});
}
