const fs = require('fs');
const path = require('path');
const counter = require('shortest')('abcdefg'.split(''))

const STYLE_HTML_TAG_REGEXP = /<\s*style[^>]*>(.*?)<\s\/\s*style>/g;
const HTML_CLASS_REGEXP = /<\w+?\s+?class\s*=\s*['\"]([^'\"][_a-zA-Z]+[_a-zA-Z0-9- ]*)['\"][^'\"]/g;
const CSS_CLASS_REGEXP = /\.[_a-zA-Z]+[_a-zA-Z0-9-]*/g;

const fileContent = fs.readFileSync(path.join(__dirname, '../dist/index.html')).toString();
const classNamesObjects = [];

const matchCapturingGroups = (string, regexp, capturingGroupId = 1) => Array.from(string.matchAll(regexp), m => m[capturingGroupId]);

const styleTags = matchCapturingGroups(fileContent, STYLE_HTML_TAG_REGEXP);
styleTags.forEach((styleTag) => {
  styleTag.match(CSS_CLASS_REGEXP).forEach((className) => {
    const classNameObjectIndex = classNamesObjects.findIndex((classNameObject) => classNameObject.originalName === className);

    if (classNameObjectIndex === -1) {
      classNamesObjects.push({
        originalName: className,
        count: 1,
      });
    } else {
      classNamesObjects[classNameObjectIndex].count++;
    }
  });
});

const htmlClassNames = matchCapturingGroups(fileContent, HTML_CLASS_REGEXP);
htmlClassNames.forEach((classNames) => {
  classNames.split(' ').forEach((className) => {
    const classNameObjectIndex = classNamesObjects.findIndex((classNameObject) => classNameObject.originalName === className);

    if (classNameObjectIndex === -1) {
      classNamesObjects.push({
        originalName: className,
        count: 1,
      });
    } else {
      classNamesObjects[classNameObjectIndex].count++;
    }
  });
});

const classNamesObjectsSorted = classNamesObjects.sort((a, b) => a.count > b.count ? -1 : 1);
const classNamesObjectsMinified = classNamesObjectsSorted.map((classNamesObject) => ({ ...classNamesObject, minifiedName: counter() }));

console.log('styleTags', styleTags);
console.log('htmlClassNames', htmlClassNames);
console.log('classNamesObjectsSorted', classNamesObjectsSorted);
console.log('classNamesObjectsMinified', classNamesObjectsMinified);