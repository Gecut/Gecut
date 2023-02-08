import fs from 'node:fs';
import path from 'node:path';

const preDIR = '.';
const srcDIR = 'src';
const distDIR = 'dist';

const iconTypeList = fs
  .readdirSync(`${preDIR}/${srcDIR}/`)
  .map((i) => path.resolve(`${preDIR}/${srcDIR}/${i}`))
  .slice(0, 10);

const icons = Object.fromEntries(
  iconTypeList.map((iconType) => {
    const iconTypeSplitted = iconType.split('/');
    const _type = iconTypeSplitted[iconTypeSplitted.length - 1];

    const _icons = fs
      .readdirSync(iconType)
      .filter((i) => i.includes('.svg'))
      .map((i) => path.resolve(`${preDIR}/${srcDIR}/${_type}/${i}`));

    if (!fs.existsSync(`${preDIR}/${distDIR}`)) {
      fs.mkdirSync(`${preDIR}/${distDIR}`);
    }
    if (!fs.existsSync(`${preDIR}/${distDIR}/${_type}`)) {
      fs.mkdirSync(`${preDIR}/${distDIR}/${_type}`);
    }

    return [_type, _icons];
  }),
);

for (const icon of Object.values(icons).flat()) {
  let iconSource = fs.readFileSync(icon).toString('utf-8');
  const dist = icon.replace(srcDIR, distDIR);

  iconSource = iconSource.replace(` xmlns="http://www.w3.org/2000/svg"`, '');
  iconSource = iconSource.replace(` width="24"`, '');
  iconSource = iconSource.replace(` height="24"`, '');
  iconSource = iconSource.replace(` viewBox="0 0 24 24"`, '');
  iconSource = iconSource.replace(`<svg`, '<svg viewBox="0 0 24 24"');
  iconSource = iconSource.replaceAll(`#292D32`, `currentColor`);

  fs.writeFileSync(dist, iconSource);

  console.log(dist);
}
