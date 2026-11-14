import{cp,rm,mkdir,access}from'node:fs/promises';
const source=new URL('../dist/',import.meta.url),target=new URL('../../../wow-ah/',import.meta.url);
// Only this generated release directory is replaced. Existing Pages roots stay untouched.
await access(new URL('../../../index.html',import.meta.url));
await access(new URL('index.html',source));
await rm(target,{recursive:true,force:true});await mkdir(target,{recursive:true});await cp(source,target,{recursive:true});
console.log('Published built files to /wow-ah/ in the hosting repository.');
