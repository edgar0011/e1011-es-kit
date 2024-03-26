#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
import chalkPipe from 'chalk-pipe'
import shelljs from 'shelljs'
import inquirer from 'inquirer'


const prompts = [
  {
    type: 'input',
    message: () => chalkPipe('green.bold')('Component folder path:'),
    name: 'folderPath',
    default: 'src/components/**/*.module.scss',
    transformer(text: string) {
      return chalkPipe('blue.bold')(text)
    },
  },
];

(async () => {
  const path = process.argv?.[2] ?? (await inquirer.prompt(prompts)).folderPath

  shelljs.exec(`npx typed-scss-modules ${path} -e default --nameFormat none`)
  shelljs.exec('npm run lint:fix')
})()
