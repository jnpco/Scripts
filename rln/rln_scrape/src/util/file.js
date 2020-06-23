import fs from 'fs-extra';
import path from 'path';

export function getDirectories(source) {
  return readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
}

export function getAllFiles(dir, recursive=false, fileArr=[]) {
  const entity = fs.readdirSync(dir);

  entity.forEach(e => {
    const currentPath = path.resolve(dir, e);

    if(recursive && fs.statSync(currentPath).isDirectory()) {
      fileArr = getAllFiles(currentPath, true, fileArr);
    } else if(fs.statSync(currentPath).isFile()) {
      fileArr.push(path.resolve(__dirname, currentPath))
    }
  });

  return fileArr;
}

export function getAllDir(dir, recursive=false, subDirArr=[]) {
  const entity = fs.readdirSync(dir);

  entity.forEach(e => {
    const currentPath = path.resolve(dir, e);

    if(fs.statSync(currentPath).isDirectory()) {
      subDirArr.push(path.resolve(__dirname, currentPath));

      if(recursive) {
        getAllDir(currentPath, true, subDirArr);
      }
    }
  });

  return subDirArr;
}

export function aggregateJSONFiles(dir, recursive, regex = /.*/) {
  const files = getAllFiles(dir, recursive).filter(f => regex.test(f));
  return [ ...files.map(f => ({ data: JSON.parse(fs.readFileSync(path.resolve(dir, f))), filepath: f })) ];
}