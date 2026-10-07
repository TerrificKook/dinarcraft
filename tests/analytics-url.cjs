"use strict";
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname, '../assets/consent-metrika.js'), 'utf8');
const start = source.includes('  function validTrackingValue') ? source.indexOf('  function validTrackingValue') : source.indexOf('  function safeUrl()');
const functions = source.slice(start, source.indexOf('  function safeReferrer()'));
function checkUrl(suffix) {
  const location = new URL('https://dinarcraft.ru/catalog/ezhednevniki-kozha-optom/' + suffix);
  const safePath = location.pathname;
  return vm.runInNewContext(functions + '\nsafeUrl()', { location, safePath, URL, URLSearchParams });
}
const cases = [
  ['ordinary URL', '', true],
  ['new campaign', '?utm_source=yandex&utm_medium=cpc&utm_campaign=dc_diaries_restart_2026-10-07&utm_content=1922012450670516086', true],
  ['numeric campaign ID', '?utm_campaign=714647512', true],
  ['numeric ad ID remains string', '?utm_content=1922012450670516086', true],
  ['yclid string', '?yclid=123456789012345678901234567890', true],
  ['match type autotargeting', '?match_type=rm', true],
  ['match type synonym', '?match_type=syn', true],
  ['empty macro match type', '?match_type=', true],
  ['legacy keyword operators', '?utm_term=%22%D0%B5%D0%B6%D0%B5%D0%B4%D0%BD%D0%B5%D0%B2%D0%BD%D0%B8%D0%BA%D0%B8%20%2B%D1%81%20%21%D0%BB%D0%BE%D0%B3%D0%BE%D1%82%D0%B8%D0%BF%D0%BE%D0%BC%22', true],
  ['keyword brackets', '?utm_term=%5B%D0%BA%D0%BE%D0%B6%D0%B0%20%D0%BE%D0%BF%D1%82%D0%BE%D0%BC%5D', true],
  ['Cyrillic campaign', '?utm_campaign=%D0%B5%D0%B6%D0%B5%D0%B4%D0%BD%D0%B5%D0%B2%D0%BD%D0%B8%D0%BA%D0%B8', true],
  ['native debug', '?_ym_debug=2', true],
  ['legacy debug', '?ym_debug=1', true],
  ['safe anchor', '#contacts', true],
  ['email', '?email=private%40example.test', false],
  ['phone in free keyword', '?utm_term=%2B79958815095', false],
  ['email in campaign', '?utm_campaign=private%40example.test', false],
  ['phone in campaign label', '?utm_campaign=client%2B79958815095', false],
  ['unknown parameter', '?secret=value', false],
  ['sensitive hash', '#email=private@example.test', false],
  ['duplicate parameter', '?utm_campaign=one&utm_campaign=two', false],
  ['unknown match type', '?match_type=private@example.test', false],
  ['unknown debug value', '?_ym_debug=private', false],
  ['unexpanded macro', '?utm_content=%7Bad_id%7D', false]
];
let failed = 0;
for (const [name, url, allowed] of cases) {
  try { assert.equal(Boolean(checkUrl(url)), allowed); console.log('PASS ' + name); }
  catch { failed++; console.log('FAIL ' + name); }
}
const numeric = checkUrl('?utm_content=1922012450670516086&yclid=123456789012345678901234567890');
if (numeric) {
  assert.equal(new URL(numeric).searchParams.get('utm_content'), '1922012450670516086');
  assert.equal(new URL(numeric).searchParams.get('yclid'), '123456789012345678901234567890');
}
console.log(`RESULT ${cases.length - failed}/${cases.length}; pure URL tests, no network`);
if (failed) process.exitCode = 1;
