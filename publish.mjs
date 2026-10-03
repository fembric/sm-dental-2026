import {spawnSync, execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {projectRoot} from './site-config.mjs';
process.chdir(projectRoot);
const git = (...args) => execFileSync('git', args, {encoding:'utf8'}).trim();
function run(command, args) {
  const result = spawnSync(command, args, {stdio:'inherit'});
  if (result.error || result.status !== 0) throw Error('Операция не завершена: ' + command + ' ' + args.join(' '));
}
try {
  if (git('branch','--show-current') !== 'main') throw Error('Переключитесь на main перед публикацией.');
  if (git('remote','get-url','origin') !== 'https://github.com/fembric/sm-dental-2026.git') throw Error('Адрес origin отличается от репозитория сайта.');
  run('git',['fetch','origin']);
  // Never overwrite remote changes, force-push, or merge automatically.
  if (git('rev-list','--count','HEAD..origin/main') !== '0') throw Error('На GitHub есть новые изменения. Сначала согласуйте их с локальными файлами.');
  const candidates = git('ls-files','--cached','--others','--exclude-standard','-z').split('\0').filter(Boolean);
  const allowed = /^(?:[\w-]+\.mjs|package(?:-lock)?\.json|[\w-]+\.md|\.gitignore|publish\.cmd|public\/(?:assets|documents)\/[^/]+\.(?:js|css|svg|png|jpe?g|webp|ico|docx|pdf)|\.github\/workflows\/[\w-]+\.ya?ml)$/i;
  const secretPatterns = [/gh[pousr]_[A-Za-z0-9]{20,}/,/github_pat_[A-Za-z0-9_]{20,}/,/-----BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY-----/,/Bearer\s+[A-Za-z0-9._-]{20,}/,/AKIA[0-9A-Z]{16}/];
  for (const file of candidates) {
    if (!allowed.test(file) || /(?:credentials|secrets|\.env|sm-appointments)/i.test(file)) throw Error('Нужна ручная проверка файла: ' + file);
    try {
      if (/\.(?:mjs|js|json|md|yml|yaml|svg|css|cmd)$/i.test(file) && secretPatterns.some(pattern => pattern.test(readFileSync(file,'utf8')))) throw Error('Возможный секрет в файле: ' + file);
    } catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  run(process.execPath,['build.mjs']);
  run(process.execPath,['check.mjs']);
  run('git',['diff','--check']);
  run('git',['add','--all','--',...new Set(candidates)]);
  if (git('diff','--cached','--name-only')) {
    if (!git('config','user.name') || !git('config','user.email')) throw Error('Сначала настройте имя и email автора Git (инструкция в UPDATES.md).');
    run('git',['commit','-m',process.argv.slice(2).join(' ') || 'Update clinic website']);
  }
  run('git',['push','-u','origin','main']);
  console.log('\nФайлы отправлены. GitHub Actions теперь собирает и публикует сайт.');
  console.log('Проверьте зелёный результат: https://github.com/fembric/sm-dental-2026/actions');
  console.log('Сайт: https://fembric.github.io/sm-dental-2026/');
} catch (error) {
  console.error('\nПубликация остановлена. ' + error.message);
  console.error('Файлы сохранены локально. Не используйте force push. Инструкция: UPDATES.md');
  process.exitCode = 1;
}
