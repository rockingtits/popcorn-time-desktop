// @flow
import express from 'express';
import path from 'path';
import os from 'os';
import fs from 'fs';
import srt2vtt from 'srt2vtt';
import rndm from 'rndm';


export const basePath = os.tmpdir();
export const port = process.env.SUBTITLES_PORT || 4000;

/**
 * Serve the file through http
 */
export function startServer(): express {
  const server = express();
  server.use(express.static(basePath));
  server.listen(port);

  console.info(`Listening at http://localhost:${port}, serving ${basePath}`);

  return server;
}

export function closeServer(server: express): express {
  return server.close();
}

export function convertFromBuffer(srtBuffer: Buffer): Promise<Object> {
  const randomString = rndm(16);
  const filename = `${randomString}.vtt`;
  const fullPath = path.join(basePath, filename);

  return new Promise((resolve: Function, reject: Function) => {
    srt2vtt(srtBuffer, (error: Error, vttBuffer: Buffer) => {
      if (error) reject(error);

      fs.writeFile(fullPath, vttBuffer, () => {
        resolve({
          filename,
          basePath,
          port,
          fullPath,
          buffer: vttBuffer
        });
      });
    });
  });
}
