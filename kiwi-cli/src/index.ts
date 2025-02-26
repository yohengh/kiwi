#!/usr/bin/env node

import * as commander from 'commander';
import * as inquirer from 'inquirer';
import { initProject } from './init';
import { sync } from './sync';
import { exportMessages } from './export';
import { findUnUsed } from './unused';
import { mockLangs } from './mock';
import { extractAll } from './extract/extract';
import * as ora from 'ora';

/**
 * 进度条加载
 * @param text
 * @param callback
 */
function spining(text, callback) {
  const spinner = ora(`${text}中...`).start();
  if (callback) {
    callback();
  }
  spinner.succeed(`${text}成功`);
}

commander
  .version('0.1.0')
  .option('--init', '初始化项目', { isDefault: true })
  .option('--import [file] [lang]', '导入翻译文案')
  .option('--export [lang]', '导出未翻译的文案')
  .option('--sync', '同步各种语言的文案')
  .option('--mock', '使用 Google 翻译')
  .option('--unused', '导出未使用的文案')
  .option('--extract [dirPath]', '一键替换指定文件夹下的所有中文文案')
  .parse(process.argv);

if (commander.init) {
  (async () => {
    const result = await inquirer.prompt({
      type: 'confirm',
      name: 'confirm',
      default: true,
      message: '项目中是否已存在kiwi相关目录？'
    });

    if (!result.confirm) {
      spining('初始化项目', async () => {
        initProject();
      });
    } else {
      const value = await inquirer.prompt({
        type: 'input',
        name: 'dir',
        message: '请输入相关目录：'
      });
      spining('初始化项目', async () => {
        initProject(value.dir);
      });
    }
  })();
}

if (commander.import) {
  // importMessages();
}

if (commander.export) {
  spining('导出未翻译的文案', () => {
    if (commander.export === true) {
      exportMessages();
    } else {
      exportMessages(commander.export);
    }
  });
}

if (commander.sync) {
  spining('文案同步', () => {
    sync();
  });
}

if (commander.unused) {
  spining('导出未使用的文案', () => {
    findUnUsed();
  });
}

if (commander.mock) {
  const spinner = ora('使用 Google 翻译中...').start();
  sync(async () => {
    await mockLangs();
    spinner.succeed('使用 Google 翻译成功');
  });
}

if (commander.extract) {
  if (commander.extract === true) {
    extractAll();
  } else {
    extractAll(commander.extract);
  }
}
