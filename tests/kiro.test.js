#!/usr/bin/env node
// Kiro adapter: steering rule plus the six skills in .kiro/skills/.

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.join(__dirname, '..');
const NAMES = ['ponytail', 'ponytail-review', 'ponytail-audit', 'ponytail-debt', 'ponytail-gain', 'ponytail-help'];

test('steering rule is always included', () => {
  const rule = fs.readFileSync(path.join(root, '.kiro', 'steering', 'ponytail.md'), 'utf8');
  assert.match(rule, /^---\n[\s\S]*?inclusion: always[\s\S]*?\n---\n/);
});

for (const name of NAMES) {
  test(`${name}: Kiro skill has name and description and matches skills/`, () => {
    const kiro = fs.readFileSync(path.join(root, '.kiro', 'skills', name, 'SKILL.md'), 'utf8');
    assert.match(kiro, new RegExp(`^---\\nname: ${name}\\n`));
    assert.match(kiro, /\ndescription: /);
    assert.equal(kiro, fs.readFileSync(path.join(root, 'skills', name, 'SKILL.md'), 'utf8'));
  });
}

test('check-rule-copies passes with the Kiro skills', () => {
  execFileSync(process.execPath, [path.join(root, 'scripts', 'check-rule-copies.js')], { stdio: 'pipe' });
});
