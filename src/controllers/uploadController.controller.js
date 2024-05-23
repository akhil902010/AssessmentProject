import { Worker } from "worker_threads";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const worker = new Worker(path.join(__dirname, 'dataUploadWorker.js'), {
    workerData: {
      filePath: req.file.path,
    },
  });

  worker.on('message', (message) => {
    if (message.status === 'success') {
      res.status(200).send('File processed successfully');
    } else {
      res.status(500).send('Error processing file');
    }
  });

  worker.on('error', (error) => {
    res.status(500).send(`Worker error: ${error.message}`);
  });

  worker.on('exit', (code) => {
    if (code !== 0) {
      res.status(500).send(`Worker stopped with exit code ${code}`);
    }
  });
}

export default { uploadFile };
