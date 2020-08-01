const { execSync } = require('child_process');
const { writeFileSync } = require('fs');
const {
  projectInfoPath,
  readmePath,
  julietteDirName,
  julietteNgDirName,
  julietteReactDirName,
  getLibraryProjectPackageJsonPath,
  getLibraryDistPath,
  getLibraryDistPackageJsonPath,
} = require('./paths');

const copyReadmeToLibraryDistDir = libraryName => {
  console.log(`Copying README.md to ${libraryName}...`);
  execSync(`cp -r ${readmePath} ${getLibraryDistPath(libraryName)}`);
};

const copyPackageJsonToLibraryDistPath = libraryName => {
  console.log(`Copying package.json to ${libraryName} dist...`);
  execSync(`cp -r ${getLibraryProjectPackageJsonPath(libraryName)} ${getLibraryDistPath(libraryName)}`);
};

const copyProjectInfoToPackageJson = libraryName => {
  const projectInfo = require(projectInfoPath);
  const libraryDistPackageJsonPath = getLibraryDistPackageJsonPath(libraryName);
  const libraryDistPackageJson = require(libraryDistPackageJsonPath);

  console.log(`Copying project.info to ${libraryName} package.json...`);
  writeFileSync(libraryDistPackageJsonPath, JSON.stringify({ ...libraryDistPackageJson, ...projectInfo }, null, 2));
};

const publishLibrary = libraryName => {
  console.log(`Publishing ${libraryName}...`);
  execSync(`cd ${getLibraryDistPath(libraryName)} && npm publish`, { stdio: 'inherit' });
};

const isCommitted = execSync('git diff').toString().length === 0;
if (!isCommitted) throw new Error('Please commit or stash changes before publish!');

copyReadmeToLibraryDistDir(julietteDirName);
copyReadmeToLibraryDistDir(julietteNgDirName);
copyReadmeToLibraryDistDir(julietteReactDirName);

copyPackageJsonToLibraryDistPath(julietteDirName);
copyPackageJsonToLibraryDistPath(julietteReactDirName);

copyProjectInfoToPackageJson(julietteDirName);
copyProjectInfoToPackageJson(julietteNgDirName);
copyProjectInfoToPackageJson(julietteReactDirName);

publishLibrary(julietteDirName);
publishLibrary(julietteNgDirName);
publishLibrary(julietteReactDirName);
