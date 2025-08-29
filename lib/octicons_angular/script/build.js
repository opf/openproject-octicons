#!/usr/bin/env node

const octicons = require('../../build/data.json')
const {default: generate} = require('@babel/generator')
const t = require('@babel/types')
const fse = require('fs-extra')
const {join, resolve} = require('path')

const srcDir = resolve(__dirname, '../src/__generated__')
const iconsFile = join(srcDir, 'icons.ts')

const GENERATED_HEADER = '/* THIS FILE IS GENERATED. DO NOT EDIT IT. */'

function pascalCase(str) {
  return str.replace(/(^|-)([a-z])/g, (_, __, c) => c.toUpperCase())
}

function snakeCase(str) {
  return str.replace(/(-)([a-z])/g, (_, __, c) => c.toUpperCase())
}

const icons = Object.entries(octicons)
  .map(([key, octicon]) => {
    const name = `${pascalCase(key)}Icon`
    const componentName = `${name}Component`
    const svgDataExportName = `${snakeCase(key)}IconData`
    // Build an object with the following structure:
    //
    // type SVGData = {
    //   [key in string]: {
    //     width: number,
    //     path: React.JSXElement
    //   },
    // }
    //
    const svgData = t.objectExpression(
      Object.entries(octicon.heights).map(([height, icon]) => {
        return t.objectProperty(
          t.stringLiteral(height),
          t.objectExpression([
            t.objectProperty(t.stringLiteral('width'), t.numericLiteral(icon.width)),
            t.objectProperty(t.stringLiteral('paths'), t.arrayExpression(
              icon.ast.children.map(path => t.stringLiteral(path.attributes.d))
            ))
          ])
        )
      })
    )

    const code = `
export const ${svgDataExportName} = ${generate(svgData).code};

@Component({
  selector: 'svg[${key}-icon]',
  standalone: true,
  imports: [],
  template: \`
    @if (title) {
      <title>{{title}}</title>
    }

    @for (path of paths; track path) {
      <svg:path [attr.d]="path"></svg:path>
    }
  \`,
})
export class ${componentName} extends OpOcticonComponentBase {
  protected override SVGData = ${svgDataExportName};
}
    `;

    return {
      key,
      name,
      octicon,
      code
    }
  })
  .sort((a, b) => a.key.localeCompare(b.key))

async function writeIconExport(file) {
  const count = icons.length
  const code = `${GENERATED_HEADER}
import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { OpOcticonComponentBase } from '../octicon-component-base';
import { SVGData } from '../helpers';

${icons.map(({code}) => code).join('\n')}
`
  await fse.writeFile(file, code, 'utf8');
  console.warn('wrote %s with %d exports', file, count)
  return icons
}

fse
  .mkdirs(srcDir)
  .then(() => writeIconExport(iconsFile))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
