// @refresh reload
import {createHandler, StartServer} from '@solidjs/start/server';

export default createHandler(() => (
  <StartServer
    document={({assets, children, scripts}) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
          <link
            rel="stylesheet"
            fetchpriority="low"
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
          />
          {assets}
        </head>
        <body data-cui-theme={'dark'}>
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));
