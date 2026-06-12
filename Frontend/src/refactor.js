const fs = require('fs');

function refactorFile(file, cssName) {
  let content = fs.readFileSync(file, 'utf8');

  if (cssName === 'Contact') {
    content = content.replace(/import '\.\/Contact\.css';/g, `import styles from './Contact.module.css';`);
  }

  content = content.replace(/className=\"([^\"]+)\"/g, (match, classNames) => {
    let classes = classNames.split(' ').filter(c => c.trim() !== '');
    if (classes.length === 1) {
      return `className={styles['${classes[0]}']}`;
    } else if (classes.length > 1) {
      return `className={\`${classes.map(c => `\${styles['${c}']}`).join(' ')}\`}`;
    }
    return match;
  });

  fs.writeFileSync(file, content);
}

refactorFile('d:/DHARSHIKA-S/PROJECTS/Dazzling-Sky/dazzling-sky/Frontend/src/pages/Contact.js', 'Contact');
refactorFile('d:/DHARSHIKA-S/PROJECTS/Dazzling-Sky/dazzling-sky/Frontend/src/pages/faq/Faq.js', 'Faq');

console.log('Conversion Complete');
