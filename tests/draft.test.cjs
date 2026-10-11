const {test}=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const {stripTypeScriptTypes}=require("node:module");
function setup(owner, files=new Map()) {
  const api={
    writeFileSync:(path,value)=>files.set(path,value),
    renameSync:(from,to)=>{files.set(to,files.get(from));files.delete(from);},
    readFileSync:path=>{if(!files.has(path))throw Error("missing");return files.get(path);},
    accessSync:path=>{if(!files.has(path))throw Error("missing");},
    unlinkSync:path=>files.delete(path)
  };
  const context={wx:{getStorageSync:()=>owner,getFileSystemManager:()=>api,env:{USER_DATA_PATH:"/drafts"}},setTimeout,clearTimeout};
  vm.createContext(context);
  vm.runInContext(stripTypeScriptTypes(fs.readFileSync("miniprogram/utils/draft.ts","utf8").replace("export function","function"))+"\nthis.attach=attachDraft;",context);
  const page={data:{jobContent:"saved",draftState:""},setData(data){Object.assign(this.data,data);}};
  return {draft:context.attach(page,"record"),page,files};
}
test("account IDs cannot collide in draft filenames",()=>{
  const a=setup("a/b");a.draft.save();
  const b=setup("a_b",a.files);
  assert.equal(b.page.data.jobContent,"saved");
  b.page.data.jobContent="other";b.draft.save();
  assert.equal(a.files.size,2);
  const restored=setup("a/b",a.files);
  assert.equal(restored.page.data.jobContent,"saved");
});
test("failed parse preserves the original file",()=>{
  const files=new Map([["/drafts/record-operator.json","{broken"]]);
  const {page,draft}=setup("operator",files);
  assert.match(page.data.draftState,/读取失败/);
  draft.save();
  assert.equal(files.get("/drafts/record-operator.json"),"{broken");
});
test("successful submission removes only the current account draft",()=>{
  const {draft,files}=setup("operator");draft.save();
  files.set("/drafts/record-other.json","other");
  draft.clear();draft.save();
  assert.equal(files.has("/drafts/record-operator.json"),false);
  assert.equal(files.get("/drafts/record-other.json"),"other");
});
