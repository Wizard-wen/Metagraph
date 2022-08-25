/**
 * @author wizard
 * @date 2022/05/17 23:10
 * 上传、部署资源
 */

const { execSync } = require('child_process');
const { resolve } = require('path');

function executeShellCommand(command) {
  return execSync(command, { encoding: 'utf-8' });
}

async function uploadDistToServer() {
  const filePath = resolve(__dirname, './dist');
  const command = `scp -r  ${filePath}  root@101.42.248.59:/home`;
  executeShellCommand(command);
}

uploadDistToServer()
  .then();
