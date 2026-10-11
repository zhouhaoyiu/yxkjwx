const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { stripTypeScriptTypes } = require('node:module');
function load(name) {
  let page; const requests = [];
  const source = fs.readFileSync(`miniprogram/pages/${name}/${name}.ts`, 'utf8');
  vm.runInNewContext(stripTypeScriptTypes(source.slice(source.indexOf('const width'))), {
    wx: { getSystemInfoSync: () => ({ windowWidth: 390 }), getStorageSync: () => 'operator' },
    request: value => requests.push(value), console,
    Page: value => { page = value; },
  });
  page.setData = values => Object.assign(page.data, values); page.handleToast = () => {};
  return { page, requests };
}
function record() {
  const setup = load('recordPage');
  Object.assign(setup.page.data, {
    dateText: '2026-10-12', jobContent: '测试任务', jobPosition: '测试地点',
    unionWorkUuid: 'approved-work', unionMissionCId: 0, jobUuid: 'request-123456789',
    xcfzr: '测试甲', jcjly: '测试乙', xcfzrDrawOk: true, jcjlyDrawOk: true,
    xcfzrBase64: 'first', jcjlyBase64: 'second', gasDetectionBase64Arr: ['gas'],
    signBoardBase64Arr: ['board'], exhaustAirBase64Arr: ['vent'],
  });
  return setup;
}
test('approval without signature never sends', () => {
  const { page, requests } = load('verify'); page.data.spfzr = '审批人';
  page.accept(); page.refuse(); assert.equal(requests.length, 0);
});
test('approval locks duplicate clicks and retains failure', () => {
  const { page, requests } = load('verify');
  Object.assign(page.data, { spfzr: '审批人', spfzrBase64: 'signature', spfzrDrawOk: true });
  page.accept(); page.accept(); assert.equal(requests.length, 1);
  requests[0].success({ statusCode: 500, data: 1 }); requests[0].complete();
  assert.equal(page.data.spfzrBase64, 'signature'); assert.equal(page.data.showDialog, false);
});
test('failed record response preserves form and signatures', () => {
  const { page, requests } = record(); page.submitJob();
  requests[0].success({ statusCode: 500, data: 1 });
  assert.equal(page.data.jobContent, '测试任务'); assert.equal(page.data.xcfzrBase64, 'first');
  assert.equal(page.data.jobUuid, 'request-123456789');
});
test('record request matches attachment DTO and keeps request ID', () => {
  const { page, requests } = record(); page.submitJob(); page.submitJob();
  assert.equal(requests.length, 1);
  assert.equal(requests[0].data.exhaustAirBase64Arr, 'vent');
  assert.equal(requests[0].data.exhaustBase64Arr, undefined);
  assert.equal(requests[0].data.jobUuid, 'request-123456789');
});
test('confirmed save clears only then starts a new request ID', () => {
  const { page, requests } = record(); page.submitJob();
  requests[0].success({ statusCode: 200, data: 1 });
  assert.equal(page.data.jobContent, ''); assert.equal(page.data.xcfzrBase64, null);
  assert.notEqual(page.data.jobUuid, 'request-123456789');
  assert.equal(page.data.safetyDisclosureValue, false);
});
